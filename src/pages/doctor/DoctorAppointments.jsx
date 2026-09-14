import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Toast } from '../../components/Toast';
import { Calendar, Search, CheckCircle2, Clock, XCircle } from 'lucide-react';

export const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const loadAppointments = () => {
    const doctors = storageService.getDoctors();
    const doc = doctors.find(d => d.id === user?.doctorId || d.email === user?.email || d.name === user?.name) || doctors[0];
    const all = storageService.getAppointments();
    const filteredDoc = all.filter(a => a.doctorId === doc?.id || a.doctorName === doc?.name);
    setAppointments(filteredDoc);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filtered = appointments.filter(a => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
                        a.phone.includes(search) ||
                        a.serviceName.toLowerCase().includes(search.toLowerCase()) ||
                        (a.code && a.code.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleUpdateStatus = (id, newStatus) => {
    storageService.updateAppointment(id, { status: newStatus });
    loadAppointments();
    setToast({ type: 'success', message: 'Cập nhật trạng thái lịch hẹn thành công!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Lịch Khám Của Bác Sĩ
          </h1>
          <p className="page-subtitle">Danh sách tất cả bệnh nhân được phân công khám cho bác sĩ</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm bệnh nhân, SĐT, dịch vụ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Lọc trạng thái:</span>
            <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="COMPLETED">Đã khám / Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã LH</th>
                <th>Bệnh nhân</th>
                <th>SĐT</th>
                <th>Dịch vụ khám</th>
                <th>Ngày & Giờ</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Không tìm thấy lịch hẹn nào.
                  </td>
                </tr>
              ) : (
                paginated.map(apt => (
                  <tr key={apt.id}>
                    <td><strong>{apt.code}</strong></td>
                    <td><strong>{apt.patientName}</strong></td>
                    <td>{apt.phone}</td>
                    <td>{apt.serviceName}</td>
                    <td>
                      <div>{apt.date}</div>
                      <div style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 700 }}>{apt.time}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{apt.notes || '---'}</td>
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
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')} style={{ marginRight: '0.35rem' }}>
                          Duyệt
                        </button>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} style={{ marginRight: '0.35rem' }}>
                          Hoàn thành
                        </button>
                      )}
                      {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}>
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>
    </div>
  );
};
