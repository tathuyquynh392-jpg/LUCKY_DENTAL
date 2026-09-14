import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { UserCheck, Plus, Search, Edit3, Trash2 } from 'lucide-react';

export const DoctorManagement = () => {
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
    name: '',
    email: '',
    phone: '',
    specialty: 'Nha Khoa Thẩm Mỹ & Niềng Răng',
    qualification: '',
    experience: '',
    workingDays: 'Thứ 2 - Thứ 6',
    workingHours: '08:00 - 17:00',
    status: 'Hoạt động',
    avatar: ''
  });

  const loadDoctors = () => {
    setDoctors(storageService.getDoctors());
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search) ||
    (d.code && d.code.toLowerCase().includes(search.toLowerCase()))
  );

  const totalItems = filteredDoctors.length;
  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      specialty: 'Nha Khoa Thẩm Mỹ & Niềng Răng',
      qualification: 'Bác sĩ Răng Hàm Mặt',
      experience: '5 năm kinh nghiệm',
      workingDays: 'Thứ 2 - Thứ 6',
      workingHours: '08:00 - 17:00',
      status: 'Hoạt động',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setFormData({ ...doc });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setToast({ type: 'error', message: 'Vui lòng điền tên bác sĩ và số điện thoại!' });
      return;
    }
    storageService.addDoctor(formData);
    loadDoctors();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Thêm mới bác sĩ thành công!' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    storageService.updateDoctor(formData.id, formData);
    loadDoctors();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật bác sĩ thành công!' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteDoctor(deleteTarget.id);
    loadDoctors();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa bác sĩ!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCheck className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Bác Sĩ
          </h1>
          <p className="page-subtitle">Danh sách đội ngũ y bác sĩ nha khoa tại phòng khám</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Bác Sĩ Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên bác sĩ, số điện thoại, email..."
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
                <th>Mã BS</th>
                <th>Ảnh</th>
                <th>Họ và tên bác sĩ</th>
                <th>Chuyên khoa</th>
                <th>Trình độ & Kinh nghiệm</th>
                <th>Lịch làm việc</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    Chưa có bác sĩ nào.
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map(doc => (
                  <tr key={doc.id}>
                    <td><strong>{doc.code}</strong></td>
                    <td>
                      <img src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'} alt={doc.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    </td>
                    <td>
                      <div><strong>{doc.name}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.phone} • {doc.email}</div>
                    </td>
                    <td><span className="badge badge-info">{doc.specialty}</span></td>
                    <td>{doc.qualification} ({doc.experience})</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{doc.workingDays}</div>
                      <div style={{ fontSize: '0.75rem', color: '#0ea5e9' }}>{doc.workingHours}</div>
                    </td>
                    <td><span className="badge badge-success">{doc.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleOpenEdit(doc)} title="Sửa"><Edit3 size={18} /></button>
                      <button className="btn-icon" onClick={() => setDeleteTarget(doc)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
        />
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm Bác Sĩ Mới"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSaveNew}>Lưu Bác Sĩ</button>
          </>
        }
      >
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Tên bác sĩ *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Chuyên khoa *</label>
              <input type="text" className="form-control" value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input type="tel" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh Sửa Bác Sĩ"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSaveEdit}>Lưu Thay Đổi</button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Tên bác sĩ *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa Bác Sĩ"
        message={`Bạn có chắc chắn muốn xóa bác sĩ "${deleteTarget?.name}"?`}
      />
    </div>
  );
};
