import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu!');
      return;
    }

    const res = login(username, password);
    if (res.success) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  const setDemoCredentialsAndLogin = (role) => {
    setError('');
    let u = 'admin';
    let p = 'admin123';
    if (role === 'PATIENT') {
      u = 'patient';
      p = 'patient123';
    }

    setUsername(u);
    setPassword(p);

    const res = login(u, p);
    if (res.success) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '1.5rem',
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
        maxWidth: '460px',
        backgroundColor: '#1e293b',
        borderRadius: '20px',
        border: '1px solid #334155',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(14, 165, 233, 0.4)'
          }}>
            <Sparkles size={30} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
            LUCKY DENTAL
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Đăng nhập hệ thống quản lý nha khoa
          </p>
        </div>

        {/* Quick Demo Credentials Switcher */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '0.875rem',
          borderRadius: '12px',
          border: '1px solid #334155',
          marginBottom: '1.5rem'
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Nút đăng nhập nhanh Demo (GitHub Pages):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentialsAndLogin('ADMIN')}
              style={{
                padding: '0.625rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: username === 'admin' ? '1px solid #0ea5e9' : '1px solid #334155',
                backgroundColor: username === 'admin' ? '#0ea5e920' : '#1e293b',
                color: username === 'admin' ? '#38bdf8' : '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <ShieldCheck size={16} /> Admin (admin)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentialsAndLogin('PATIENT')}
              style={{
                padding: '0.625rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: username === 'patient' ? '1px solid #10b981' : '1px solid #334155',
                backgroundColor: username === 'patient' ? '#10b98120' : '#1e293b',
                color: username === 'patient' ? '#34d399' : '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <UserCheck size={16} /> Patient (patient)
            </button>
          </div>
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

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Tên đăng nhập / Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.75rem', backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Nhập admin hoặc patient..."
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.75rem', backgroundColor: '#0f172a', color: 'white', borderColor: '#334155' }}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700 }}
          >
            Đăng Nhập Ngay
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Chưa có tài khoản Bệnh nhân?{' '}
          <Link to="/register" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
            Đăng ký tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};
