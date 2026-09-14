import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { Stethoscope, Plus, Search, Edit3, Trash2 } from 'lucide-react';

export const ServiceManagement = () => {
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
    name: '',
    description: '',
    price: 500000,
    duration: '30 phút',
    status: 'Đang hoạt động'
  });

  const loadServices = () => setServices(storageService.getServices());
  useEffect(() => { loadServices(); }, []);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(search.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter || 
      (statusFilter === 'Đang hoạt động' && (s.status === 'Hoạt động' || s.status === 'Đang hoạt động')) ||
      (statusFilter === 'Tạm ngưng' && (s.status === 'Ngưng' || s.status === 'Tạm ngưng'));

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredServices.length;
  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setFormData({ id: '', name: '', description: '', price: 500000, duration: '30 phút', status: 'Đang hoạt động' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setFormData({ 
      ...srv,
      status: srv.status === 'Hoạt động' ? 'Đang hoạt động' : (srv.status || 'Đang hoạt động')
    });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name || !formData.price) {
      setToast({ type: 'error', message: 'Tên dịch vụ và giá là bắt buộc!' });
      return;
    }
    storageService.addService(formData);
    loadServices();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Thêm dịch vụ thành công!' });
  };

  const handleSaveEdit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name || !formData.price) {
      setToast({ type: 'error', message: 'Tên dịch vụ và giá là bắt buộc!' });
      return;
    }
    storageService.updateService(formData.id, formData);
    loadServices();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật dịch vụ thành công!' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteService(deleteTarget.id);
    loadServices();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa dịch vụ!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Stethoscope className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Dịch Vụ Nha Khoa
          </h1>
          <p className="page-subtitle">Danh mục dịch vụ, chi phí và thời gian thực hiện</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Dịch Vụ Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên dịch vụ, mô tả..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">-- Tất cả trạng thái --</option>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã DV</th>
                <th>Tên dịch vụ</th>
                <th>Mô tả</th>
                <th>Đơn giá</th>
                <th>Thời gian dự kiến</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map(srv => {
                const isActive = srv.status === 'Đang hoạt động' || srv.status === 'Hoạt động';
                return (
                  <tr key={srv.id}>
                    <td><strong>{srv.code}</strong></td>
                    <td><strong>{srv.name}</strong></td>
                    <td style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '300px' }}>{srv.description || 'Chưa có mô tả'}</td>
                    <td><strong style={{ color: '#0284c7' }}>{Number(srv.price).toLocaleString('vi-VN')} đ</strong></td>
                    <td>{srv.duration || '30 phút'}</td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-warning'}`}>
                        {isActive ? 'Đang hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleOpenEdit(srv)} title="Sửa"><Edit3 size={18} /></button>
                      <button className="btn-icon" onClick={() => setDeleteTarget(srv)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                );
              })}
              {paginatedServices.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Không tìm thấy dịch vụ nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm Dịch Vụ Mới"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Lưu</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Tên dịch vụ *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả dịch vụ</label>
            <textarea rows="3" className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Chi tiết dịch vụ nha khoa..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Đơn giá (VNĐ) *</label>
              <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Thời gian dự kiến</label>
              <input type="text" className="form-control" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="VD: 30 phút, 60 phút" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái *</label>
            <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh Sửa Dịch Vụ"
        footer={<><button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveEdit}>Lưu</button></>}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Tên dịch vụ *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả dịch vụ</label>
            <textarea rows="3" className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Đơn giá (VNĐ) *</label>
              <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Thời gian dự kiến</label>
              <input type="text" className="form-control" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái *</label>
            <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
            </select>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Dịch Vụ" message={`Bạn có muốn xóa dịch vụ "${deleteTarget?.name}"?`} />
    </div>
  );
};
