export const INITIAL_USERS = [
  {
    id: 'u-admin-1',
    name: 'System Administrator',
    email: 'admin@msting.com',
    password: 'password123',
    role: 'Admin',
    department: 'Global Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'u-mst-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@mst.com',
    password: 'password123',
    role: 'MST Member',
    mstRole: 'MST Lead',
    department: 'MST Core Team',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2026-01-15T09:30:00.000Z'
  },
  {
    id: 'u-mst-2',
    name: 'David Chen',
    email: 'david.c@mst.com',
    password: 'password123',
    role: 'MST Member',
    mstRole: 'MST Specialist',
    department: 'Technical Onboarding',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2026-02-01T11:00:00.000Z'
  },
  {
    id: 'u-mst-3',
    name: 'Elena Rostova',
    email: 'elena.r@mst.com',
    password: 'password123',
    role: 'MST Member',
    mstRole: 'Orientation Specialist',
    department: 'Student Logistics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    createdAt: '2026-02-12T14:20:00.000Z'
  },
  {
    id: 'u-ing-1',
    name: 'Apex Institute Tech Rep',
    email: 'rep@apex.ing.edu',
    password: 'password123',
    role: 'ING Member',
    collegeName: 'Apex Tech College',
    department: 'Academic Partnerships',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    createdAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'u-ing-2',
    name: 'Beacon Univ Admin',
    email: 'contact@beacon.ing.edu',
    password: 'password123',
    role: 'ING Member',
    collegeName: 'Beacon State University',
    department: 'Student Affairs',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
    createdAt: '2026-03-10T12:00:00.000Z'
  },
  {
    id: 'u-ing-3',
    name: 'Crestview Coordinator',
    email: 'info@crestview.ing.edu',
    password: 'password123',
    role: 'ING Member',
    collegeName: 'Crestview Academy',
    department: 'Admissions & Onboarding',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    createdAt: '2026-03-15T15:30:00.000Z'
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-001',
    collegeName: 'Apex Tech College',
    submittedBy: 'u-ing-1',
    submitterName: 'Apex Institute Tech Rep',
    submitterEmail: 'rep@apex.ing.edu',
    program: 'B.Tech Computer Science 2026 Batch',
    studentCount: 45,
    fileName: 'apex_cs_2026_roster.csv',
    fileSize: '18.4 KB',
    createdAt: '2026-07-25T09:30:00.000Z',
    status: 'Done',
    preferredDate: '2026-08-05',
    preferredTime: '10:00 AM - 12:00 PM',
    assignedMstMembers: ['u-mst-1', 'u-mst-2'],
    notes: 'Full cohort of 45 students needing system access and orientation on MST workflows.',
    rescheduleComment: null,
    accountSheet: {
      fileName: 'Apex_CS_AccountDetails_Master.xlsx',
      fileSize: '24.5 KB',
      uploadedAt: '2026-07-25T11:00:00.000Z',
      uploadedBy: 'Sarah Jenkins'
    },
    students: [
      { id: 'S101', name: 'Aarav Sharma', email: 'aarav@apex.edu', major: 'CS', phone: '+1 555-0192' },
      { id: 'S102', name: 'Sophia Miller', email: 'sophia@apex.edu', major: 'CS', phone: '+1 555-0193' }
    ]
  },
  {
    id: 'REQ-2026-002',
    collegeName: 'Beacon State University',
    submittedBy: 'u-ing-2',
    submitterName: 'Beacon Univ Admin',
    submitterEmail: 'contact@beacon.ing.edu',
    program: 'School of Management Fall Orientation',
    studentCount: 120,
    fileName: 'beacon_som_fall_students.xlsx',
    fileSize: '42.1 KB',
    createdAt: '2026-07-26T14:15:00.000Z',
    status: 'Done',
    preferredDate: '2026-08-12',
    preferredTime: '01:00 PM - 04:00 PM',
    assignedMstMembers: ['u-mst-1'],
    notes: 'Includes MBA & BBA cohorts. Onboarding verified by MST.',
    rescheduleComment: null,
    accountSheet: {
      fileName: 'Beacon_Management_Portal_Credentials.pdf',
      fileSize: '150.2 KB',
      uploadedAt: '2026-07-26T15:30:00.000Z',
      uploadedBy: 'David Chen'
    },
    students: [
      { id: 'B201', name: 'Noah Wilson', email: 'noah@beacon.edu', major: 'MBA', phone: '+1 555-0211' }
    ]
  },
  {
    id: 'REQ-2026-003',
    collegeName: 'Crestview Academy',
    submittedBy: 'u-ing-3',
    submitterName: 'Crestview Coordinator',
    submitterEmail: 'info@crestview.ing.edu',
    program: 'Healthcare & Nursing Orientation',
    studentCount: 28,
    fileName: 'crestview_nursing_july.csv',
    fileSize: '12.8 KB',
    createdAt: '2026-07-27T08:00:00.000Z',
    status: 'Pending',
    preferredDate: null,
    preferredTime: null,
    assignedMstMembers: [],
    notes: 'Newly uploaded sheet awaiting MST actioning and review.',
    rescheduleComment: null,
    accountSheet: null,
    students: []
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    targetUserId: 'u-ing-2',
    targetRole: 'ING Member',
    title: 'Onboarding Sheet Verified',
    message: 'MST Lead Sarah Jenkins marked REQ-2026-002 as Done. Orientation schedule confirmed.',
    type: 'success',
    requestId: 'REQ-2026-002',
    read: false,
    timestamp: '2026-07-26T16:00:00.000Z'
  },
  {
    id: 'notif-2',
    targetUserId: null,
    targetRole: 'MST Member',
    title: 'New Sheet Uploaded',
    message: 'Crestview Academy uploaded a new onboarding sheet REQ-2026-003.',
    type: 'info',
    requestId: 'REQ-2026-003',
    read: false,
    timestamp: '2026-07-27T08:01:00.000Z'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    action: 'USER_LOGIN',
    user: 'Sarah Jenkins',
    role: 'MST Member',
    details: 'Logged into MST Portal successfully.',
    timestamp: '2026-07-27T08:15:00.000Z'
  }
];
