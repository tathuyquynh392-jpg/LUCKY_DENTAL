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

  const login = (username, password) => {
    const users = storageService.getUsers();
    const found = users.find(
      u => (u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === username.trim().toLowerCase()) && u.password === password
    );

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
