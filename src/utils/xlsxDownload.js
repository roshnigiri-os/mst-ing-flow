/**
 * xlsxDownload.js
 *
 * Reliable file download utility for MST-ING Flow.
 *
 * Root cause of "Excel cannot open file" error:
 *   Chrome/Edge impose a ~2 MB limit on data URL anchor downloads. When a base64
 *   data URL is set directly on <a>.href and .click() is called, the browser may
 *   silently truncate the payload, producing a corrupt file that Excel rejects.
 *
 * Fix for ALL file types (uploaded or mock):
 *   1. Convert the base64 data URL → binary Uint8Array → Blob (preserving MIME type).
 *   2. Create a short-lived Object URL with URL.createObjectURL(blob).
 *   3. Trigger download via the Object URL, then revoke it after 3 s.
 *
 * For pre-seeded mock records that have no real file (fileDataUrl is null or the
 * legacy placeholder), SheetJS generates a valid .xlsx workbook on-the-fly.
 */

import * as XLSX from 'xlsx';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Convert a base64 Data URL to a Blob, preserving the MIME type embedded in
 * the data URL. This avoids Chrome/Edge's ~2 MB anchor-href limit.
 *
 * @param {string} dataUrl  e.g. "data:application/vnd.openxmlformats-...;base64,AAAA…"
 * @returns {Blob}
 */
function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Trigger a browser download for a Blob using a temporary Object URL.
 *
 * @param {Blob}   blob
 * @param {string} fileName  Desired download filename
 */
function triggerBlobDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'document';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

// ─── Mock/pre-seeded detection ───────────────────────────────────────────────

/**
 * The legacy placeholder stored in initialData.js for pre-seeded mock requests.
 * Any real user-uploaded file will have a different (longer) base64 payload.
 */
const MOCK_SENTINEL_PREFIX =
  'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQAY0D2H';

/**
 * Returns true when there is no real binary – i.e. the value is absent or is
 * the legacy placeholder stub that Excel cannot open.
 */
export function isMockDataUrl(dataUrl) {
  return !dataUrl || dataUrl.startsWith(MOCK_SENTINEL_PREFIX);
}

// ─── SheetJS mock generator ──────────────────────────────────────────────────

/**
 * Generate a genuinely valid .xlsx workbook via SheetJS and download it.
 * Used when no real uploaded binary is available.
 *
 * @param {string} fileName
 * @param {string} collegeName
 * @param {string} program
 */
function downloadGeneratedXlsx(fileName, collegeName, program) {
  const wb = XLSX.utils.book_new();

  const data = [
    ['Student Name', 'Student ID', 'Email', 'Program', 'College'],
    ['Sample Student 1', 'STU-001', 'student1@college.edu', program || 'Program', collegeName || 'College'],
    ['Sample Student 2', 'STU-002', 'student2@college.edu', program || 'Program', collegeName || 'College'],
    ['Sample Student 3', 'STU-003', 'student3@college.edu', program || 'Program', collegeName || 'College'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 24 }, { wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Roster');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Ensure the file has a proper .xlsx extension
  const safeName = (fileName || 'roster_sheet.xlsx').replace(/\.[^.]+$/, '') + '.xlsx';
  triggerBlobDownload(blob, safeName);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Universal sheet download handler.
 *
 * Priority order:
 *   1. Cloud link  → open in new tab
 *   2. Real binary data URL  → convert to Blob via dataUrlToBlob, download via Object URL
 *   3. No/mock data URL  → generate valid .xlsx with SheetJS, download via Object URL
 *
 * @param {object} opts
 * @param {string}  opts.fileName      Desired filename for download
 * @param {string} [opts.fileDataUrl]  Base64 data URL from FileReader (may be mock/null)
 * @param {string} [opts.sheetLink]    Cloud URL (Google Sheets / OneDrive)
 * @param {string} [opts.collegeName]  College name – used when generating mock xlsx
 * @param {string} [opts.program]      Program name – used when generating mock xlsx
 */
export function handleSheetDownload({ fileName, fileDataUrl, sheetLink, collegeName, program }) {
  // 1. Cloud link
  if (sheetLink) {
    window.open(sheetLink, '_blank');
    return;
  }

  // 2. Real user-uploaded binary → convert data URL to Blob, download via Object URL
  if (fileDataUrl && !isMockDataUrl(fileDataUrl)) {
    try {
      const blob = dataUrlToBlob(fileDataUrl);
      triggerBlobDownload(blob, fileName || 'document');
    } catch (err) {
      console.error('[xlsxDownload] dataUrlToBlob failed, falling back to SheetJS:', err);
      downloadGeneratedXlsx(fileName, collegeName, program);
    }
    return;
  }

  // 3. No real binary (pre-seeded mock) → generate valid xlsx on-the-fly
  downloadGeneratedXlsx(fileName, collegeName, program);
}
