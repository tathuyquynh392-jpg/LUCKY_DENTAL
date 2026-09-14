import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Toast } from '../../components/Toast';
import { Building2, Save, Upload, MapPin, Phone, Mail, Clock, Globe, Facebook, MessageSquare, Image } from 'lucide-react';

export const ClinicSettings = () => {
  const [settings, setSettings] = useState({
    name: '',
    shortName: '',
    slogan: '',
    logo: '',
    phone: '',
    email: '',
    address: '',
    openingHours: '',
    description: '',
    mapUrl: '',
    facebook: '',
    zalo: ''
  });

  const [toast, setToast] = useState({ type: 'success', message: '' });

  useEffect(() => {
    const data = storageService.getClinicSettings();
    if (data) {
      setSettings(data);
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', message: 'Vui lòng chọn một file ảnh hợp lệ!' });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setToast({ type: 'error', message: 'Dung lượng ảnh không vượt quá 3MB!' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setSettings(prev => ({ ...prev, logo: uploadEvent.target.result }));
      setToast({ type: 'success', message: 'Tải logo phòng khám thành công!' });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!settings.name || !settings.address || !settings.phone) {
      setToast({ type: 'error', message: 'Tên phòng khám, địa chỉ và số điện thoại là bắt buộc!' });
      return;
    }

    storageService.updateClinicSettings(settings);
    setToast({ type: 'success', message: 'Lưu cài đặt thông tin phòng khám thành công! Trang chủ đã tự động cập nhật.' });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building2 className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Cài Đặt Thông Tin Phòng Khám
          </h1>
          <p className="page-subtitle">Quản lý thông tin công khai phòng khám hiển thị trên trang chủ (Landing Page)</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSaveSettings}>
          
          {/* Logo Section */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '0.75rem', display: 'block' }}>
              🖼️ Logo Phòng Khám
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '16px',
                border: '2px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                overflow: 'hidden'
              }}>
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <Building2 size={36} style={{ color: '#94a3b8' }} />
                )}
              </div>

              <div>
                <label htmlFor="logo-upload-btn" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={16} /> Tải Logo Mới
                </label>
                <input id="logo-upload-btn" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                
                {settings.logo && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ marginLeft: '0.5rem', color: '#e11d48', backgroundColor: '#ffe4e6', border: 'none' }}
                    onClick={() => setSettings({ ...settings, logo: '' })}
                  >
                    Xóa logo
                  </button>
                )}
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Hỗ trợ PNG, JPG, WEBP. Hiển thị ở góc trang chủ & footer.</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0369a1', marginBottom: '1rem' }}>
              1. Thông Tin Cơ Bản
            </h3>

            <div className="form-group">
              <label className="form-label">Tên Phòng Khám (Đầy đủ) *</label>
              <input
                type="text"
                className="form-control"
                value={settings.name}
                onChange={e => setSettings({ ...settings, name: e.target.value })}
                placeholder="VD: Phòng Khám Nha Khoa Lucky Dental"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên Viết Tắt</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.shortName}
                  onChange={e => setSettings({ ...settings, shortName: e.target.value })}
                  placeholder="VD: LUCKY DENTAL"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slogan Phòng Khám</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.slogan}
                  onChange={e => setSettings({ ...settings, slogan: e.target.value })}
                  placeholder="VD: Chăm sóc nụ cười – Kiến tạo tự tin"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô Tả Ngắn Về Phòng Khám</label>
              <textarea
                className="form-control"
                rows={3}
                value={settings.description}
                onChange={e => setSettings({ ...settings, description: e.target.value })}
                placeholder="Giới thiệu về trang thiết bị, bác sĩ..."
              />
            </div>
          </div>

          {/* Contact & Address */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0369a1', marginBottom: '1rem' }}>
              2. Thông Tin Liên Hệ & Địa Chỉ (Hiển thị trang chủ)
            </h3>

            <div className="form-group">
              <label className="form-label">Địa Chỉ Phòng Khám *</label>
              <input
                type="text"
                className="form-control"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                placeholder="VD: 123 Nguyễn Trãi, Q.5, TP.HCM"
                required
              />
              <small style={{ color: '#64748b', fontSize: '0.775rem' }}>
                💡 Khi đổi địa chỉ tại đây, footer & liên hệ trên trang chủ sẽ tự động cập nhật ngay lập tức.
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số Điện Thoại Hotline *</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.phone}
                  onChange={e => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="VD: 1900 6868 - 0901234567"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Liên Hệ</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings.email}
                  onChange={e => setSettings({ ...settings, email: e.target.value })}
                  placeholder="VD: contact@luckydental.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Giờ Mở Cửa / Giờ Làm Việc</label>
              <input
                type="text"
                className="form-control"
                value={settings.openingHours}
                onChange={e => setSettings({ ...settings, openingHours: e.target.value })}
                placeholder="VD: 08:00 - 20:00 (Hàng ngày)"
              />
            </div>
          </div>

          {/* Social Links & Map */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0369a1', marginBottom: '1rem' }}>
              3. Mạng Xã Hội & Bản Đồ Google Maps
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Facebook Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.facebook}
                  onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                  placeholder="https://facebook.com/luckydental"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số Zalo Chăm Sóc Khách Hàng</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.zalo}
                  onChange={e => setSettings({ ...settings, zalo: e.target.value })}
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Đường Dẫn Bản Đồ Google Maps (Map URL)</label>
              <input
                type="text"
                className="form-control"
                value={settings.mapUrl}
                onChange={e => setSettings({ ...settings, mapUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '1.025rem', fontWeight: 700, borderRadius: '10px' }}
          >
            <Save size={18} /> Lưu Cài Đặt Thông Tin Phòng Khám
          </button>
        </form>
      </div>
    </div>
  );
};
