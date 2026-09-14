import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Nam',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có độ dài từ 6 ký tự trở lên!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Check existing email
    const users = storageService.getUsers();
    if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setError('Email này đã được sử dụng!');
      return;
    }

    // Create Patient profile & user account
    const newPatient = storageService.addPatient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      medicalHistory: 'Chưa cập nhật'
    });

    storageService.addUser({
      username: formData.email.split('@')[0],
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: 'PATIENT',
      phone: formData.phone,
      patientId: newPatient.id
    });

    setSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '2rem 1.5rem',
      position: 'relative'
    }}>
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: '#94a3b8',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        <ArrowLeft size={18} /> Trở về trang chủ
      </Link>

      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#1e293b',
        borderRadius: '20px',
        border: '1px solid #334155',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 0.75rem'
          }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
            Đăng Ký Tài Khoản Bệnh Nhân
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Trải nghiệm dịch vụ nha khoa chất lượng cao tại Lucky Dental
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffe4e6',
            border: '1px solid #fecdd3',
            color: '#be123c',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Họ và tên *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                placeholder="0901234567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Ngày sinh</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Giới tính</label>
              <select
                name="gender"
                className="form-control"
                style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Địa chỉ</label>
            <input
              type="text"
              name="address"
              className="form-control"
              style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
              placeholder="123 Đường ABC, Q.1, TP.HCM"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Mật khẩu *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Xác nhận mật khẩu *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem' }}
          >
            Đăng Ký Tài Khoản
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
