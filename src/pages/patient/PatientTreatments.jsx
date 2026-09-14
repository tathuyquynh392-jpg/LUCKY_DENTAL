import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Activity } from 'lucide-react';

export const PatientTreatments = () => {
  const { user } = useAuth();
  const treatments = storageService.getTreatments().filter(t => t.patientName === user?.name || t.patientId === user?.patientId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Tiến Trình Điều Trị Dài Hạn
          </h1>
          <p className="page-subtitle">Theo dõi các dịch vụ niềng răng, Implant, bọc răng sứ dài hạn</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {treatments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            Bạn chưa có liệu trình điều trị dài hạn nào.
          </div>
        ) : (
          treatments.map(t => (
            <div key={t.id} className="card">
              <div className="card-title">
                <span>{t.serviceName}</span>
                <span className={`badge ${t.status === 'Hoàn thành' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div><strong style={{ color: '#64748b' }}>Bác sĩ phụ trách:</strong> {t.doctorName}</div>
                <div><strong style={{ color: '#64748b' }}>Ngày bắt đầu:</strong> {t.startDate}</div>
                <div><strong style={{ color: '#64748b' }}>Dự kiến kết thúc:</strong> {t.endDate || 'Chưa xác định'}</div>
                <div><strong style={{ color: '#64748b' }}>Tổng chi phí:</strong> <span style={{ color: '#0284c7', fontWeight: 800 }}>{Number(t.cost).toLocaleString('vi-VN')} đ</span></div>
              </div>
              {t.notes && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#334155' }}>
                  <strong>Lưu ý từ bác sĩ:</strong> {t.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
