import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REQUESTS, INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS } from '../mock/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('mst_ing_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('mst_ing_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('mst_ing_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mst_ing_theme') || 'dark';
  });

  // Global modal state triggered by notifications or table actions
  const [activeNotificationRequest, setActiveNotificationRequest] = useState(null);

  useEffect(() => {
    localStorage.setItem('mst_ing_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('mst_ing_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mst_ing_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('mst_ing_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addAuditLog = (action, user, role, details) => {
    const log = {
      id: `log-${Date.now()}`,
      action,
      user,
      role,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const addNotification = ({ targetUserId = null, targetRole = null, title, message, type = 'info', requestId = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      targetUserId,
      targetRole,
      title,
      message,
      type,
      requestId,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = (user) => {
    setNotifications(prev => prev.map(n => {
      const isForUser = n.targetUserId === user.id || n.targetRole === user.role || n.targetRole === 'All';
      return isForUser ? { ...n, read: true } : n;
    }));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // STEP 1: ING Uploads sheet
  const createOnboardingRequest = (requestData, currentUser) => {
    const newReqId = `REQ-2026-${String(requests.length + 1).padStart(3, '0')}`;
    const newRequest = {
      id: newReqId,
      collegeName: currentUser.collegeName || requestData.collegeName || 'Partner College',
      submittedBy: currentUser.id,
      submitterName: currentUser.name,
      submitterEmail: currentUser.email,
      program: requestData.program,
      studentCount: requestData.students ? requestData.students.length : requestData.studentCount || 0,
      fileName: requestData.fileName || 'student_roster.csv',
      fileSize: requestData.fileSize || '15.2 KB',
      createdAt: new Date().toISOString(),
      status: 'Pending',
      preferredDate: null,
      preferredTime: null,
      assignedMstMembers: [],
      notes: requestData.notes || '',
      rescheduleComment: null,
      accountSheet: null,
      students: requestData.students || []
    };

    setRequests(prev => [newRequest, ...prev]);

    // Audit & Notification to MST
    addAuditLog('SHEET_UPLOAD', currentUser.name, currentUser.role, `Uploaded new roster ${newReqId} for ${newRequest.collegeName}`);
    addNotification({
      targetRole: 'MST Member',
      title: 'New Onboarding Sheet Uploaded',
      message: `${currentUser.name} (${newRequest.collegeName}) uploaded request ${newReqId} with ${newRequest.studentCount} students.`,
      type: 'info',
      requestId: newReqId
    });

    return newRequest;
  };

  // STEP 3: MST Actions onboarding -> Status: Onboarding Completed
  const completeOnboardingTask = (requestId, mstUser) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = { ...req, status: 'Onboarding Completed' };
        return targetReq;
      }
      return req;
    }));

    if (targetReq) {
      addAuditLog('ONBOARDING_COMPLETED', mstUser.name, mstUser.role, `Completed onboarding process for ${requestId} (${targetReq.collegeName})`);
      addNotification({
        targetUserId: targetReq.submittedBy,
        title: 'Onboarding Marked Completed!',
        message: `MST Team member ${mstUser.name} has processed and completed onboarding for ${requestId}. You can now pick your preferred Orientation Date.`,
        type: 'success',
        requestId: requestId
      });
    }
  };

  // Attach Account Details Sheet to Request (Requirement #2)
  const attachAccountSheet = (requestId, fileData, mstUser) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = {
          ...req,
          accountSheet: {
            fileName: fileData.fileName,
            fileSize: fileData.fileSize || '32.0 KB',
            uploadedAt: new Date().toISOString(),
            uploadedBy: mstUser.name
          }
        };
        return targetReq;
      }
      return req;
    }));

    if (targetReq) {
      addAuditLog('ACCOUNT_SHEET_ATTACHED', mstUser.name, mstUser.role, `Attached Account Details Sheet "${fileData.fileName}" to ${requestId}`);
      addNotification({
        targetUserId: targetReq.submittedBy,
        title: 'Account Details Sheet Attached',
        message: `MST Member ${mstUser.name} attached account details sheet (${fileData.fileName}) to request ${requestId}.`,
        type: 'info',
        requestId: requestId
      });
    }
  };

  // STEP 4: ING Selects & Submits Orientation Date & Time
  const submitOrientationDate = (requestId, date, time, notes, ingUser) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = {
          ...req,
          status: 'Date Submitted',
          preferredDate: date,
          preferredTime: time,
          notes: notes ? `${req.notes}\n[Date Note]: ${notes}` : req.notes
        };
        return targetReq;
      }
      return req;
    }));

    if (targetReq) {
      addAuditLog('ORIENTATION_DATE_SUBMITTED', ingUser.name, ingUser.role, `Submitted orientation date ${date} (${time}) for ${requestId}`);
      addNotification({
        targetRole: 'MST Member',
        title: 'Orientation Date Submitted',
        message: `${ingUser.name} (${targetReq.collegeName}) requested orientation on ${date} @ ${time} for ${requestId}.`,
        type: 'warning',
        requestId: requestId
      });
    }
  };

  // STEP 5: MST Reviews & Approves/Updates Status & Assigns Team Members
  const reviewAndAssignOrientation = (requestId, newStatus, assignedMstIds, comment, mstUser) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = {
          ...req,
          status: newStatus,
          assignedMstMembers: assignedMstIds || req.assignedMstMembers,
          rescheduleComment: newStatus === 'Timing Switch' ? comment : null
        };
        return targetReq;
      }
      return req;
    }));

    if (targetReq) {
      addAuditLog('ORIENTATION_REVIEWED', mstUser.name, mstUser.role, `Updated ${requestId} status to ${newStatus}. Assigned MST IDs: ${assignedMstIds.join(', ')}`);
      
      let notifType = 'info';
      if (newStatus === 'Approved') notifType = 'success';
      if (newStatus === 'On Hold') notifType = 'warning';
      if (newStatus === 'Timing Switch') notifType = 'error';

      addNotification({
        targetUserId: targetReq.submittedBy,
        title: `Orientation Request ${newStatus}`,
        message: newStatus === 'Timing Switch' 
          ? `MST Team has requested a timing switch for ${requestId}. Comment: "${comment}"` 
          : `Orientation for ${requestId} has been updated to ${newStatus} by ${mstUser.name}.`,
        type: notifType,
        requestId: requestId
      });
    }
  };

  const deleteRequest = (requestId, user) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    addAuditLog('DELETE_REQUEST', user.name, user.role, `Deleted onboarding request ${requestId}`);
  };

  return (
    <AppContext.Provider value={{
      requests,
      notifications,
      auditLogs,
      theme,
      activeNotificationRequest,
      setActiveNotificationRequest,
      toggleTheme,
      createOnboardingRequest,
      completeOnboardingTask,
      attachAccountSheet,
      submitOrientationDate,
      reviewAndAssignOrientation,
      deleteRequest,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      clearAllNotifications,
      addAuditLog
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
