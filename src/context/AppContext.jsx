import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REQUESTS, INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS } from '../mock/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('mst_ing_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure onboardingStatus and orientationStatus fields exist on all loaded requests
        return parsed.map(r => ({
          ...r,
          onboardingStatus: r.onboardingStatus || (r.status === 'Completed' || r.status === 'Done' ? 'Completed' : (r.status === 'On Hold' ? 'On Hold' : (r.status === 'Issue' ? 'Issue' : 'Ongoing'))),
          orientationStatus: r.orientationStatus || (r.status === 'Orientation Completed' ? 'Orientation Completed' : (r.status === 'Orientation Scheduled' || r.status === 'Approved' ? 'Orientation Scheduled' : (r.status === 'Orientation Switch' || r.status === 'Timing Switch' ? 'Orientation Switch' : 'Orientation Pending')))
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REQUESTS;
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
    document.documentElement.classList.add('dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme('dark');
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

  const createOnboardingRequest = (requestData, currentUser) => {
    const newReqId = `REQ-2026-${String(requests.length + 1).padStart(3, '0')}`;
    const newRequest = {
      id: newReqId,
      collegeName: currentUser.collegeName || requestData.collegeName || 'Partner College',
      submittedBy: currentUser.id,
      submitterName: currentUser.name,
      submitterEmail: currentUser.email,
      program: requestData.program,
      studentCount: requestData.studentCount || 45,
      fileName: requestData.fileName || (requestData.sheetLink ? 'Google_Sheets_Cloud_Roster' : 'student_roster.csv'),
      fileSize: requestData.fileSize || 'Cloud Link',
      sheetLink: requestData.sheetLink || null,
      submissionType: requestData.sheetLink ? 'link' : 'file',
      createdAt: new Date().toISOString(),
      status: 'Ongoing',
      onboardingStatus: 'Ongoing', // Independent Default
      orientationStatus: 'Orientation Pending', // Independent Default
      preferredDate: null,
      preferredTime: null,
      assignedMstMembers: [],
      notes: requestData.notes || '',
      rescheduleComment: null,
      accountSheet: null,
      students: []
    };

    setRequests(prev => [newRequest, ...prev]);

    addAuditLog('SHEET_UPLOAD', currentUser.name, currentUser.role, `Uploaded new roster ${newReqId} for ${newRequest.collegeName}`);
    addNotification({
      targetRole: 'MST Member',
      title: 'New Onboarding Sheet Submitted',
      message: `${currentUser.name} (${newRequest.collegeName}) submitted request ${newReqId}.`,
      type: 'info',
      requestId: newReqId
    });

    return newRequest;
  };

  const updateOnboardingRequest = (requestId, updatedFields, user) => {
    let updatedReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        updatedReq = { ...req, ...updatedFields };
        return updatedReq;
      }
      return req;
    }));

    if (updatedReq) {
      addAuditLog('REQUEST_UPDATED', user.name, user.role, `Updated onboarding request ${requestId}`);
    }
  };

  // INDEPENDENT UPDATE FUNCTION 1: Update Onboarding Status solely (mid-table)
  const updateOnboardingStatus = (requestId, newStatus, user) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = {
          ...req,
          onboardingStatus: newStatus,
          status: newStatus // Sync root status for fallback
        };
        return targetReq;
      }
      return req;
    }));

    if (targetReq) {
      addAuditLog('ONBOARDING_STATUS_UPDATE', user.name, user.role, `Updated onboarding status for ${requestId} to ${newStatus}`);
      addNotification({
        targetUserId: targetReq.submittedBy,
        title: `Onboarding Status Updated: ${newStatus}`,
        message: `MST Team updated onboarding status for ${requestId} to ${newStatus}.`,
        type: newStatus === 'Completed' ? 'success' : (newStatus === 'On Hold' ? 'warning' : 'info'),
        requestId: requestId
      });
    }
  };

  // INDEPENDENT UPDATE FUNCTION 2: Update Orientation Status solely (end-table)
  const updateOrientationStatus = (requestId, newAction, user, comment = null) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = {
          ...req,
          orientationStatus: newAction,
          rescheduleComment: comment || req.rescheduleComment
        };
        return targetReq;
      }
      return req;
    }));

    if (targetReq) {
      addAuditLog('ORIENTATION_STATUS_UPDATE', user.name, user.role, `Updated orientation status for ${requestId} to ${newAction}`);
      addNotification({
        targetUserId: targetReq.submittedBy,
        title: `Orientation Status: ${newAction}`,
        message: `Orientation action for ${requestId} set to ${newAction} by ${user.name}.`,
        type: newAction === 'Orientation Completed' ? 'success' : 'info',
        requestId: requestId
      });
    }
  };

  const completeOnboardingTask = (requestId, mstUser) => {
    updateOnboardingStatus(requestId, 'Completed', mstUser);
  };

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
            uploadedBy: mstUser.name,
            sheetLink: fileData.sheetLink || null
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

  const submitOrientationDate = (requestId, date, time, notes, ingUser) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = {
          ...req,
          orientationStatus: 'Orientation Scheduled',
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

  const reviewAndAssignOrientation = (requestId, actionChoice, assignedMstIds, comment, mstUser) => {
    let targetReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetReq = {
          ...req,
          orientationStatus: actionChoice,
          assignedMstMembers: assignedMstIds || req.assignedMstMembers,
          rescheduleComment: (actionChoice === 'Orientation Switch' || actionChoice === 'Issue' || actionChoice === 'On Hold') ? comment : req.rescheduleComment
        };
        return targetReq;
      }
      return req;
    }));

    if (targetReq) {
      addAuditLog('ORIENTATION_REVIEWED', mstUser.name, mstUser.role, `Updated ${requestId} orientation action to ${actionChoice}. Assigned MST IDs: ${(assignedMstIds || []).join(', ')}`);
      
      let notifType = 'info';
      if (actionChoice === 'Orientation Scheduled' || actionChoice === 'Orientation Completed') notifType = 'success';
      if (actionChoice === 'Orientation Switch') notifType = 'error';

      addNotification({
        targetUserId: targetReq.submittedBy,
        title: `Orientation Action: ${actionChoice}`,
        message: actionChoice === 'Orientation Switch'
          ? `MST Team requested a timing switch for ${requestId}. Comment: "${comment}"` 
          : `Orientation action for ${requestId} updated to ${actionChoice} by ${mstUser.name}.`,
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
      updateOnboardingRequest,
      updateOnboardingStatus,
      updateOrientationStatus,
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
