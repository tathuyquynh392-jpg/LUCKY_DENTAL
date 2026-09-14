import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../components/Toast';
import { User, Mail, Phone, Calendar, MapPin, Save } from 'lucide-react';

export const PatientProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '1995-05-12',
    gender: user?.gender || 'Nam',
    address: user?.address || '123 Nguyễn Trãi, Q.5, TP.HCM'
  });

  const [toast, setToast] = useState({ type: 'success', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setToast({ type: 'success', message: 'Cập nhật thông tin cá nhân thành công!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <User className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Hồ Sơ Cá Nhân Bệnh Nhân
          </h1>
          <p className="page-subtitle">Quản lý thông tin liên hệ và lịch sử cá nhân của bạn</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <input
                type="date"
                className="form-control"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ liên hệ</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontWeight: 700, marginTop: '1rem' }}
          >
            <Save size={18} /> Lưu Thay Đổi
          </button>
        </form>
      </div>
    </div>
  );
};
