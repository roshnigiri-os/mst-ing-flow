// Central Data Store for MST-ING Flow Platform

// Minimal 100% valid Excel (.xlsx) Binary Base64 Data URL for pre-seeded mock files
export const MOCK_EXCEL_DATA_URL = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQAY0D2H/wAAAEIBAAAjAAAAeGwvZXh0ZXJtYWxMaW5rcy9leHRlcm5hbExpbmsxLnhtbKyQwU6EMBBF9yv8g+adFgQLY8a4wIQYtyZeN+2gCU3pTOXz/bZCSESJixvnvbmvvTfT+d1W8Y6c6lqpyHhIEIC5L1WthYrV1z5eI3AYbKsqj1qpyLg2ms+3Nynp8T5qHw9tZEu8VBE4eJc0tQfFwYfTqB2Y7zB3cTAYf1e6qI0x1h96rX6t8mIdk4g0FglZkkWyyPPAkzxNsjwjH/Msz9dZFtH/8pEsD1wI0fB3iQnO8q7h4cWv2ZtMszVz8v0a2z+Kq60zO2b/AgAA//8DAFBLAwQUAAYACAAAACEAtS8gZPYAAAB1AgAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbJSQQU7DMBBF95zCBLuPnaRtoapKhUQchAVcYMfppImTY2OHgdvjJAa0SFFt2c3r//2feTO32xWj4CAtamMRxREBiU210b3G67t8vEXgwNhaKRk0Go0epmH/sp2dvea2Xl1Fq73W1tXQxR6EgF9qayg2xR0Y7xQW1j942z61YmI0tS48dO9/l8uH47GZJ6m5b7cTfI/s5uF63s6TzT6p85x003eSpSgI53kWkhmSOUkznmf0NfU59TnlOfU5zUj/g5J02w8hBP2435+b6N0e+F1bY6p605hL3l/A1e0y+QEAAP//AwBQSwMEFAABAAgAAAAhACF3N3X2AAAAgAEAABQAAAB4bC9zaGFyZWRTdHJpbmdzLnhtbJSRTW7CMBSEe04R0l2/i9hRVSWUpQsWSN04wTZy4kfxXwT320dACImAom2XmffeeGbymmzeoxf0oT4aaTLKowwo39fa1JlG12Xz1Ebgh7G14aFkmi04zeO3m7L420jX+8m2WmjXF/VbO8Mh2qT1e67YhN0o9j2o/W521j86U7Q+2H52Z/1DlaVzTKU9569u0172h3E48G6p/rXm+O29hQeO81dngc9hT+vTfB4995nmlOfUZ6+0xZwn3gN8s93/AAAA//8DAFBLAwQUAAYACAAAACEATiGZp6wAAABRAQAAEwAAAHhsL3RoZW1lL3RoZW1lMS54bWxQSwECLTAFAAYACAAAACEAl/XNq+AAAAD0AAAAGwAAAAAAAAAAAAAAAAAYBgAAeGwvX3JlbHMvd29ya2Jvb2sucmVsc1BLAQItABQABgAIAAAAIQCXTz5lyAAAAGoBAAASAAAAAAAAAAAAAAAAAG4HAAB4bC93b3JrYm9vay54bWxQSwECLTAFAAYACAAAACEAnP22S90AAABvAgAANwAAAAAAAAAAAAAAAAA1CAAAeGwvcHJpbnRTZXR0aW5ncy9wcmludFNldHRpbmdzMS5zaG5QSwECLTAFAAEACAAAACEANozxxEwAAABQAAAACwAAAAAAAAAAAAAAAAA+CQAAX3JlbHMvLnJlbHNQSwECLTAFAAYACAAAACEAmPupadsBAAA7BAAAEAAAAAAAAAAAAAAAAACECgAAeGwvc3R5bGVzLnhtbFBLAQItABQABgAIAAAAIQDz1B+Z0wAAACMBAAAaAAAAAAAAAAAAAAAAAGwMAAB4bC9kb2N1bWVudFByb3BzL2FwcC54bWxQSwECLTAFAAEACAAAACEAE2ayZc0AAAD1AAAADwAAAAAAAAAAAAAAAAAXDgAAeGwvd29ya3NoZWV0LmJpblBLAQItABQABgAIAAAAIQCSyB0J3QAAABABAAARAAAAAAAAAAAAAAAAADcPAABkb2NQcm9wcy9jb3JlLnhtbFBLAQItABQAAgAIAAAAIQCSyB0J3QAAABABAAARAAAAAAAAAAAAAAAAADcPAABkb2NQcm9wcy9jb3JlLnhtbFBLBgAAAAANAA0AcgIAAMkREAAAAA==';

export const INITIAL_USERS = [
  {
    id: 'u-admin-1',
    name: 'System Administrator',
    email: 'roshni.giri@innovatetech.co',
    password: 'password123',
    role: 'Admin',
    department: 'Global Operations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RoshniAdmin'
  },
  {
    id: 'u-mst-1',
    name: 'MST_Account1',
    email: 'mstaccount1@mst.sg',
    password: 'password123',
    role: 'MST Member',
    mstRole: 'MST Specialist',
    department: 'Operations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MSTAccount1'
  },
  {
    id: 'u-mst-2',
    name: 'MST_Account2',
    email: 'mstaccount2@mst.sg',
    password: 'password123',
    role: 'MST Member',
    mstRole: 'MST Specialist',
    department: 'Operations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MSTAccount2'
  },
  {
    id: 'u-ing-1',
    name: 'Apex_ING',
    email: 'apexaccount@mst.sg',
    password: 'password123',
    role: 'ING Member',
    collegeName: 'Apex College',
    department: 'Admissions & Onboarding',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ApexING'
  },
  {
    id: 'u-ing-2',
    name: 'HCK_ING 1',
    email: 'hckaccount1@mst.sg',
    password: 'password123',
    role: 'ING Member',
    collegeName: 'HCK',
    department: 'Academic Partnerships',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HCKING1'
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-001',
    collegeName: 'Apex College',
    submittedBy: 'u-ing-1',
    submitterName: 'Apex_ING',
    submitterEmail: 'apexaccount@mst.sg',
    program: 'Computer Science Fall 2026 Batch',
    studentCount: 48,
    fileName: 'apex_cs_2026_roster.xlsx',
    fileSize: '24.5 KB',
    fileDataUrl: MOCK_EXCEL_DATA_URL,
    sheetLink: null,
    submissionType: 'file',
    createdAt: '2026-07-20T10:30:00Z',
    status: 'Completed',
    onboardingStatus: 'Completed',
    orientationStatus: 'Orientation Completed',
    preferredDate: '2026-08-05',
    preferredTime: '10:00 AM - 12:00 PM',
    assignedMstMembers: ['u-mst-1'],
    notes: 'Requires 45 lab computers with Python 3.11 installed.',
    rescheduleComment: null,
    accountSheet: {
      fileName: 'apex_cs2026_account_details.xlsx',
      fileSize: '42.0 KB',
      fileDataUrl: MOCK_EXCEL_DATA_URL,
      uploadedAt: '2026-07-22T14:15:00Z',
      uploadedBy: 'MST_Account1'
    }
  },
  {
    id: 'REQ-2026-002',
    collegeName: 'HCK',
    submittedBy: 'u-ing-2',
    submitterName: 'HCK_ING 1',
    submitterEmail: 'hckaccount1@mst.sg',
    program: 'Business Administration Cohort A',
    studentCount: 65,
    fileName: 'hck_bus_admin_roster.xlsx',
    fileSize: '31.2 KB',
    fileDataUrl: MOCK_EXCEL_DATA_URL,
    sheetLink: 'https://docs.google.com/spreadsheets/d/sample-hck-roster',
    submissionType: 'link',
    createdAt: '2026-07-23T11:00:00Z',
    status: 'Ongoing',
    onboardingStatus: 'Ongoing',
    orientationStatus: 'Orientation Pending',
    preferredDate: null,
    preferredTime: null,
    assignedMstMembers: ['u-mst-2'],
    notes: 'Orientation for international exchange students.',
    rescheduleComment: null,
    accountSheet: null
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    targetUserId: 'u-ing-1',
    targetRole: 'ING Member',
    title: 'Onboarding Verified & Completed',
    message: 'MST_Account1 verified onboarding sheet REQ-2026-001 for Apex College.',
    type: 'success',
    requestId: 'REQ-2026-001',
    read: false,
    timestamp: '2026-07-22T14:15:00Z'
  },
  {
    id: 'notif-2',
    targetRole: 'MST Member',
    title: 'New Sheet Submitted by HCK',
    message: 'HCK_ING 1 submitted roster sheet REQ-2026-002.',
    type: 'info',
    requestId: 'REQ-2026-002',
    read: false,
    timestamp: '2026-07-23T11:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-101',
    action: 'SHEET_UPLOAD',
    user: 'Apex_ING',
    role: 'ING Member',
    details: 'Uploaded onboarding request REQ-2026-001 for Apex College',
    timestamp: '2026-07-20T10:30:00Z'
  },
  {
    id: 'log-102',
    action: 'STATUS_UPDATE',
    user: 'MST_Account1',
    role: 'MST Member',
    details: 'Updated onboarding status for REQ-2026-001 to Completed',
    timestamp: '2026-07-22T14:15:00Z'
  }
];
