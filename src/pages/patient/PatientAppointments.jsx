import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Toast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Calendar, PlusCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const loadData = () => {
    const list = storageService.getAppointments().filter(a => a.patientName === user?.name || a.patientId === user?.patientId);
    setAppointments(list);
  };

  useEffect(() => { loadData(); }, []);

  const handleCancelAppointment = () => {
    if (!cancelTarget) return;
    storageService.updateAppointment(cancelTarget.id, { status: 'CANCELLED' });
    loadData();
    setCancelTarget(null);
    setToast({ type: 'success', message: 'Đã hủy lịch hẹn thành công!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Danh Sách Lịch Hẹn Của Tôi
          </h1>
          <p className="page-subtitle">Theo dõi trạng thái lịch hẹn khám tại phòng khám Lucky Dental</p>
        </div>

        <Link to="/patient/appointments/create" className="btn btn-primary">
          <PlusCircle size={18} /> Đặt Lịch Hẹn Mới
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã LH</th>
                <th>Dịch vụ</th>
                <th>Bác sĩ phụ trách</th>
                <th>Ngày & Giờ</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    Bạn chưa có lịch hẹn nào.
                  </td>
                </tr>
              ) : (
                appointments.map(apt => (
                  <tr key={apt.id}>
                    <td><strong>{apt.code}</strong></td>
                    <td><strong>{apt.serviceName}</strong></td>
                    <td>{apt.doctorName}</td>
                    <td>
                      <div>{apt.date}</div>
                      <div style={{ fontWeight: 700, color: '#0ea5e9' }}>{apt.time}</div>
                    </td>
                    <td>{apt.notes || '---'}</td>
                    <td>
                      <span className={`badge ${
                        apt.status === 'CONFIRMED' ? 'badge-success' :
                        apt.status === 'PENDING' ? 'badge-warning' :
                        apt.status === 'COMPLETED' ? 'badge-info' : 'badge-danger'
                      }`}>
                        {apt.status === 'CONFIRMED' ? 'Đã xác nhận' :
                         apt.status === 'PENDING' ? 'Chờ phòng khám duyệt' :
                         apt.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                        <button className="btn btn-danger btn-sm" onClick={() => setCancelTarget(apt)}>
                          <XCircle size={14} /> Hủy Lịch
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelAppointment}
        title="Xác nhận hủy lịch hẹn"
        message={`Bạn có chắc chắn muốn hủy lịch hẹn khám "${cancelTarget?.serviceName}" vào lúc ${cancelTarget?.time} ngày ${cancelTarget?.date}?`}
        confirmText="Hủy Lịch Hẹn"
      />
    </div>
  );
};
