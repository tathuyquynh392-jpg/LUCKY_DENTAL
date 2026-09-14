import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { CalendarDays, Search, CheckCircle2, XCircle, Edit3 } from 'lucide-react';

export const DoctorLeaveManagement = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const loadRequests = () => {
    setRequests(storageService.getDoctorLeaveRequests());
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter(r => {
    const matchSearch = r.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                        r.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleApprove = (req) => {
    storageService.updateDoctorLeaveRequest(req.id, {
      status: 'APPROVED',
      adminNote: adminNote || 'Đã phê duyệt đơn nghỉ phép.'
    });

    storageService.addNotification({
      userId: req.doctorId,
      title: 'Đơn xin nghỉ phép đã được duyệt',
      message: `Admin đã duyệt đơn xin nghỉ từ ${req.startDate} đến ${req.endDate}.`
    });

    loadRequests();
    setSelectedRequest(null);
    setAdminNote('');
    setToast({ type: 'success', message: `Đã duyệt đơn xin nghỉ của BS ${req.doctorName}!` });
  };

  const handleReject = (req) => {
    storageService.updateDoctorLeaveRequest(req.id, {
      status: 'REJECTED',
      adminNote: adminNote || 'Từ chối đơn xin nghỉ.'
    });

    storageService.addNotification({
      userId: req.doctorId,
      title: 'Đơn xin nghỉ phép bị từ chối',
      message: `Admin không phê duyệt đơn xin nghỉ từ ${req.startDate} đến ${req.endDate}.`
    });

    loadRequests();
    setSelectedRequest(null);
    setAdminNote('');
    setToast({ type: 'error', message: `Đã từ chối đơn xin nghỉ của BS ${req.doctorName}!` });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarDays className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý & Duyệt Đơn Xin Nghỉ Phép Bác Sĩ
          </h1>
          <p className="page-subtitle">Xem danh sách đăng ký xin nghỉ phép của các bác sĩ và phê duyệt ca làm việc</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên bác sĩ, lý do xin nghỉ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Lọc trạng thái:</span>
            <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="ALL">Tất cả</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Bác sĩ xin nghỉ</th>
                <th>Từ ngày</th>
                <th>Đến ngày</th>
                <th>Lý do</th>
                <th>Ngày tạo</th>
                <th>Ghi chú Admin</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Không có đơn xin nghỉ phép nào.
                  </td>
                </tr>
              ) : (
                paginated.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.id}</strong></td>
                    <td><strong>{r.doctorName}</strong></td>
                    <td>{r.startDate}</td>
                    <td>{r.endDate}</td>
                    <td style={{ maxWidth: '240px' }}>{r.reason}</td>
                    <td>{r.createdAt}</td>
                    <td style={{ fontSize: '0.85rem', color: '#0284c7' }}>{r.adminNote || '---'}</td>
                    <td>
                      <span className={`badge ${
                        r.status === 'APPROVED' ? 'badge-success' :
                        r.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {r.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-success btn-sm" onClick={() => { setSelectedRequest(r); setAdminNote('Đã duyệt đơn nghỉ.'); }}>
                            <CheckCircle2 size={14} /> Duyệt
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => { setSelectedRequest(r); setAdminNote('Từ chối đơn nghỉ.'); }}>
                            <XCircle size={14} /> Từ chối
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedRequest(r); setAdminNote(r.adminNote || ''); }}>
                          <Edit3 size={14} /> Sửa ghi chú
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Approval Modal */}
      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title={`Xử Lý Đơn Xin Nghỉ - ${selectedRequest?.doctorName}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSelectedRequest(null)}>Hủy</button>
            <button className="btn btn-danger" onClick={() => handleReject(selectedRequest)}>Từ Chối</button>
            <button className="btn btn-success" onClick={() => handleApprove(selectedRequest)}>Phê Duyệt</button>
          </>
        }>
        {selectedRequest && (
          <div>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <p><strong>Bác sĩ:</strong> {selectedRequest.doctorName}</p>
              <p><strong>Thời gian nghỉ:</strong> Từ {selectedRequest.startDate} đến {selectedRequest.endDate}</p>
              <p><strong>Lý do:</strong> {selectedRequest.reason}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú xử lý của Admin:</label>
              <textarea className="form-control" rows={3} placeholder="Nhập ghi chú cho bác sĩ..." value={adminNote} onChange={e => setAdminNote(e.target.value)} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
