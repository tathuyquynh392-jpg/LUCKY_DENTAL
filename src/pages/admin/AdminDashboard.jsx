import React from 'react';
import { storageService } from '../../services/storage';
import { Users, UserCheck, Calendar, Clock, DollarSign, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const patients = storageService.getPatients();
  const doctors = storageService.getDoctors();
  const appointments = storageService.getAppointments();
  const treatments = storageService.getTreatments();
  const invoices = storageService.getInvoices();

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const pendingApts = appointments.filter(a => a.status === 'PENDING').length;
  const totalRevenue = invoices
    .filter(i => i.status === 'Đã thanh toán')
    .reduce((sum, i) => sum + (Number(i.paidAmount) || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Tổng Quan Hệ Thống
          </h1>
          <p className="page-subtitle">Thống kê hoạt động phòng khám Lucky Dental theo thời gian thực</p>
        </div>

        <Link to="/admin/appointments" className="btn btn-primary">
          <Calendar size={18} /> Quản lý lịch hẹn ({pendingApts} chờ duyệt)
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalPatients}</div>
            <div className="stat-label">Tổng Bệnh Nhân</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <UserCheck size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalDoctors}</div>
            <div className="stat-label">Bác Sĩ Hoạt Động</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{pendingApts}</div>
            <div className="stat-label">Lịch Hẹn Đang Chờ</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            <DollarSign size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalRevenue.toLocaleString('vi-VN')} đ</div>
            <div className="stat-label">Doanh Thu Đã Thu</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Appointments List */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-title">
            <span>📅 Lịch Hẹn Gần Đây</span>
            <Link to="/admin/appointments" style={{ fontSize: '0.85rem', color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>
              Xem tất cả →
            </Link>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã LH</th>
                  <th>Bệnh nhân</th>
                  <th>Bác sĩ phụ trách</th>
                  <th>Dịch vụ</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id}>
                    <td><strong>{apt.code}</strong></td>
                    <td>
                      <div><strong>{apt.patientName}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.phone}</div>
                    </td>
                    <td>{apt.doctorName}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action */}
        <div className="card">
          <div className="card-title">
            <span>⚡ Phím Tắt Nhanh</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/patients" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.875rem' }}>
              <Users size={18} style={{ color: '#0ea5e9' }} /> Thêm Bệnh Nhân Mới
            </Link>
            <Link to="/admin/calendar" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.875rem' }}>
              <Calendar size={18} style={{ color: '#10b981' }} /> Xem Lịch Khám Calendar
            </Link>
            <Link to="/admin/invoices" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.875rem' }}>
              <DollarSign size={18} style={{ color: '#f59e0b' }} /> Lập Hóa Đơn & Thanh Toán
            </Link>
            <Link to="/admin/reports" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.875rem' }}>
              <Activity size={18} style={{ color: '#6366f1' }} /> Báo Cáo Doanh Thu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
