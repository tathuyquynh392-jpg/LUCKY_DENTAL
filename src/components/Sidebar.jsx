import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  CalendarDays,
  FileText,
  Activity,
  Pill,
  Receipt,
  CreditCard,
  UserCog,
  Bell,
  BarChart3,
  LogOut,
  Sparkles,
  PlusCircle
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/patients', label: 'Bệnh nhân', icon: Users },
    { to: '/admin/doctors', label: 'Bác sĩ', icon: UserCheck },
    { to: '/admin/services', label: 'Dịch vụ', icon: Stethoscope },
    { to: '/admin/appointments', label: 'Lịch hẹn', icon: Calendar },
    { to: '/admin/calendar', label: 'Lịch khám', icon: CalendarDays },
    { to: '/admin/medical-records', label: 'Hồ sơ khám', icon: FileText },
    { to: '/admin/treatments', label: 'Điều trị', icon: Activity },
    { to: '/admin/medications', label: 'Thuốc', icon: Pill },
    { to: '/admin/invoices', label: 'Hóa đơn', icon: Receipt },
    { to: '/admin/payments', label: 'Thanh toán', icon: CreditCard },
    { to: '/admin/users', label: 'Tài khoản', icon: UserCog },
    { to: '/admin/notifications', label: 'Thông báo', icon: Bell },
    { to: '/admin/reports', label: 'Báo cáo', icon: BarChart3 }
  ];

  const patientNav = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/profile', label: 'Hồ sơ cá nhân', icon: Users },
    { to: '/patient/appointments/create', label: 'Đặt lịch khám', icon: PlusCircle },
    { to: '/patient/appointments', label: 'Lịch hẹn của tôi', icon: Calendar },
    { to: '/patient/medical-records', label: 'Lịch sử khám', icon: FileText },
    { to: '/patient/treatments', label: 'Quá trình điều trị', icon: Activity },
    { to: '/patient/invoices', label: 'Hóa đơn & Thanh toán', icon: Receipt },
    { to: '/patient/notifications', label: 'Thông báo', icon: Bell }
  ];

  const items = user?.role === 'ADMIN' ? adminNav : patientNav;

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0,
      transition: 'transform 0.3s ease',
      zIndex: 90
    }}>
      {/* Brand Logo Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
        }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            LUCKY DENTAL
          </h2>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '-2px' }}>
            Dental Management
          </p>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div style={{
        margin: '1rem 1.25rem 0.5rem 1.25rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        backgroundColor: user?.role === 'ADMIN' ? '#0284c71e' : '#10b9811e',
        border: `1px solid ${user?.role === 'ADMIN' ? '#0ea5e940' : '#10b98140'}`,
        color: user?.role === 'ADMIN' ? '#38bdf8' : '#34d399',
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>ROLE: {user?.role || 'GUEST'}</span>
        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8 }}>ONLINE</span>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '0.75rem 0.875rem', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => isMobileOpen && toggleMobileSidebar()}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.875rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#0284c7' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Footer */}
      <div style={{ padding: '1rem 0.875rem', borderTop: '1px solid #1e293b' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.875rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#f43f5e',
            backgroundColor: '#331b24',
            border: '1px solid #881337',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
