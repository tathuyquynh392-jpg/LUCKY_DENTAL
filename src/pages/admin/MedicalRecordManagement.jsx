import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { FileText, Plus, Search, Edit3, Trash2 } from 'lucide-react';

export const MedicalRecordManagement = () => {
  const [records, setRecords] = useState([]);
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
    symptoms: '',
    diagnosis: '',
    dentalCondition: '',
    treatment: '',
    prescription: '',
    followUpDate: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadData = () => {
    setRecords(storageService.getRecords());
    setPatients(storageService.getPatients());
    setDoctors(storageService.getDoctors());
  };

  useEffect(() => { loadData(); }, []);

  const filtered = records.filter(r =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    (r.code && r.code.toLowerCase().includes(search.toLowerCase()))
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
      symptoms: 'Đau ê buốt nhẹ',
      diagnosis: 'Sâu răng độ 1',
      dentalCondition: 'Mảng bám cao răng độ 1',
      treatment: 'Trám răng Composite',
      prescription: 'Nước súc miệng Chlorohexidine',
      followUpDate: '2026-10-15',
      notes: 'Bệnh nhân nhớ tái khám đúng hẹn',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setFormData({ ...rec });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === formData.patientId);
    const doc = doctors.find(d => d.id === formData.doctorId);
    storageService.addRecord({
      ...formData,
      patientName: pat?.name || formData.patientName,
      doctorName: doc?.name || formData.doctorName
    });
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Tạo hồ sơ khám thành công!' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    storageService.updateRecord(formData.id, formData);
    loadData();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật hồ sơ khám thành công!' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteRecord(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa hồ sơ bệnh án!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Hồ Sơ Khám & Bệnh Án
          </h1>
          <p className="page-subtitle">Hồ sơ chẩn đoán, điều trị & đơn thuốc của bệnh nhân</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Tạo Hồ Sơ Khám Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên bệnh nhân, chẩn đoán, mã bệnh án..."
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
                <th>Mã BA</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ điều trị</th>
                <th>Ngày khám</th>
                <th>Chẩn đoán</th>
                <th>Điều trị</th>
                <th>Tái khám</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    Chưa có hồ sơ khám nào.
                  </td>
                </tr>
              ) : (
                paginated.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.code}</strong></td>
                    <td><strong>{r.patientName}</strong></td>
                    <td>{r.doctorName}</td>
                    <td>{r.date || r.createdAt}</td>
                    <td><strong style={{ color: '#0ea5e9' }}>{r.diagnosis}</strong></td>
                    <td>{r.treatment}</td>
                    <td>{r.followUpDate || 'Không'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleOpenEdit(r)} title="Sửa"><Edit3 size={18} /></button>
                      <button className="btn-icon" onClick={() => setDeleteTarget(r)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
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
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tạo Hồ Sơ Bệnh Án Mới"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Lưu Hồ Sơ</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Chọn Bệnh nhân *</label>
              <select className="form-control" value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })}>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Chọn Bác sĩ *</label>
              <select className="form-control" value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })}>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Chẩn đoán *</label>
            <input type="text" className="form-control" value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phương pháp điều trị *</label>
            <input type="text" className="form-control" value={formData.treatment} onChange={e => setFormData({ ...formData, treatment: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Kê đơn thuốc</label>
            <textarea className="form-control" rows={3} value={formData.prescription} onChange={e => setFormData({ ...formData, prescription: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày tái khám</label>
            <input type="date" className="form-control" value={formData.followUpDate} onChange={e => setFormData({ ...formData, followUpDate: e.target.value })} />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Sửa Hồ Sơ Bệnh Án"
        footer={<><button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveEdit}>Lưu Thay Đổi</button></>}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Chẩn đoán *</label>
            <input type="text" className="form-control" value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Điều trị *</label>
            <input type="text" className="form-control" value={formData.treatment} onChange={e => setFormData({ ...formData, treatment: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Đơn thuốc</label>
            <textarea className="form-control" rows={3} value={formData.prescription} onChange={e => setFormData({ ...formData, prescription: e.target.value })} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Hồ Sơ" message={`Xóa hồ sơ bệnh án "${deleteTarget?.code}"?`} />
    </div>
  );
};
