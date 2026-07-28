// Central Data Store for MST-ING Flow Platform

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
    fileName: 'apex_cs_2026_roster.csv',
    fileSize: '24.5 KB',
    sheetLink: null,
    submissionType: 'file',
    createdAt: '2026-07-20T10:30:00Z',
    status: 'Completed',
    preferredDate: '2026-08-05',
    preferredTime: '10:00 AM - 12:00 PM',
    assignedMstMembers: ['u-mst-1'],
    notes: 'Requires 45 lab computers with Python 3.11 installed.',
    rescheduleComment: null,
    accountSheet: {
      fileName: 'apex_cs2026_account_details.xlsx',
      fileSize: '42.0 KB',
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
    sheetLink: 'https://docs.google.com/spreadsheets/d/sample-hck-roster',
    submissionType: 'link',
    createdAt: '2026-07-23T11:00:00Z',
    status: 'Pending',
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
