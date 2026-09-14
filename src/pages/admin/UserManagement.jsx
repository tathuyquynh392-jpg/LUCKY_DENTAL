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
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  // Reset Password form
  const [resetPassData, setResetPassData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

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

  const filtered = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setFormData({ id: '', username: '', email: '', name: '', password: '123456', role: 'PATIENT', phone: '', status: 'ACTIVE' });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.username || !formData.password || !formData.name) {
      setToast({ type: 'error', message: 'Tên đăng nhập, họ tên và mật khẩu là bắt buộc!' });
      return;
    }
    storageService.addUser(formData);
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Tạo tài khoản người dùng mới thành công!' });
  };

  const handleToggleLock = (u) => {
    const newStatus = u.status === 'ACTIVE' || u.status === 'Đang hoạt động' ? 'LOCKED' : 'ACTIVE';
    storageService.updateUser(u.id, { status: newStatus });
    loadData();
    setToast({
      type: 'success',
      message: `Đã ${newStatus === 'LOCKED' ? 'khóa' : 'mở khóa'} tài khoản ${u.username}`
    });
  };

  const handleOpenResetPass = (u) => {
    setSelectedUser(u);
    setResetPassData({ newPassword: '', confirmPassword: '' });
    setIsResetPassModalOpen(true);
  };

  const handleSaveResetPass = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!resetPassData.newPassword) {
      setToast({ type: 'error', message: 'Vui lòng nhập mật khẩu mới!' });
      return;
    }
    if (resetPassData.newPassword !== resetPassData.confirmPassword) {
      setToast({ type: 'error', message: 'Xác nhận mật khẩu mới không khớp!' });
      return;
    }

    // Also auto unlock if locked
    storageService.updateUser(selectedUser.id, {
      password: resetPassData.newPassword,
      status: 'ACTIVE'
    });

    loadData();
    setIsResetPassModalOpen(false);
    setToast({ type: 'success', message: `Đã đặt lại mật khẩu và mở khóa tài khoản ${selectedUser.username} thành công!` });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteUser(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa tài khoản!' });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <span className="badge badge-purple">ADMIN</span>;
      case 'DOCTOR': return <span className="badge badge-info" style={{ backgroundColor: '#0284c7', color: '#fff' }}>DOCTOR</span>;
      default: return <span className="badge badge-secondary">PATIENT</span>;
    }
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
          <p className="page-subtitle">Phân quyền tài khoản Quản trị viên (ADMIN), Bác sĩ (DOCTOR) & Bệnh nhân (PATIENT)</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Tài Khoản Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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

          <div>
            <select
              className="form-control"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">-- Tất cả quyền (Role) --</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
              <option value="DOCTOR">DOCTOR (Bác sĩ)</option>
              <option value="PATIENT">PATIENT (Bệnh nhân)</option>
            </select>
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
              {paginated.map(u => {
                const isActive = u.status === 'ACTIVE' || u.status === 'Đang hoạt động' || !u.status;

                return (
                  <tr key={u.id}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.name}</td>
                    <td>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.phone}</div>
                    </td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>{u.createdAt || '---'}</td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                        {isActive ? 'Đang hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenResetPass(u)}
                        title="Mở khóa / Đặt lại mật khẩu tạm thời"
                        style={{ color: '#0284c7' }}
                      >
                        <KeyRound size={18} />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => handleToggleLock(u)}
                        title={isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {isActive ? <Lock size={18} style={{ color: '#f43f5e' }} /> : <Unlock size={18} style={{ color: '#10b981' }} />}
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => setDeleteTarget(u)}
                        style={{ color: '#f43f5e' }}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Không tìm thấy tài khoản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Add User Modal */}
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
              <option value="DOCTOR">DOCTOR (Bác sĩ)</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPassModalOpen}
        onClose={() => setIsResetPassModalOpen(false)}
        title={`Mở Khóa / Đặt Lai Mật Khẩu - ${selectedUser?.username}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsResetPassModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSaveResetPass}>Xác Nhận Đặt Mật Khẩu</button>
          </>
        }
      >
        {selectedUser && (
          <form onSubmit={handleSaveResetPass}>
            <div style={{ backgroundColor: '#f0f9ff', padding: '0.875rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#0369a1' }}>
              ℹ️ Cấp lại mật khẩu mới cho <strong>{selectedUser.name}</strong> ({selectedUser.username}). Tài khoản sẽ tự động được mở khóa.
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu mới *</label>
              <input
                type="password"
                className="form-control"
                value={resetPassData.newPassword}
                onChange={e => setResetPassData({ ...resetPassData, newPassword: e.target.value })}
                placeholder="Nhập mật khẩu mới..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu mới *</label>
              <input
                type="password"
                className="form-control"
                value={resetPassData.confirmPassword}
                onChange={e => setResetPassData({ ...resetPassData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới..."
                required
              />
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Tài Khoản" message={`Bạn có chắc chắn muốn xóa tài khoản "${deleteTarget?.username}"?`} />
    </div>
  );
};
