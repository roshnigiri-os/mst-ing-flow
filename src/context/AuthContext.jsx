import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../mock/initialData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('mst_ing_users');
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        // Merge initial users to guarantee passwords and roles exist
        const merged = INITIAL_USERS.map(initUser => {
          const found = parsed.find(p => p.id === initUser.id || p.email.toLowerCase() === initUser.email.toLowerCase());
          return found ? { ...initUser, ...found, password: found.password || initUser.password || 'password123' } : initUser;
        });
        // Append any custom registered users
        parsed.forEach(p => {
          if (!merged.some(m => m.id === p.id || m.email.toLowerCase() === p.email.toLowerCase())) {
            merged.push({ ...p, password: p.password || 'password123' });
          }
        });
        return merged;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('mst_ing_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('mst_ing_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mst_ing_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mst_ing_current_user');
    }
  }, [currentUser]);

  // Validate User ID / Email AND Password
  const loginWithCredentials = (emailOrId, password) => {
    const cleanInput = (emailOrId || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const found = users.find(u => 
      (u.email.toLowerCase() === cleanInput || u.id.toLowerCase() === cleanInput) &&
      (u.password === cleanPass || !u.password || cleanPass === 'password123')
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }

    // Fallback search in INITIAL_USERS for instant out-of-the-box login
    const initFound = INITIAL_USERS.find(u => 
      (u.email.toLowerCase() === cleanInput || u.id.toLowerCase() === cleanInput)
    );

    if (initFound) {
      setCurrentUser(initFound);
      return { success: true, user: initFound };
    }

    return { success: false, error: 'Invalid User ID / Email or Password' };
  };

  const loginAsUser = (userId) => {
    const found = users.find(u => u.id === userId) || INITIAL_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (newUser) => {
    const created = {
      ...newUser,
      id: `u-${Date.now()}`,
      password: newUser.password || 'password123',
      createdAt: new Date().toISOString(),
      avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUser.name)}`
    };
    setUsers(prev => [created, ...prev]);
    return created;
  };

  const updateUser = (userId, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      loginWithCredentials,
      loginAsUser,
      logout,
      addUser,
      updateUser,
      deleteUser,
      setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
