import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xóa', cancelText = 'Hủy' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Xác nhận xóa'}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ffe4e6',
          color: '#e11d48',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <p style={{ fontSize: '0.925rem', color: '#334155', marginTop: '0.25rem', lineHeight: '1.5' }}>
            {message || 'Bạn có chắc chắn muốn xóa bản ghi này? Thao tác này không thể hoàn tác.'}
          </p>
        </div>
      </div>
    </Modal>
  );
};
