import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Toast } from '../../components/Toast';
import { Bell, CheckCheck } from 'lucide-react';

export const PatientNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const loadData = () => {
    if (user) {
      const list = storageService.getNotificationsForUser(user);
      setNotifications(list);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleMarkRead = (id) => {
    storageService.markNotificationRead(id);
    loadData();
  };

  const handleMarkAllRead = () => {
    if (user) {
      storageService.markAllNotificationsReadForUser(user);
      loadData();
      setToast({ type: 'success', message: 'Đã đánh dấu tất cả thông báo là đã đọc!' });
    }
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Bell className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Hộp Thư Thông Báo
          </h1>
          <p className="page-subtitle">Nhắc lịch hẹn, thông tin thanh toán & thông báo từ phòng khám</p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={18} /> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            Hộp thư thông báo của bạn đang trống.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className="card"
              onClick={() => handleMarkRead(n.id)}
              style={{
                backgroundColor: n.isRead ? '#ffffff' : '#f0f9ff',
                borderLeft: `4px solid ${n.isRead ? '#cbd5e1' : '#0ea5e9'}`,
                cursor: 'pointer',
                marginBottom: 0
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{n.title}</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.createdAt}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', marginTop: '0.5rem', lineHeight: 1.5 }}>
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
