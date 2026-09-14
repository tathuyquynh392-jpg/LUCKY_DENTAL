import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { Calendar, Plus, Search, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const [formData, setFormData] = useState({
    id: '',
    patientId: '',
    patientName: '',
    phone: '',
    doctorId: '',
    doctorName: '',
    serviceId: '',
    serviceName: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'PENDING',
    notes: ''
  });

  const loadData = () => {
    setAppointments(storageService.getAppointments());
    setPatients(storageService.getPatients());
    setDoctors(storageService.getDoctors());
    setServices(storageService.getServices());
  };

  useEffect(() => { loadData(); }, []);

  const filtered = appointments.filter(a => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (a.code && a.code.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    const firstPat = patients[0];
    const firstDoc = doctors[0];
    const firstSrv = services[0];
    setFormData({
      id: '',
      patientId: firstPat?.id || '',
      patientName: firstPat?.name || '',
      phone: firstPat?.phone || '',
      doctorId: firstDoc?.id || '',
      doctorName: firstDoc?.name || '',
      serviceId: firstSrv?.id || '',
      serviceName: firstSrv?.name || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:30',
      status: 'PENDING',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (apt) => {
    setFormData({ ...apt });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    // Check doctor conflict
    const conflict = appointments.some(
      a => a.doctorId === formData.doctorId && a.date === formData.date && a.time === formData.time && a.status !== 'CANCELLED'
    );
    if (conflict) {
      setToast({ type: 'error', message: 'Bác sĩ đã có lịch hẹn khác vào khung giờ này!' });
      return;
    }

    const pat = patients.find(p => p.id === formData.patientId);
    const doc = doctors.find(d => d.id === formData.doctorId);
    const srv = services.find(s => s.id === formData.serviceId);

    storageService.addAppointment({
      ...formData,
      patientName: pat?.name || formData.patientName,
      phone: pat?.phone || formData.phone,
      doctorName: doc?.name || formData.doctorName,
      serviceName: srv?.name || formData.serviceName
    });
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Đặt lịch hẹn mới thành công!' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    storageService.updateAppointment(formData.id, formData);
    loadData();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật lịch hẹn thành công!' });
  };

  const handleStatusQuickChange = (id, newStatus) => {
    storageService.updateAppointment(id, { status: newStatus });
    loadData();
    setToast({ type: 'success', message: `Đã cập nhật trạng thái lịch hẹn thành ${newStatus}` });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteAppointment(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa lịch hẹn!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Lịch Hẹn Khám
          </h1>
          <p className="page-subtitle">Danh sách lịch hẹn đặt chỗ bệnh nhân & bác sĩ</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Tạo Lịch Hẹn Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo bệnh nhân, bác sĩ, dịch vụ, mã lịch..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">-- Tất cả trạng thái --</option>
            <option value="PENDING">Chờ duyệt (PENDING)</option>
            <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
            <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
            <option value="CANCELLED">Đã hủy (CANCELLED)</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã LH</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ phụ trách</th>
                <th>Dịch vụ</th>
                <th>Ngày & Giờ</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    Chưa có lịch hẹn nào.
                  </td>
                </tr>
              ) : (
                paginated.map(apt => (
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
                      <div style={{ fontWeight: 700, color: '#0ea5e9' }}>{apt.time}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        apt.status === 'CONFIRMED' ? 'badge-success' :
                        apt.status === 'PENDING' ? 'badge-warning' :
                        apt.status === 'COMPLETED' ? 'badge-info' : 'badge-danger'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {apt.status === 'PENDING' && (
                        <button className="btn-icon" style={{ color: '#10b981' }} onClick={() => handleStatusQuickChange(apt.id, 'CONFIRMED')} title="Xác nhận lịch">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="btn-icon" onClick={() => handleOpenEdit(apt)} title="Sửa"><Edit3 size={18} /></button>
                      <button className="btn-icon" onClick={() => setDeleteTarget(apt)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tạo Lịch Hẹn Mới"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Đặt Lịch</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Chọn Bệnh nhân *</label>
            <select className="form-control" value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Chọn Bác sĩ *</label>
              <select className="form-control" value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })}>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Chọn Dịch vụ *</label>
              <select className="form-control" value={formData.serviceId} onChange={e => setFormData({ ...formData, serviceId: e.target.value })}>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({Number(s.price).toLocaleString('vi-VN')} đ)</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày khám *</label>
              <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Giờ khám *</label>
              <input type="time" className="form-control" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <input type="text" className="form-control" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Ghi chú thêm..." />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Sửa Lịch Hẹn"
        footer={<><button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveEdit}>Lưu Thay Đổi</button></>}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="PENDING">PENDING (Chờ duyệt)</option>
                <option value="CONFIRMED">CONFIRMED (Đã xác nhận)</option>
                <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
                <option value="CANCELLED">CANCELLED (Đã hủy)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ngày khám</label>
              <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <input type="text" className="form-control" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Lịch Hẹn" message={`Xóa lịch hẹn "${deleteTarget?.code}" của ${deleteTarget?.patientName}?`} />
    </div>
  );
};
