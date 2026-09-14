import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Award, Filter } from 'lucide-react';

export const Reports = () => {
  const [period, setPeriod] = useState('MONTH');
  const invoices = storageService.getInvoices();
  const patients = storageService.getPatients();
  const appointments = storageService.getAppointments();
  const services = storageService.getServices();

  const totalRevenue = invoices
    .filter(i => i.status === 'Đã thanh toán')
    .reduce((sum, i) => sum + (Number(i.paidAmount) || 0), 0);

  const completedApts = appointments.filter(a => a.status === 'COMPLETED').length;
  const pendingApts = appointments.filter(a => a.status === 'PENDING').length;
  const totalApts = appointments.length || 1;
  const completionRate = Math.round((completedApts / totalApts) * 100);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BarChart3 className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Báo Cáo & Thống Kê Doanh Thu
          </h1>
          <p className="page-subtitle">Báo cáo hiệu suất kinh doanh phòng khám Lucky Dental</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} style={{ color: '#64748b' }} />
          <select className="form-control" style={{ width: 'auto' }} value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="TODAY">Hôm nay</option>
            <option value="WEEK">Tuần này</option>
            <option value="MONTH">Tháng này</option>
            <option value="YEAR">Năm nay</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}><DollarSign size={26} /></div>
          <div className="stat-info">
            <div className="stat-value">{totalRevenue.toLocaleString('vi-VN')} đ</div>
            <div className="stat-label">Tổng Doanh Thu Phân Tích</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}><Users size={26} /></div>
          <div className="stat-info">
            <div className="stat-value">{patients.length}</div>
            <div className="stat-label">Bệnh Nhân Đăng Ký</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}><Calendar size={26} /></div>
          <div className="stat-info">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Tỷ Lệ Hoàn Thành Lịch Hẹn</div>
          </div>
        </div>
      </div>

      {/* Visual Revenue Bars Chart */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">
          <span>📊 Biểu Đồ Doanh Thu & Số Lượt Khám</span>
        </div>

        <div style={{ padding: '1rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '220px', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { label: 'T1', val: 45 },
              { label: 'T2', val: 65 },
              { label: 'T3', val: 80 },
              { label: 'T4', val: 55 },
              { label: 'T5', val: 90 },
              { label: 'T6', val: 110 },
              { label: 'T7', val: 130 },
              { label: 'T8', val: 120 },
              { label: 'T9 (Hiện tại)', val: 150 }
            ].map(bar => (
              <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${bar.val * 1.2}px`,
                  background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 4px 10px rgba(14, 165, 233, 0.2)'
                }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Services Table */}
      <div className="card">
        <div className="card-title">
          <span>⭐ Dịch Vụ Nha Khoa Phổ Biến Nhất</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Xếp hạng</th>
                <th>Dịch vụ</th>
                <th>Đơn giá</th>
                <th>Thời gian</th>
                <th>Số lượt thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {services.slice(0, 5).map((srv, idx) => (
                <tr key={srv.id}>
                  <td><strong>#{idx + 1}</strong></td>
                  <td><strong>{srv.name}</strong></td>
                  <td>{Number(srv.price).toLocaleString('vi-VN')} đ</td>
                  <td>{srv.duration}</td>
                  <td><span className="badge badge-success">{12 + idx * 8} lượt</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
