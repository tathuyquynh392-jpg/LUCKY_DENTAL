import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { UserCog, Plus, Search, Edit3, Trash2, Lock, Unlock, KeyRound } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'PATIENT',
    phone: '',
    status: 'ACTIVE'
  });

  const loadData = () => setUsers(storageService.getUsers());
  useEffect(() => { loadData(); }, []);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setFormData({ id: '', username: '', email: '', name: '', password: '123456', role: 'PATIENT', phone: '', status: 'ACTIVE' });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    storageService.addUser(formData);
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Tạo tài khoản người dùng mới thành công!' });
  };

  const handleToggleLock = (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    storageService.updateUser(user.id, { status: newStatus });
    loadData();
    setToast({ type: 'success', message: `Đã ${newStatus === 'LOCKED' ? 'khóa' : 'mở khóa'} tài khoản ${user.username}` });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteUser(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa tài khoản!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCog className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Tài Khoản Hệ Thống
          </h1>
          <p className="page-subtitle">Phân quyền tài khoản Quản trị viên (ADMIN) & Bệnh nhân (PATIENT)</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Tài Khoản Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo username, họ tên, email..."
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
                <th>Username</th>
                <th>Họ và tên</th>
                <th>Email / SĐT</th>
                <th>Quyền hạn (Role)</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.username}</strong></td>
                  <td>{u.name}</td>
                  <td>
                    <div>{u.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.phone}</div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.createdAt || '---'}</td>
                  <td>
                    <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => handleToggleLock(u)} title={u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}>
                      {u.status === 'ACTIVE' ? <Lock size={18} style={{ color: '#f43f5e' }} /> : <Unlock size={18} style={{ color: '#10b981' }} />}
                    </button>
                    <button className="btn-icon" onClick={() => setDeleteTarget(u)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm Tài Khoản Hệ Thống"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Tạo Tài Khoản</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Quyền hạn (Role) *</label>
            <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="PATIENT">PATIENT (Bệnh nhân)</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
            </select>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Tài Khoản" message={`Bạn có chắc chắn muốn xóa tài khoản "${deleteTarget?.username}"?`} />
    </div>
  );
};
