import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '1.5rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: '#0ea5e9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <Sparkles size={36} />
      </div>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Trang Không Tồn Tại</h2>
      <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.6 }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
        <ArrowLeft size={18} /> Về Trang Chủ
      </Link>
    </div>
  );
};
