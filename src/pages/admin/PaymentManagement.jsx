import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { CreditCard, Plus, Search, Edit3, Trash2 } from 'lucide-react';

export const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const [formData, setFormData] = useState({
    id: '',
    invoiceId: '',
    patientName: '',
    amount: 500000,
    paymentMethod: 'Chuyển khoản QR',
    status: 'Thành công'
  });

  const loadData = () => {
    setPayments(storageService.getPayments());
    setInvoices(storageService.getInvoices());
  };

  useEffect(() => { loadData(); }, []);

  const filtered = payments.filter(p =>
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    const inv = invoices[0];
    setFormData({
      id: '',
      invoiceId: inv?.id || '',
      patientName: inv?.patientName || '',
      amount: inv?.total || 500000,
      paymentMethod: 'Chuyển khoản QR',
      status: 'Thành công'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    const inv = invoices.find(i => i.id === formData.invoiceId);
    storageService.addPayment({
      ...formData,
      patientName: inv?.patientName || formData.patientName
    });
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Ghi nhận giao dịch thanh toán thành công!' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deletePayment(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa giao dịch!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CreditCard className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Thanh Toán
          </h1>
          <p className="page-subtitle">Nhật ký giao dịch thu tiền mặt, chuyển khoản & thẻ ngân hàng</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Ghi Nhận Thanh Toán
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo bệnh nhân, mã thanh toán..."
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
                <th>Mã GD</th>
                <th>Mã HĐ</th>
                <th>Bệnh nhân</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(pay => (
                <tr key={pay.id}>
                  <td><strong>{pay.code}</strong></td>
                  <td>{pay.invoiceId}</td>
                  <td><strong>{pay.patientName}</strong></td>
                  <td><strong style={{ color: '#10b981' }}>{Number(pay.amount).toLocaleString('vi-VN')} đ</strong></td>
                  <td><span className="badge badge-info">{pay.paymentMethod}</span></td>
                  <td>{pay.paymentDate}</td>
                  <td><span className="badge badge-success">{pay.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => setDeleteTarget(pay)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Ghi Nhận Thanh Toán Mới"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Xác Nhận Thu Tiền</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Chọn Hóa đơn *</label>
            <select className="form-control" value={formData.invoiceId} onChange={e => {
              const inv = invoices.find(i => i.id === e.target.value);
              setFormData({ ...formData, invoiceId: e.target.value, patientName: inv?.patientName || '', amount: inv?.total || 500000 });
            }}>
              {invoices.map(i => <option key={i.id} value={i.id}>{i.code} - {i.patientName} ({Number(i.total || i.totalAmount).toLocaleString('vi-VN')} đ)</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số tiền nộp (VNĐ) *</label>
              <input type="number" className="form-control" value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phương thức *</label>
              <select className="form-control" value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản QR">Chuyển khoản QR</option>
                <option value="Thẻ ngân hàng (POS)">Thẻ ngân hàng (POS)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Giao Dịch" message={`Xóa giao dịch thanh toán "${deleteTarget?.code}"?`} />
    </div>
  );
};
