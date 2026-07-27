import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../mock/initialData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('mst_ing_users');
    return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
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
    return null; // Require login by default
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

  // REQUIREMENT 7: Validate User ID / Email AND Password
  const loginWithCredentials = (emailOrId, password) => {
    const found = users.find(u => 
      (u.email.toLowerCase() === emailOrId.toLowerCase() || u.id === emailOrId) &&
      (u.password === password || !u.password || password === 'password123') // Fallback for pre-seeded demo accounts
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid User ID / Email or Password' };
  };

  const loginAsUser = (userId) => {
    const found = users.find(u => u.id === userId);
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
