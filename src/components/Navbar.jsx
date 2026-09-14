import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, ShieldCheck, HeartPulse, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = ({ toggleMobileSidebar }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      position: 'sticky',
      top: 0,
      zIndex: 80,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn-icon"
          onClick={toggleMobileSidebar}
          style={{ display: 'none' }}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartPulse size={24} style={{ color: '#0ea5e9' }} />
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
            Lucky Dental System
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification Link */}
        <Link
          to={user?.role === 'ADMIN' ? '/admin/notifications' : user?.role === 'DOCTOR' ? '/doctor/notifications' : '/patient/notifications'}
          style={{
            position: 'relative',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            borderRadius: '50%',
            backgroundColor: '#f8fafc'
          }}
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#f43f5e'
          }} />
        </Link>

        {/* User Badge Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: user?.role === 'ADMIN' ? '#0ea5e9' : user?.role === 'DOCTOR' ? '#f59e0b' : '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.2' }}>
              {user?.name || 'Tài khoản'}
            </span>
            <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <ShieldCheck size={12} style={{ color: user?.role === 'ADMIN' ? '#0ea5e9' : user?.role === 'DOCTOR' ? '#f59e0b' : '#10b981' }} />
              {user?.role === 'ADMIN' ? 'Quản Trị Viên' : user?.role === 'DOCTOR' ? 'Bác Sĩ' : 'Bệnh Nhân'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
