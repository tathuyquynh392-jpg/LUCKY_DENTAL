import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Link } from 'react-router-dom';
import { Calendar, PlusCircle, FileText, Receipt, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const appointments = storageService.getAppointments().filter(a => a.patientName === user?.name || a.patientId === user?.patientId);
  const records = storageService.getRecords().filter(r => r.patientName === user?.name || r.patientId === user?.patientId);
  const invoices = storageService.getInvoices().filter(i => i.patientName === user?.name || i.patientId === user?.patientId);

  const upcomingAppointment = appointments.find(a => a.status === 'CONFIRMED' || a.status === 'PENDING');
  const unpaidInvoices = invoices.filter(i => i.status === 'Chưa thanh toán');

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
            Xin chào, {user?.name || 'Bệnh Nhân'}! 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#e0f2fe', marginTop: '0.25rem' }}>
            Chào mừng bạn đến với hệ thống theo dõi sức khỏe nha khoa Lucky Dental.
          </p>
        </div>

        <Link to="/patient/appointments/create" className="btn btn-success" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
          <PlusCircle size={20} /> Đặt Lịch Khám Mới
        </Link>
      </div>

      {/* Upcoming Appointment Card */}
      <div className="card" style={{ borderLeft: '5px solid #0ea5e9', marginBottom: '1.75rem' }}>
        <div className="card-title">
          <span>📅 Lịch Hẹn Sắp Tới Của Bạn</span>
        </div>

        {upcomingAppointment ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px' }}>
            <div>
              <span className={`badge ${upcomingAppointment.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}`} style={{ marginBottom: '0.5rem' }}>
                {upcomingAppointment.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ phòng khám xác nhận'}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{upcomingAppointment.serviceName}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>Bác sĩ phụ trách: <strong>{upcomingAppointment.doctorName}</strong></p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7' }}>{upcomingAppointment.time}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Ngày {upcomingAppointment.date}</div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
            <p style={{ marginBottom: '1rem' }}>Bạn chưa có lịch hẹn khám nào sắp tới.</p>
            <Link to="/patient/appointments/create" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Đặt lịch khám ngay
            </Link>
          </div>
        )}
      </div>

      {/* Grid Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Medical Records */}
        <div className="card">
          <div className="card-title">
            <span>📋 Hồ Sơ Khám Gần Nhất</span>
            <Link to="/patient/medical-records" style={{ fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>

          {records.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Chưa có hồ sơ khám bệnh.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {records.slice(0, 3).map(r => (
                <div key={r.id} style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ngày {r.date || r.createdAt} - BS: {r.doctorName}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Chẩn đoán: {r.diagnosis}</div>
                  <div style={{ fontSize: '0.85rem', color: '#0ea5e9', marginTop: '0.15rem' }}>Điều trị: {r.treatment}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unpaid Invoices Notice */}
        <div className="card">
          <div className="card-title">
            <span>💳 Hóa Đơn Cần Thanh Toán</span>
            <Link to="/patient/invoices" style={{ fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none' }}>Chi tiết →</Link>
          </div>

          {unpaidInvoices.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.9rem', fontWeight: 600 }}>
              <CheckCircle2 size={20} /> Bạn đã hoàn tất tất cả hóa đơn!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {unpaidInvoices.map(inv => (
                <div key={inv.id} style={{ padding: '0.875rem', backgroundColor: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#9f1239' }}>{inv.serviceName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Mã: {inv.code}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#be123c', fontSize: '1rem' }}>
                    {Number(inv.total || inv.totalAmount).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
