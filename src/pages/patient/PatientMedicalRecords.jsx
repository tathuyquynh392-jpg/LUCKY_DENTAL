import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { FileText } from 'lucide-react';

export const PatientMedicalRecords = () => {
  const { user } = useAuth();
  const records = storageService.getRecords().filter(r => r.patientName === user?.name || r.patientId === user?.patientId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Lịch Sử Bệnh Án & Đơn Thuốc
          </h1>
          <p className="page-subtitle">Chi tiết các lần khám, chẩn đoán & đơn thuốc của bác sĩ</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {records.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            Bạn chưa có lịch sử bệnh án nào.
          </div>
        ) : (
          records.map(r => (
            <div key={r.id} className="card" style={{ borderLeft: '4px solid #0ea5e9' }}>
              <div className="card-title">
                <span>Mã BA: {r.code} - Ngày khám: {r.date || r.createdAt}</span>
                <span className="badge badge-info">Bác sĩ: {r.doctorName}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: '#64748b' }}>Triệu chứng ban đầu:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#0f172a' }}>{r.symptoms || 'Ê buốt nhẹ'}</p>
                </div>
                <div>
                  <strong style={{ color: '#64748b' }}>Chẩn đoán bác sĩ:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#0ea5e9', fontWeight: 700 }}>{r.diagnosis}</p>
                </div>
                <div>
                  <strong style={{ color: '#64748b' }}>Phương pháp điều trị:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#0f172a', fontWeight: 600 }}>{r.treatment}</p>
                </div>
              </div>

              {r.prescription && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <strong style={{ color: '#10b981' }}>💊 Đơn thuốc bác sĩ kê:</strong>
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.875rem', borderRadius: '8px', marginTop: '0.5rem', whiteSpace: 'pre-line', fontSize: '0.875rem', color: '#166534' }}>
                    {r.prescription}
                  </div>
                </div>
              )}

              {r.followUpDate && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#d97706', fontWeight: 700 }}>
                  🗓️ Ngày hẹn tái khám: {r.followUpDate}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
