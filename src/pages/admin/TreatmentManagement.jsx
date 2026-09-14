import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { Activity, Plus, Search, Edit3, Trash2 } from 'lucide-react';

export const TreatmentManagement = () => {
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
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
    doctorId: '',
    doctorName: '',
    serviceName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    cost: 5000000,
    status: 'Đang điều trị',
    notes: ''
  });

  const loadData = () => {
    setTreatments(storageService.getTreatments());
    setPatients(storageService.getPatients());
    setDoctors(storageService.getDoctors());
  };

  useEffect(() => { loadData(); }, []);

  const filtered = treatments.filter(t =>
    t.patientName.toLowerCase().includes(search.toLowerCase()) ||
    t.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    const p = patients[0];
    const d = doctors[0];
    setFormData({
      id: '',
      patientId: p?.id || '',
      patientName: p?.name || '',
      doctorId: d?.id || '',
      doctorName: d?.name || '',
      serviceName: 'Niềng Răng Mắc Cài Kim Loại',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-09-14',
      cost: 28000000,
      status: 'Đang điều trị',
      notes: 'Lên phác đồ niềng răng 2 hàm'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (trm) => {
    setFormData({ ...trm });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === formData.patientId);
    const doc = doctors.find(d => d.id === formData.doctorId);
    storageService.addTreatment({
      ...formData,
      patientName: pat?.name || formData.patientName,
      doctorName: doc?.name || formData.doctorName
    });
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Thêm ca điều trị thành công!' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    storageService.updateTreatment(formData.id, formData);
    loadData();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật lộ trình điều trị thành công!' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteTreatment(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa lộ trình điều trị!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Quá Trình Điều Trị
          </h1>
          <p className="page-subtitle">Theo dõi các ca điều trị nha khoa dài hạn</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Ca Điều Trị Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên bệnh nhân, dịch vụ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bệnh nhân</th>
                <th>Bác sĩ phụ trách</th>
                <th>Dịch vụ điều trị</th>
                <th>Thời gian</th>
                <th>Tổng chi phí</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(trm => (
                <tr key={trm.id}>
                  <td><strong>{trm.patientName}</strong></td>
                  <td>{trm.doctorName}</td>
                  <td><span className="badge badge-info">{trm.serviceName}</span></td>
                  <td>{trm.startDate} → {trm.endDate || 'Đang thực hiện'}</td>
                  <td><strong style={{ color: '#0284c7' }}>{Number(trm.cost).toLocaleString('vi-VN')} đ</strong></td>
                  <td>
                    <span className={`badge ${trm.status === 'Hoàn thành' ? 'badge-success' : trm.status === 'Đang điều trị' ? 'badge-warning' : 'badge-danger'}`}>
                      {trm.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => handleOpenEdit(trm)} title="Sửa"><Edit3 size={18} /></button>
                    <button className="btn-icon" onClick={() => setDeleteTarget(trm)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm Ca Điều Trị Mới"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Lưu</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Chọn Bệnh nhân</label>
              <select className="form-control" value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })}>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Chọn Bác sĩ</label>
              <select className="form-control" value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })}>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Dịch vụ điều trị *</label>
            <input type="text" className="form-control" value={formData.serviceName} onChange={e => setFormData({ ...formData, serviceName: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tổng chi phí (VNĐ) *</label>
              <input type="number" className="form-control" value={formData.cost} onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                <option value="Đang điều trị">Đang điều trị</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Tạm dừng">Tạm dừng</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Sửa Lộ Trình Điều Trị"
        footer={<><button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveEdit}>Lưu Thay Đổi</button></>}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              <option value="Đang điều trị">Đang điều trị</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú tiến trình</label>
            <textarea className="form-control" rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Điều Trị" message={`Xóa ca điều trị của "${deleteTarget?.patientName}"?`} />
    </div>
  );
};
