import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Toast } from '../../components/Toast';
import { Calendar, Users, CheckCircle2, Clock, CalendarDays, UserCheck, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState({ type: 'success', message: '' });
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const loadData = () => {
    const doctors = storageService.getDoctors();
    // Find doctor matching user's doctorId or name/email
    const doc = doctors.find(d => d.id === user?.doctorId || d.email === user?.email || d.name === user?.name) || doctors[0];
    setDoctorInfo(doc);

    const appointments = storageService.getAppointments();
    const docApts = appointments.filter(a => a.doctorId === doc?.id || a.doctorName === doc?.name);
    setMyAppointments(docApts);

    const requests = storageService.getDoctorLeaveRequests();
    const docRequests = requests.filter(r => r.doctorId === doc?.id || r.doctorName === doc?.name);
    setLeaveRequests(docRequests);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReturnToWork = () => {
    if (!doctorInfo) return;
    storageService.updateDoctor(doctorInfo.id, { status: 'Đang hoạt động' });
    
    // Add notification
    storageService.addNotification({
      userId: 'usr-admin',
      title: 'Bác sĩ đăng ký đi làm trở lại',
      message: `Bác sĩ ${doctorInfo.name} vừa thông báo quay trở lại làm việc.`
    });

    loadData();
    setToast({ type: 'success', message: 'Đã cập nhật trạng thái làm việc: Đang hoạt động!' });
  };

  const handleUpdateStatus = (aptId, newStatus) => {
    storageService.updateAppointment(aptId, { status: newStatus });
    loadData();
    setToast({ type: 'success', message: `Cập nhật trạng thái lịch hẹn thành công!` });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = myAppointments.filter(a => a.date === todayStr);
  const pendingApts = myAppointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const completedApts = myAppointments.filter(a => a.status === 'COMPLETED');
  const latestLeave = leaveRequests[0];

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCheck className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Bàn Làm Việc Bác Sĩ - {doctorInfo?.name || user?.name}
          </h1>
          <p className="page-subtitle">Quản lý lịch khám, theo dõi bệnh nhân phụ trách và đăng ký lịch làm việc</p>
        </div>

        {doctorInfo?.status === 'Nghỉ phép' ? (
          <button className="btn btn-success" onClick={handleReturnToWork}>
            <CheckCircle2 size={18} /> Đăng Ký Đi Làm Trở Lại
          </button>
        ) : (
          <Link to="/doctor/leave-requests" className="btn btn-secondary">
            <CalendarDays size={18} /> Xin Nghỉ Phép
          </Link>
        )}
      </div>

      {/* Doctor Status Alert Banner */}
      <div style={{
        backgroundColor: doctorInfo?.status === 'Nghỉ phép' ? '#fef3c7' : '#e0f2fe',
        border: `1px solid ${doctorInfo?.status === 'Nghỉ phép' ? '#fde68a' : '#bae6fd'}`,
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={doctorInfo?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'}
            alt={doctorInfo?.name}
            style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
              {doctorInfo?.name} • Chuyên khoa: <span style={{ color: '#0284c7' }}>{doctorInfo?.specialty}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
              Trạng thái hiện tại: <span className={`badge ${doctorInfo?.status === 'Nghỉ phép' ? 'badge-warning' : 'badge-success'}`}>{doctorInfo?.status || 'Đang hoạt động'}</span>
            </div>
          </div>
        </div>

        {doctorInfo?.status === 'Nghỉ phép' && (
          <button className="btn btn-success" onClick={handleReturnToWork} style={{ padding: '0.65rem 1.25rem' }}>
            <CheckCircle2 size={16} /> Xác nhận đi làm trở lại ngay
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{todayApts.length}</div>
            <div className="stat-label">Lịch Khám Hôm Nay</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{pendingApts.length}</div>
            <div className="stat-label">Lịch Hẹn Cần Khám</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{completedApts.length}</div>
            <div className="stat-label">Ca Khám Hoàn Thành</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            <Activity size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{leaveRequests.length}</div>
            <div className="stat-label">Đơn Xin Nghỉ Phép</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Assigned Appointments & Leave Requests Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Appointments Table */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-title">
            <span>📅 Danh Sách Lịch Khám Được Phân Công</span>
            <Link to="/doctor/appointments" style={{ fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>
              Xem toàn bộ ({myAppointments.length}) →
            </Link>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã LH</th>
                  <th>Bệnh nhân</th>
                  <th>SĐT</th>
                  <th>Dịch vụ khám</th>
                  <th>Ngày & Giờ</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác nhanh</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      Chưa có lịch hẹn nào được phân công cho bác sĩ.
                    </td>
                  </tr>
                ) : (
                  myAppointments.slice(0, 6).map((apt) => (
                    <tr key={apt.id}>
                      <td><strong>{apt.code}</strong></td>
                      <td><strong>{apt.patientName}</strong></td>
                      <td>{apt.phone}</td>
                      <td>{apt.serviceName}</td>
                      <td>
                        <div>{apt.date}</div>
                        <div style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 700 }}>{apt.time}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          apt.status === 'CONFIRMED' ? 'badge-success' :
                          apt.status === 'PENDING' ? 'badge-warning' :
                          apt.status === 'COMPLETED' ? 'badge-info' : 'badge-danger'
                        }`}>
                          {apt.status === 'CONFIRMED' ? 'Đã xác nhận' :
                           apt.status === 'PENDING' ? 'Chờ duyệt' :
                           apt.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {apt.status === 'PENDING' && (
                          <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                            Duyệt
                          </button>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                            Hoàn thành
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

        {/* Leave Requests Widget */}
        <div className="card">
          <div className="card-title">
            <span>🏖️ Trạng Thái Xin Nghỉ Phép</span>
            <Link to="/doctor/leave-requests" style={{ fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>
              Gửi đơn mới →
            </Link>
          </div>

          {latestLeave ? (
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  Từ {latestLeave.startDate} đến {latestLeave.endDate}
                </span>
                <span className={`badge ${
                  latestLeave.status === 'APPROVED' ? 'badge-success' :
                  latestLeave.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {latestLeave.status === 'APPROVED' ? 'Đã duyệt' : latestLeave.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Lý do: {latestLeave.reason}
              </p>
              {latestLeave.adminNote && (
                <div style={{ fontSize: '0.775rem', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '0.5rem', borderRadius: '6px' }}>
                  Ghi chú Admin: {latestLeave.adminNote}
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
              Bạn chưa có đơn xin nghỉ phép nào gần đây.
            </p>
          )}

          <Link to="/doctor/leave-requests" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <CalendarDays size={16} /> Quản Lý Đơn Xin Nghỉ Phép
          </Link>
        </div>
      </div>
    </div>
  );
};
