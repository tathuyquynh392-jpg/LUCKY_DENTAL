import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { Pill, Plus, Search, Edit3, Trash2, AlertTriangle } from 'lucide-react';

export const MedicationManagement = () => {
  const [medications, setMedications] = useState([]);
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
    category: 'Kháng sinh',
    unit: 'Viên',
    quantity: 100,
    price: 5000,
    expiryDate: '2027-12-31',
    supplier: 'Dược Hậu Giang',
    status: 'Bình thường'
  });

  const loadData = () => setMedications(storageService.getMedications());
  useEffect(() => { loadData(); }, []);

  const filtered = medications.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      name: '',
      category: 'Kháng sinh',
      unit: 'Viên',
      quantity: 100,
      price: 5000,
      expiryDate: '2027-12-31',
      supplier: 'Dược Hậu Giang',
      status: 'Bình thường'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (med) => {
    setFormData({ ...med });
    setIsEditModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    storageService.addMedication(formData);
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Thêm thuốc mới vào kho thành công!' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    storageService.updateMedication(formData.id, formData);
    loadData();
    setIsEditModalOpen(false);
    setToast({ type: 'success', message: 'Cập nhật thông tin thuốc thành công!' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteMedication(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa thuốc!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Pill className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Kho Thuốc & Vật Tư
          </h1>
          <p className="page-subtitle">Theo dõi số lượng tồn kho & cảnh báo hạn sử dụng thuốc</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Nhập Thuốc Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên thuốc, loại thuốc..."
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
                <th>Tên thuốc</th>
                <th>Phân loại</th>
                <th>Đơn vị</th>
                <th>Tồn kho</th>
                <th>Đơn giá</th>
                <th>Hạn sử dụng</th>
                <th>Nhà cung cấp</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.category}</td>
                  <td>{m.unit}</td>
                  <td><strong style={{ color: m.quantity < 20 ? '#f43f5e' : '#0f172a' }}>{m.quantity}</strong></td>
                  <td>{Number(m.price).toLocaleString('vi-VN')} đ</td>
                  <td>{m.expiryDate}</td>
                  <td>{m.supplier}</td>
                  <td>
                    <span className={`badge ${
                      m.status === 'Bình thường' ? 'badge-success' :
                      m.status === 'Sắp hết' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => handleOpenEdit(m)} title="Sửa"><Edit3 size={18} /></button>
                    <button className="btn-icon" onClick={() => setDeleteTarget(m)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nhập Thuốc Mới Về Kho"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Lưu</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Tên thuốc *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Loại thuốc</label>
              <input type="text" className="form-control" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Đơn vị tính</label>
              <input type="text" className="form-control" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số lượng tồn *</label>
              <input type="number" className="form-control" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Đơn giá (VNĐ) *</label>
              <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hạn sử dụng</label>
              <input type="date" className="form-control" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Nhà cung cấp</label>
              <input type="text" className="form-control" value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Sửa Thông Tin Thuốc"
        footer={<><button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveEdit}>Lưu Thay Đổi</button></>}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số lượng tồn *</label>
              <input type="number" className="form-control" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái kho</label>
              <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Bình thường">Bình thường</option>
                <option value="Sắp hết">Sắp hết</option>
                <option value="Đã hết">Đã hết</option>
                <option value="Sắp hết hạn">Sắp hết hạn</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Thuốc" message={`Xóa thuốc "${deleteTarget?.name}" khỏi hệ thống?`} />
    </div>
  );
};
