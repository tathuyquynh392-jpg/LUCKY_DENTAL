import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ type = 'success', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    info: <Info className="text-sky-500" size={20} />
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1.25rem',
      borderRadius: '10px',
      border: '1px solid',
      backgroundColor: type === 'success' ? '#f0fdf4' : type === 'error' ? '#fff1f2' : '#f0f9ff',
      borderColor: type === 'success' ? '#bbf7d0' : type === 'error' ? '#fecdd3' : '#bae6fd',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      animation: 'slideUp 0.25s ease-out'
    }}>
      {icons[type]}
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: type === 'success' ? '#166534' : type === 'error' ? '#9f1239' : '#075985' }}>
        {message}
      </span>
      <button 
        onClick={onClose} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', marginLeft: '0.5rem', padding: '2px' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
