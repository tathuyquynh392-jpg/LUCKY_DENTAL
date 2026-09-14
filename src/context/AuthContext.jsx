import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = storageService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (usernameInput, passwordInput) => {
    const cleanUsername = (usernameInput || '').trim().toLowerCase();
    const cleanPassword = (passwordInput || '').trim();

    const users = storageService.getUsers();

    // 1. Direct match in local database
    let found = users.find(
      u => (
        u.username?.toLowerCase() === cleanUsername ||
        u.email?.toLowerCase() === cleanUsername
      ) && u.password === cleanPassword
    );

    // 2. Demo credentials fallback check for production static hosting on GitHub Pages
    if (!found) {
      if ((cleanUsername === 'admin' || cleanUsername === 'admin@luckydental.com') && cleanPassword === 'admin123') {
        found = users.find(u => u.role === 'ADMIN') || {
          id: 'usr-admin',
          username: 'admin',
          name: 'Nguyễn Văn Quản Lý',
          role: 'ADMIN',
          email: 'admin@luckydental.com',
          phone: '0901234567'
        };
      } else if ((cleanUsername === 'patient' || cleanUsername === 'patient@luckydental.com') && cleanPassword === 'patient123') {
        found = users.find(u => u.role === 'PATIENT') || {
          id: 'usr-pat1',
          username: 'patient',
          name: 'Trần Thị Bệnh Nhân',
          role: 'PATIENT',
          email: 'patient@luckydental.com',
          phone: '0988776655',
          patientId: 'pat-1'
        };
      }
    }

    if (found) {
      const sessionUser = {
        id: found.id,
        username: found.username,
        name: found.name,
        role: found.role,
        email: found.email,
        phone: found.phone,
        patientId: found.patientId,
        doctorId: found.doctorId
      };
      setUser(sessionUser);
      storageService.setCurrentUser(sessionUser);
      return { success: true, user: sessionUser };
    }

    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
  };

  const logout = () => {
    setUser(null);
    storageService.setCurrentUser(null);
  };

  const updateUserProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    storageService.setCurrentUser(updated);

    const users = storageService.getUsers();
    const newUsers = users.map(u => u.id === user.id ? { ...u, ...updatedFields } : u);
    storageService.saveUsers(newUsers);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
