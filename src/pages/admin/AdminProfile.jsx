import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Toast } from '../../components/Toast';
import { UserCheck, Shield, KeyRound, Save, Lock, Mail, Phone, MapPin, Camera } from 'lucide-react';

export const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || 'admin',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || 'Phòng quản trị, Lucky Dental',
    avatar: user?.avatar || ''
  });

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [toast, setToast] = useState({ type: 'success', message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || 'admin',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || 'Phòng quản trị, Lucky Dental',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  // Handle Avatar Image Upload & Data URL conversion
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', message: 'Vui lòng chọn một file ảnh hợp lệ!' });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setToast({ type: 'error', message: 'Dung lượng ảnh không được vượt quá 3MB!' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData(prev => ({ ...prev, avatar: uploadEvent.target.result }));
      setToast({ type: 'success', message: 'Đã tải ảnh lên! Hãy nhấn "Lưu thông tin" để cập nhật.' });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setToast({ type: 'error', message: 'Họ tên và Email không được để trống!' });
      return;
    }

    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      avatar: formData.avatar
    });

    setToast({ type: 'success', message: 'Cập nhật thông tin cá nhân thành công!' });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const users = storageService.getUsers();
    const currentUserInDb = users.find(u => u.id === user?.id || u.username === user?.username);
    const actualCurrentPass = currentUserInDb ? currentUserInDb.password : 'admin123';

    if (passData.currentPassword !== actualCurrentPass) {
      setToast({ type: 'error', message: 'Mật khẩu hiện tại không chính xác!' });
      return;
    }

    if (!passData.newPassword) {
      setToast({ type: 'error', message: 'Vui lòng nhập mật khẩu mới!' });
      return;
    }

    if (passData.newPassword.length < 6) {
      setToast({ type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    if (passData.newPassword !== passData.confirmPassword) {
      setToast({ type: 'error', message: 'Mật khẩu mới và xác nhận mật khẩu không khớp!' });
      return;
    }

    // Update password in storage
    storageService.updateUser(currentUserInDb?.id || user.id, { password: passData.newPassword });
    setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setToast({ type: 'success', message: 'Đổi mật khẩu thành công! Bạn có thể sử dụng mật khẩu mới cho lần đăng nhập sau.' });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCheck className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Thông Tin Cá Nhân Quản Trị Viên
          </h1>
          <p className="page-subtitle">Quản lý tài khoản cá nhân, đổi mật khẩu và hình đại diện</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Profile Card & Avatar */}
        <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '110px', height: '110px', marginBottom: '1rem' }}>
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Admin Avatar"
                  style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #0ea5e9' }}
                />
              ) : (
                <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, border: '4px solid #38bdf8' }}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}

              <label htmlFor="avatar-upload" style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: '#0284c7',
                color: 'white',
                padding: '0.4rem',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }} title="Tải ảnh mới">
                <Camera size={16} />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              {formData.name}
            </h2>
            <p style={{ color: '#0ea5e9', fontWeight: 700, fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Shield size={14} /> Quản Trị Viên Hệ Thống (ADMIN)
            </p>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Tên đăng nhập (Username)</label>
              <input type="text" className="form-control" value={formData.username} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} />
              <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>* Tên đăng nhập cố định làm mã định danh</small>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Họ và tên *</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email liên hệ *</label>
              <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Số điện thoại</label>
              <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Địa chỉ làm việc / Địa chỉ cá nhân</label>
              <input type="text" className="form-control" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}>
              <Save size={18} /> Lưu Thông Tin Cá Nhân
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={20} style={{ color: '#0ea5e9' }} /> Đổi Mật Khẩu Đăng Nhập
          </h2>

          <form onSubmit={handleChangePassword}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Mật khẩu hiện tại *</label>
              <input
                type="password"
                className="form-control"
                value={passData.currentPassword}
                onChange={e => setPassData({ ...passData, currentPassword: e.target.value })}
                placeholder="Nhập mật khẩu cũ..."
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Mật khẩu mới *</label>
              <input
                type="password"
                className="form-control"
                value={passData.newPassword}
                onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                placeholder="Ít nhất 6 ký tự..."
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">Xác nhận mật khẩu mới *</label>
              <input
                type="password"
                className="form-control"
                value={passData.confirmPassword}
                onChange={e => setPassData({ ...passData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới..."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 700, backgroundColor: '#0369a1', borderColor: '#0369a1' }}>
              <Lock size={18} /> Xác Nhận Đổi Mật Khẩu
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
