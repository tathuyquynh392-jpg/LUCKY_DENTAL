import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { CalendarDays, Plus, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const DoctorLeaveRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const loadData = () => {
    const doctors = storageService.getDoctors();
    const doc = doctors.find(d => d.id === user?.doctorId || d.email === user?.email || d.name === user?.name) || doctors[0];
    setDoctorInfo(doc);

    const allRequests = storageService.getDoctorLeaveRequests();
    const myReqs = allRequests.filter(r => r.doctorId === doc?.id || r.doctorName === doc?.name);
    setRequests(myReqs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setToast({ type: 'error', message: 'Vui lòng điền từ ngày, đến ngày và lý do xin nghỉ!' });
      return;
    }

    if (formData.startDate > formData.endDate) {
      setToast({ type: 'error', message: 'Ngày bắt đầu không thể sau ngày kết thúc!' });
      return;
    }

    storageService.addDoctorLeaveRequest({
      doctorId: doctorInfo?.id || 'doc-1',
      doctorName: doctorInfo?.name || user?.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'PENDING',
      adminNote: ''
    });

    loadData();
    setIsModalOpen(false);
    setToast({ type: 'success', message: 'Đã gửi yêu cầu xin nghỉ phép thành công! Vui lòng chờ Admin duyệt.' });
  };

  const handleReturnToWork = () => {
    if (!doctorInfo) return;
    storageService.updateDoctor(doctorInfo.id, { status: 'Đang hoạt động' });

    storageService.addNotification({
      userId: 'usr-admin',
      title: 'Bác sĩ đăng ký đi làm trở lại',
      message: `Bác sĩ ${doctorInfo.name} vừa cập nhật trạng thái làm việc: Đang hoạt động.`
    });

    loadData();
    setToast({ type: 'success', message: 'Cập nhật trạng thái làm việc thành công: Đang hoạt động!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarDays className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Lịch Xin Nghỉ Phép & Đi Làm Trở Lại
          </h1>
          <p className="page-subtitle">Tạo đơn xin nghỉ phép, theo dõi duyệt đơn và cập nhật trạng thái làm việc</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {doctorInfo?.status === 'Nghỉ phép' && (
            <button className="btn btn-success" onClick={handleReturnToWork}>
              <CheckCircle2 size={18} /> Đi Làm Trở Lại
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Gửi Đơn Xin Nghỉ Phép
          </button>
        </div>
      </div>

      {/* Current Status Box */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Trạng thái hiện tại: <span className={`badge ${doctorInfo?.status === 'Nghỉ phép' ? 'badge-warning' : 'badge-success'}`}>{doctorInfo?.status || 'Đang hoạt động'}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            Bác sĩ: <strong>{doctorInfo?.name}</strong> • Chuyên khoa: {doctorInfo?.specialty}
          </p>
        </div>
        {doctorInfo?.status === 'Nghỉ phép' && (
          <button className="btn btn-success" onClick={handleReturnToWork}>
            <CheckCircle2 size={16} /> Đăng ký đi làm ngay
          </button>
        )}
      </div>

      {/* Requests History List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '1.05rem' }}>
          📋 Lịch Sử Các Đơn Xin Nghỉ Phép
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Từ ngày</th>
                <th>Đến ngày</th>
                <th>Lý do xin nghỉ</th>
                <th>Ngày gửi</th>
                <th>Ghi chú Admin</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Chưa có đơn xin nghỉ phép nào.
                  </td>
                </tr>
              ) : (
                requests.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.id}</strong></td>
                    <td><strong>{r.startDate}</strong></td>
                    <td><strong>{r.endDate}</strong></td>
                    <td style={{ maxWidth: '280px' }}>{r.reason}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gửi Đơn Xin Nghỉ Phép"
        footer={<><button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSubmit}>Gửi Đơn Xin Nghỉ</button></>}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Từ ngày *</label>
              <input type="date" className="form-control" value={formData.startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Đến ngày *</label>
              <input type="date" className="form-control" value={formData.endDate} min={formData.startDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Lý do xin nghỉ phép *</label>
            <textarea className="form-control" rows={3} placeholder="Bận việc gia đình, tham gia hội thảo y khoa, đi du lịch..." value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required />
          </div>
        </form>
      </Modal>
    </div>
  );
};
