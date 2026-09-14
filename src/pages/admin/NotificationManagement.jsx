import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { Bell, Plus, Send } from 'lucide-react';

export const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: ''
  });

  const loadData = () => {
    setNotifications(storageService.getNotifications());
    setPatients(storageService.getPatients());
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenAdd = () => {
    setFormData({ userId: 'ALL', title: '', message: '' });
    setIsAddModalOpen(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      setToast({ type: 'error', message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo!' });
      return;
    }

    if (formData.userId === 'ALL') {
      patients.forEach(p => {
        storageService.addNotification({
          userId: p.userId || 'usr-pat1',
          title: formData.title,
          message: formData.message
        });
      });
    } else {
      storageService.addNotification({
        userId: formData.userId,
        title: formData.title,
        message: formData.message
      });
    }

    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Gửi thông báo đến bệnh nhân thành công!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Bell className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Thông Báo
          </h1>
          <p className="page-subtitle">Gửi thông báo nhắc lịch, ưu đãi & hướng dẫn chăm sóc răng miệng</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Gửi Thông Báo Mới
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tiêu đề thông báo</th>
                <th>Nội dung</th>
                <th>Người nhận</th>
                <th>Thời gian gửi</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td><strong>{n.title}</strong></td>
                  <td style={{ color: '#64748b' }}>{n.message}</td>
                  <td><span className="badge badge-info">{n.userId}</span></td>
                  <td>{n.createdAt}</td>
                  <td><span className={`badge ${n.isRead ? 'badge-success' : 'badge-warning'}`}>{n.isRead ? 'Đã đọc' : 'Chưa đọc'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Gửi Thông Báo Mới"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSend}><Send size={16} /> Gửi Ngay</button></>}>
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label className="form-label">Đối tượng nhận *</label>
            <select className="form-control" value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })}>
              <option value="ALL">-- Tất cả bệnh nhân --</option>
              {patients.map(p => <option key={p.id} value={p.userId || p.id}>{p.name} ({p.phone})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tiêu đề thông báo *</label>
            <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung chi tiết *</label>
            <textarea className="form-control" rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required />
          </div>
        </form>
      </Modal>
    </div>
  );
};
