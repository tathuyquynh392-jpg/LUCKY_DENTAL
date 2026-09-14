import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { Link } from 'react-router-dom';
import { Users, Plus, Search, Eye, Edit3, Trash2 } from 'lucide-react';

export const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('NEWEST');
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
    dob: '',
    gender: 'Nam',
    address: '',
    medicalHistory: '',
    notes: '',
    status: 'Hoạt động'
  });

  const loadPatients = () => {
    setPatients(storageService.getPatients());
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.code && p.code.toLowerCase().includes(search.toLowerCase()));

    const matchesGender = genderFilter === 'ALL' || p.gender === genderFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesGender && matchesStatus;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortOption === 'NAME_ASC') return a.name.localeCompare(b.name, 'vi');
    if (sortOption === 'NAME_DESC') return b.name.localeCompare(a.name, 'vi');
    if (sortOption === 'OLDEST') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const totalItems = sortedPatients.length;
  const paginatedPatients = sortedPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      dob: '1995-01-01',
      gender: 'Nam',
      address: '',
      medicalHistory: '',
      notes: '',
      status: 'Hoạt động'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setFormData({
      id: p.id,
      name: p.name || '',
      email: p.email || '',
      phone: p.phone || '',
      dob: p.dob || '',
      gender: p.gender || 'Nam',
      address: p.address || '',
      medicalHistory: p.medicalHistory || '',
      notes: p.notes || '',
      status: p.status || 'Hoạt động'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setToast({ type: 'error', message: 'Vui lòng nhập tên và số điện thoại!' });
      return;
    }
    storageService.addPatient(formData);
    loadPatients();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Thêm mới bệnh nhân thành công!' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    storageService.updatePatient(formData.id, formData);
    loadPatients();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật thông tin bệnh nhân thành công!' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deletePatient(deleteTarget.id);
    loadPatients();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa hồ sơ bệnh nhân!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Bệnh Nhân
          </h1>
          <p className="page-subtitle">Danh sách hồ sơ bệnh nhân toàn hệ thống nha khoa</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Bệnh Nhân Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên, email, số điện thoại, mã BN..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">-- Tất cả giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">-- Tất cả trạng thái --</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Tạm khóa">Tạm khóa</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="NEWEST">Mới nhất trước</option>
              <option value="OLDEST">Cũ nhất trước</option>
              <option value="NAME_ASC">Tên A → Z</option>
              <option value="NAME_DESC">Tên Z → A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ & Tên</th>
                <th>Liên hệ</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Địa chỉ</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    Không tìm thấy bệnh nhân nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.code}</strong></td>
                    <td>
                      <Link to={`/admin/patients/${p.id}`} style={{ fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>
                        {p.name}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{p.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.email}</div>
                    </td>
                    <td>{p.dob || '---'}</td>
                    <td>{p.gender}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.address || '---'}
                    </td>
                    <td>{p.createdAt || '---'}</td>
                    <td>
                      <span className={`badge ${p.status === 'Hoạt động' ? 'badge-success' : 'badge-danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                        <Link to={`/admin/patients/${p.id}`} className="btn-icon" title="Xem chi tiết">
                          <Eye size={18} />
                        </Link>
                        <button className="btn-icon" title="Chỉnh sửa" onClick={() => handleOpenEdit(p)}>
                          <Edit3 size={18} />
                        </button>
                        <button className="btn-icon" title="Xóa" onClick={() => setDeleteTarget(p)} style={{ color: '#f43f5e' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm Bệnh Nhân Mới"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSaveNew}>Lưu Bệnh Nhân</button>
          </>
        }
      >
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input type="tel" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <input type="date" className="form-control" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select className="form-control" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input type="text" className="form-control" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh Sửa Thông Tin Bệnh Nhân"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSaveEdit}>Lưu Thay Đổi</button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input type="tel" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa bệnh nhân"
        message={`Bạn có chắc chắn muốn xóa hồ sơ bệnh nhân "${deleteTarget?.name}"?`}
      />
    </div>
  );
};
