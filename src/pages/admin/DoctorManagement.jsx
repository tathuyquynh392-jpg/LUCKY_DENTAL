import React, { useState, useEffect } from 'react';
import { storageService, DOCTOR_SPECIALTIES } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { UserCheck, Plus, Search, Edit3, Trash2, Upload, Camera } from 'lucide-react';

export const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
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
    specialty: DOCTOR_SPECIALTIES[0],
    qualification: 'BSCKI Răng Hàm Mặt',
    experience: '5 năm',
    workingDays: 'Thứ 2 - Thứ 6',
    workingHours: '08:00 - 17:00',
    status: 'Đang hoạt động',
    avatar: ''
  });

  const loadDoctors = () => {
    setDoctors(storageService.getDoctors());
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.email.toLowerCase().includes(search.toLowerCase()) ||
                        d.phone.includes(search) ||
                        (d.code && d.code.toLowerCase().includes(search.toLowerCase()));
    const matchSpecialty = specialtyFilter === 'ALL' || d.specialty === specialtyFilter;
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchSearch && matchSpecialty && matchStatus;
  });

  const totalItems = filteredDoctors.length;
  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setToast({ type: 'error', message: 'Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP)!' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setToast({ type: 'error', message: 'Dung lượng ảnh tối đa là 5MB!' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      specialty: DOCTOR_SPECIALTIES[0],
      qualification: 'Bác sĩ Răng Hàm Mặt',
      experience: '5 năm kinh nghiệm',
      workingDays: 'Thứ 2 - Thứ 6',
      workingHours: '08:00 - 17:00',
      status: 'Đang hoạt động',
      avatar: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setFormData({
      ...doc,
      status: doc.status === 'Hoạt động' ? 'Đang hoạt động' : doc.status
    });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
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
    if (!formData.name.trim() || !formData.phone.trim()) {
      setToast({ type: 'error', message: 'Vui lòng điền tên bác sĩ và số điện thoại!' });
      return;
    }
    storageService.updateDoctor(formData.id, formData);
    loadDoctors();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật thông tin bác sĩ thành công!' });
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
            Quản Lý Đội Ngũ Bác Sĩ
          </h1>
          <p className="page-subtitle">Quản lý hồ sơ bác sĩ, ảnh đại diện, chuyên khoa và trạng thái công tác</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Bác Sĩ Mới
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flex: 2 }}>
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên bác sĩ, số điện thoại, email, mã BS..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <select
              className="form-control"
              value={specialtyFilter}
              onChange={(e) => { setSpecialtyFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">Tất cả chuyên khoa</option>
              {DOCTOR_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Nghỉ phép">Nghỉ phép</option>
              <option value="Tạm nghỉ">Tạm nghỉ</option>
              <option value="Không hoạt động">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã BS</th>
                <th>Ảnh đại diện</th>
                <th>Họ và tên bác sĩ</th>
                <th>Chuyên khoa RHM</th>
                <th>Trình độ & Kinh nghiệm</th>
                <th>SĐT & Email</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    Không tìm thấy bác sĩ nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map(doc => (
                  <tr key={doc.id}>
                    <td><strong>{doc.code}</strong></td>
                    <td>
                      <img
                        src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'}
                        alt={doc.name}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                      />
                    </td>
                    <td>
                      <div><strong>{doc.name}</strong></div>
                    </td>
                    <td><span className="badge badge-info">{doc.specialty}</span></td>
                    <td>{doc.qualification} ({doc.experience})</td>
                    <td>
                      <div>{doc.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        doc.status === 'Đang hoạt động' || doc.status === 'Hoạt động' ? 'badge-success' :
                        doc.status === 'Nghỉ phép' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleOpenEdit(doc)} title="Chỉnh sửa"><Edit3 size={18} /></button>
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

      {/* Add / Edit Doctor Modal Form */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
        title={isAddModalOpen ? 'Thêm Bác Sĩ Mới' : 'Chỉnh Sửa Thông Tin Bác Sĩ'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Hủy</button>
            <button className="btn btn-primary" onClick={isAddModalOpen ? handleSaveNew : handleSaveEdit}>
              {isAddModalOpen ? 'Lưu Bác Sĩ' : 'Cập Nhật Thay Đổi'}
            </button>
          </>
        }
      >
        <form onSubmit={isAddModalOpen ? handleSaveNew : handleSaveEdit}>
          {/* Avatar Upload Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'}
                alt="Avatar preview"
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0ea5e9' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: '0.35rem' }}>Ảnh đại diện bác sĩ</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ fontSize: '0.8rem', color: '#475569' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Hỗ trợ tập tin ảnh PNG, JPG, WebP. Xem trước ảnh tức thì.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Họ và tên bác sĩ *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên bác sĩ (VD: BS. CKII. Nguyễn Văn A)..."
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="0912345678"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="doctor@luckydental.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Chuyên khoa Răng Hàm Mặt *</label>
              <select
                className="form-control"
                value={formData.specialty}
                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                required
              >
                {DOCTOR_SPECIALTIES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái công tác *</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Nghỉ phép">Nghỉ phép</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
                <option value="Không hoạt động">Không hoạt động</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trình độ bằng cấp</label>
              <input
                type="text"
                className="form-control"
                placeholder="Thạc sĩ, BSCKII, BSCKI..."
                value={formData.qualification}
                onChange={e => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kinh nghiệm</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: 10 năm kinh nghiệm"
                value={formData.experience}
                onChange={e => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa Bác Sĩ"
        message={`Bạn có chắc chắn muốn xóa bác sĩ "${deleteTarget?.name}" khỏi hệ thống?`}
      />
    </div>
  );
};
