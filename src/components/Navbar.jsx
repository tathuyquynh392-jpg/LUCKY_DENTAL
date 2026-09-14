import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage';
import { Bell, ShieldCheck, HeartPulse, Menu, CheckCheck, ExternalLink, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ toggleMobileSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  const loadNotifications = () => {
    if (user) {
      const userNotifs = storageService.getNotificationsForUser(user);
      setNotifications(userNotifs);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [user]);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsReadForUser(user);
    loadNotifications();
  };

  const handleNotificationClick = (notif) => {
    storageService.markNotificationRead(notif.id);
    loadNotifications();
    setIsNotifOpen(false);

    if (notif.link) {
      navigate(notif.link);
    } else {
      const targetPage = user?.role === 'ADMIN' ? '/admin/notifications' : user?.role === 'DOCTOR' ? '/doctor/notifications' : '/patient/notifications';
      navigate(targetPage);
    }
  };

  const notifAllPage = user?.role === 'ADMIN' ? '/admin/notifications' : user?.role === 'DOCTOR' ? '/doctor/notifications' : '/patient/notifications';

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
        
        {/* Notification Bell Dropdown Button */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
              position: 'relative',
              color: isNotifOpen ? '#0284c7' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: '50%',
              backgroundColor: isNotifOpen ? '#e0f2fe' : '#f8fafc',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Thông báo hệ thống"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                minWidth: '18px',
                height: '18px',
                borderRadius: '9999px',
                backgroundColor: '#f43f5e',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 2px 5px rgba(244, 63, 94, 0.4)'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Menu */}
          {isNotifOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '360px',
              maxWidth: '90vw',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 12px 30px -5px rgba(0,0,0,0.15), 0 4px 12px -2px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              zIndex: 100
            }}>
              {/* Popover Header */}
              <div style={{
                padding: '0.875rem 1rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Thông báo</strong>
                  {unreadCount > 0 && (
                    <span className="badge badge-danger" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                      {unreadCount} mới
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#0284c7',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <CheckCheck size={14} /> Đánh dấu đã đọc
                  </button>
                )}
              </div>

              {/* Popover Notification List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                    Chưa có thông báo nào
                  </div>
                ) : (
                  notifications.slice(0, 8).map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        padding: '0.875rem 1rem',
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: n.isRead ? '#ffffff' : '#f0f9ff',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: n.isRead ? 'transparent' : '#0284c7',
                        marginTop: '0.4rem',
                        flexShrink: 0
                      }} />

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: n.isRead ? 600 : 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                          {n.createdAt}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Popover Footer */}
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => { setIsNotifOpen(false); navigate(notifAllPage); }}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#0284c7',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                >
                  Xem tất cả thông báo <ExternalLink size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <Link
          to={user?.role === 'ADMIN' ? '/admin/profile' : user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/profile'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0ea5e9' }}
            />
          ) : (
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
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.2' }}>
              {user?.name || 'Tài khoản'}
            </span>
            <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <ShieldCheck size={12} style={{ color: user?.role === 'ADMIN' ? '#0ea5e9' : user?.role === 'DOCTOR' ? '#f59e0b' : '#10b981' }} />
              {user?.role === 'ADMIN' ? 'Quản Trị Viên' : user?.role === 'DOCTOR' ? 'Bác Sĩ' : 'Bệnh Nhân'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
