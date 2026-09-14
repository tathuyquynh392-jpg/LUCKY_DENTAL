import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { Modal } from '../../components/Modal';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, Stethoscope } from 'lucide-react';

export const CalendarView = () => {
  const appointments = storageService.getAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(' Tháng 9, 2026');

  // Group appointments by date
  const grouped = appointments.reduce((acc, apt) => {
    acc[apt.date] = acc[apt.date] || [];
    acc[apt.date].push(apt);
    return acc;
  }, {});

  const datesList = ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarDays className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Lịch Khám Calendar
          </h1>
          <p className="page-subtitle">Theo dõi lịch khám chi tiết theo tuần/tháng</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <button className="btn-icon"><ChevronLeft size={18} /></button>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentMonth}</span>
          <button className="btn-icon"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Grid Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {datesList.map(date => {
          const apts = grouped[date] || [];
          return (
            <div key={date} className="card" style={{ padding: '1rem', minHeight: '320px', backgroundColor: '#ffffff' }}>
              <div style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', justifyContent: 'space-between' }}>
                <span>{date}</span>
                <span className="badge badge-info">{apts.length} ca</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {apts.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
                    Trống lịch
                  </div>
                ) : (
                  apts.map(apt => (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '8px',
                        backgroundColor: apt.status === 'CONFIRMED' ? '#f0fdf4' : apt.status === 'PENDING' ? '#fefce8' : '#e0f2fe',
                        borderLeft: `4px solid ${apt.status === 'CONFIRMED' ? '#16a34a' : apt.status === 'PENDING' ? '#d97706' : '#0284c7'}`,
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{apt.time} - {apt.patientName}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.15rem' }}>{apt.serviceName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 600, marginTop: '0.15rem' }}>{apt.doctorName}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Detail Popup */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title={`Chi Tiết Lịch Hẹn - ${selectedAppointment?.code}`}
        footer={<button className="btn btn-secondary" onClick={() => setSelectedAppointment(null)}>Đóng</button>}
      >
        {selectedAppointment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div><strong style={{ color: '#64748b' }}>Bệnh nhân:</strong> {selectedAppointment.patientName} ({selectedAppointment.phone})</div>
            <div><strong style={{ color: '#64748b' }}>Bác sĩ:</strong> {selectedAppointment.doctorName}</div>
            <div><strong style={{ color: '#64748b' }}>Dịch vụ:</strong> {selectedAppointment.serviceName}</div>
            <div><strong style={{ color: '#64748b' }}>Thời gian:</strong> {selectedAppointment.time} ngày {selectedAppointment.date}</div>
            <div><strong style={{ color: '#64748b' }}>Trạng thái:</strong> <span className="badge badge-success">{selectedAppointment.status}</span></div>
            <div><strong style={{ color: '#64748b' }}>Ghi chú:</strong> {selectedAppointment.notes || 'Không có'}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};
