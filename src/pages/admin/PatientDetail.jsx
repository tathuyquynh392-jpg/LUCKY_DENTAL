import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { ArrowLeft } from 'lucide-react';

export const PatientDetail = () => {
  const { id } = useParams();
  const patients = storageService.getPatients();
  const patient = patients.find(p => p.id === id || p.code === id) || patients[0];

  const records = storageService.getRecords().filter(r => r.patientId === patient?.id || r.patientName === patient?.name);
  const invoices = storageService.getInvoices().filter(i => i.patientId === patient?.id || i.patientName === patient?.name);

  if (!patient) {
    return (
      <div>
        <h2>Không tìm thấy hồ sơ bệnh nhân</h2>
        <Link to="/admin/patients" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/patients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Trở về danh sách bệnh nhân
        </Link>
      </div>

      {/* Patient Header Card */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#0ea5e9',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {patient.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{patient.name}</h1>
              <span className="badge badge-info">{patient.code}</span>
              <span className={`badge ${patient.status === 'Hoạt động' ? 'badge-success' : 'badge-danger'}`}>{patient.status}</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Bệnh nhân đăng ký ngày: {patient.createdAt || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-title">
            <span>👤 Thông Tin Cá Nhân</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            <div><strong style={{ color: '#64748b' }}>Số điện thoại:</strong> {patient.phone}</div>
            <div><strong style={{ color: '#64748b' }}>Email:</strong> {patient.email || 'Chưa có'}</div>
            <div><strong style={{ color: '#64748b' }}>Ngày sinh:</strong> {patient.dob || 'Chưa cập nhật'}</div>
            <div><strong style={{ color: '#64748b' }}>Giới tính:</strong> {patient.gender}</div>
            <div><strong style={{ color: '#64748b' }}>Địa chỉ:</strong> {patient.address || 'Chưa cập nhật'}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>🩺 Sức Khỏe & Tiền Sử Bệnh</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: '#64748b' }}>Tiền sử bệnh lý:</strong>
              <p style={{ marginTop: '0.25rem', color: '#0f172a', fontWeight: 600 }}>{patient.medicalHistory || 'Bình thường'}</p>
            </div>
            <div>
              <strong style={{ color: '#64748b' }}>Dị ứng thuốc:</strong>
              <p style={{ marginTop: '0.25rem', color: '#f43f5e', fontWeight: 700 }}>{patient.allergy || 'Không'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card">
        <div className="card-title">
          <span>📋 Lịch Sử Khám & Hồ Sơ Bệnh Án</span>
        </div>

        {records.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', padding: '1rem 0' }}>Chưa có hồ sơ khám bệnh nào.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã BA</th>
                  <th>Ngày khám</th>
                  <th>Bác sĩ khám</th>
                  <th>Triệu chứng & Chẩn đoán</th>
                  <th>Điều trị</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.code}</strong></td>
                    <td>{r.date || r.createdAt}</td>
                    <td>{r.doctorName}</td>
                    <td>{r.diagnosis}</td>
                    <td>{r.treatment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
