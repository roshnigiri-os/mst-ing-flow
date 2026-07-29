/**
 * xlsxDownload.js
 * 
 * Utility to generate and trigger a valid .xlsx binary download using SheetJS.
 * 
 * - For pre-seeded mock requests (where no real fileDataUrl was captured from
 *   FileReader), this generates a proper OpenXML .xlsx workbook on-the-fly so
 *   Microsoft Excel opens it without "format or extension is not valid" errors.
 * 
 * - For user-uploaded files, the real binary Data URL from FileReader.readAsDataURL()
 *   is passed directly, so those always download cleanly as-is.
 */

import * as XLSX from 'xlsx';

/**
 * Sentinel value: the placeholder MOCK_EXCEL_DATA_URL exported from initialData.js.
 * When a file's stored fileDataUrl equals this (or is null/undefined), we know it
 * is a mock/pre-seeded entry and we should generate a real xlsx on-the-fly.
 */
const MOCK_SENTINEL_PREFIX = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQAY0D2H';

/**
 * Returns true if the given dataUrl is the mock placeholder (not a real uploaded file binary).
 */
export function isMockDataUrl(dataUrl) {
  return !dataUrl || dataUrl.startsWith(MOCK_SENTINEL_PREFIX);
}

/**
 * Generate a real, valid xlsx workbook using SheetJS and trigger a browser download.
 *
 * @param {string} fileName - The desired download filename (e.g. 'roster_sheet.xlsx')
 * @param {string} collegeName - College name to embed in the sheet header
 * @param {string} program - Program/cohort name for context
 */
function downloadMockXlsx(fileName, collegeName, program) {
  const wb = XLSX.utils.book_new();

  // Build sample roster data rows
  const data = [
    ['Student Name', 'Student ID', 'Email', 'Program', 'College'],
    ['Sample Student 1', 'STU-001', 'student1@college.edu', program || 'Program', collegeName || 'College'],
    ['Sample Student 2', 'STU-002', 'student2@college.edu', program || 'Program', collegeName || 'College'],
    ['Sample Student 3', 'STU-003', 'student3@college.edu', program || 'Program', collegeName || 'College'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [{ wch: 24 }, { wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(wb, ws, 'Roster');

  // Write as array buffer and download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'roster_sheet.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/**
 * Main download handler.
 * 
 * - If fileDataUrl is a real binary (user-uploaded via FileReader), downloads it directly.
 * - If fileDataUrl is the mock placeholder or null, generates a proper xlsx via SheetJS.
 * - If sheetLink is provided, opens it in a new tab instead.
 *
 * @param {object} opts
 * @param {string} opts.fileName - Desired download filename
 * @param {string} [opts.fileDataUrl] - Real binary Data URL from FileReader, or MOCK placeholder
 * @param {string} [opts.sheetLink] - Cloud sheet URL (Google Sheets / OneDrive)
 * @param {string} [opts.collegeName] - For generating mock sheet context
 * @param {string} [opts.program] - For generating mock sheet context
 */
export function handleSheetDownload({ fileName, fileDataUrl, sheetLink, collegeName, program }) {
  // Priority 1: cloud sheet link
  if (sheetLink) {
    window.open(sheetLink, '_blank');
    return;
  }

  // Priority 2: real user-uploaded binary Data URL
  if (fileDataUrl && !isMockDataUrl(fileDataUrl)) {
    const a = document.createElement('a');
    a.href = fileDataUrl;
    a.download = fileName || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // Priority 3: mock placeholder → generate a real xlsx using SheetJS
  downloadMockXlsx(fileName, collegeName, program);
}
