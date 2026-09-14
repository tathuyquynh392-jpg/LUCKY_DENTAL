import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { Receipt, Plus, Search, Edit3, Trash2, Printer } from 'lucide-react';

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPayMoreModalOpen, setIsPayMoreModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  // Add Invoice Form
  const [formData, setFormData] = useState({
    id: '',
    patientId: '',
    patientName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    serviceName: '',
    subtotal: 500000,
    discount: 0,
    total: 500000,
    paidAmount: 0,
    status: 'Chưa thanh toán'
  });

  // Partial Debt Payment Form
  const [payFormData, setPayFormData] = useState({
    invoiceId: '',
    amount: 0,
    paymentMethod: 'Tiền mặt',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const loadData = () => {
    setInvoices(storageService.getInvoices());
    setPatients(storageService.getPatients());
    setServices(storageService.getServices());
    setPayments(storageService.getPayments());
  };

  useEffect(() => { loadData(); }, []);

  const filtered = invoices.filter(i => {
    const totalVal = Number(i.total || i.totalAmount || 0);
    const paidVal = Number(i.paidAmount || 0);

    let computedStatus = 'Chưa thanh toán';
    if (paidVal >= totalVal && totalVal > 0) computedStatus = 'Đã thanh toán';
    else if (paidVal > 0 && paidVal < totalVal) computedStatus = 'Thanh toán một phần';

    const matchesSearch = i.patientName.toLowerCase().includes(search.toLowerCase()) ||
      (i.code && i.code.toLowerCase().includes(search.toLowerCase())) ||
      (i.serviceName && i.serviceName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || computedStatus === statusFilter || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    const p = patients[0];
    const s = services[0];
    setFormData({
      id: '',
      patientId: p?.id || '',
      patientName: p?.name || '',
      invoiceDate: new Date().toISOString().split('T')[0],
      serviceName: s?.name || 'Khám Tổng Quát',
      subtotal: s?.price || 500000,
      discount: 0,
      total: s?.price || 500000,
      paidAmount: 0,
      status: 'Chưa thanh toán'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const pat = patients.find(p => p.id === formData.patientId);
    
    const paidVal = Number(formData.paidAmount || 0);
    const totalVal = Number(formData.total || 0);
    let computedStatus = 'Chưa thanh toán';
    if (paidVal >= totalVal && totalVal > 0) computedStatus = 'Đã thanh toán';
    else if (paidVal > 0) computedStatus = 'Thanh toán một phần';

    const newInv = storageService.addInvoice({
      ...formData,
      patientName: pat?.name || formData.patientName,
      status: computedStatus
    });

    if (paidVal > 0) {
      storageService.addPayment({
        invoiceId: newInv.id,
        patientName: pat?.name || formData.patientName,
        amount: paidVal,
        paymentMethod: 'Tiền mặt',
        paymentDate: formData.invoiceDate,
        notes: 'Thanh toán đợt 1'
      });
    }

    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Tạo hóa đơn mới thành công!' });
  };

  const handleOpenPayMore = (inv) => {
    const totalVal = Number(inv.total || inv.totalAmount || 0);
    const paidVal = Number(inv.paidAmount || 0);
    const remaining = Math.max(0, totalVal - paidVal);

    setSelectedInvoice(inv);
    setPayFormData({
      invoiceId: inv.id,
      amount: remaining,
      paymentMethod: 'Tiền mặt',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: `Trả thêm công nợ cho hóa đơn ${inv.code}`
    });
    setIsPayMoreModalOpen(true);
  };

  const handleSavePayMore = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedInvoice) return;

    const totalVal = Number(selectedInvoice.total || selectedInvoice.totalAmount || 0);
    const paidVal = Number(selectedInvoice.paidAmount || 0);
    const remaining = Math.max(0, totalVal - paidVal);

    const payAmount = Number(payFormData.amount);

    if (payAmount <= 0) {
      setToast({ type: 'error', message: 'Số tiền thanh toán phải lớn hơn 0!' });
      return;
    }

    if (payAmount > remaining) {
      setToast({ type: 'error', message: `Số tiền trả không được lớn hơn số tiền còn nợ (${remaining.toLocaleString('vi-VN')} đ)!` });
      return;
    }

    storageService.addPayment({
      invoiceId: selectedInvoice.id,
      patientName: selectedInvoice.patientName,
      amount: payAmount,
      paymentMethod: payFormData.paymentMethod,
      paymentDate: payFormData.paymentDate,
      notes: payFormData.notes
    });

    loadData();
    setIsPayMoreModalOpen(false);
    setToast({ type: 'success', message: `Đã ghi nhận thanh toán ${payAmount.toLocaleString('vi-VN')} đ cho hóa đơn ${selectedInvoice.code}!` });
  };

  const handleOpenHistory = (inv) => {
    setSelectedInvoice(inv);
    setIsHistoryModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageService.deleteInvoice(deleteTarget.id);
    loadData();
    setDeleteTarget(null);
    setToast({ type: 'success', message: 'Đã xóa hóa đơn!' });
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Receipt className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Quản Lý Hóa Đơn & Công Nợ
          </h1>
          <p className="page-subtitle">Quản lý hóa đơn dịch vụ, theo dõi công nợ & trả góp nhiều lần</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Lập Hóa Đơn Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên bệnh nhân, mã hóa đơn..."
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
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Thanh toán một phần">Thanh toán một phần</option>
              <option value="Chưa thanh toán">Chưa thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Bệnh nhân</th>
                <th>Ngày lập</th>
                <th>Dịch vụ</th>
                <th>Tổng tiền</th>
                <th>Đã thanh toán</th>
                <th>Còn nợ</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(inv => {
                const totalVal = Number(inv.total || inv.totalAmount || 0);
                const paidVal = Number(inv.paidAmount || 0);
                const remaining = Math.max(0, totalVal - paidVal);

                let statusText = 'Chưa thanh toán';
                let badgeClass = 'badge-danger';
                if (paidVal >= totalVal && totalVal > 0) {
                  statusText = 'Đã thanh toán';
                  badgeClass = 'badge-success';
                } else if (paidVal > 0) {
                  statusText = 'Thanh toán một phần';
                  badgeClass = 'badge-warning';
                }

                return (
                  <tr key={inv.id}>
                    <td><strong>{inv.code}</strong></td>
                    <td><strong>{inv.patientName}</strong></td>
                    <td>{inv.invoiceDate || inv.date}</td>
                    <td>{inv.serviceName}</td>
                    <td><strong>{totalVal.toLocaleString('vi-VN')} đ</strong></td>
                    <td style={{ color: '#10b981', fontWeight: 700 }}>{paidVal.toLocaleString('vi-VN')} đ</td>
                    <td style={{ color: remaining > 0 ? '#e11d48' : '#64748b', fontWeight: 700 }}>
                      {remaining.toLocaleString('vi-VN')} đ
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {statusText}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {remaining > 0 && (
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ marginRight: '0.375rem', padding: '0.25rem 0.625rem', fontSize: '0.8rem', backgroundColor: '#0284c7' }}
                          onClick={() => handleOpenPayMore(inv)}
                          title="Thanh toán thêm công nợ"
                        >
                          + Trả thêm
                        </button>
                      )}

                      <button
                        className="btn-icon"
                        onClick={() => { setSelectedInvoice(inv); setIsPrintModalOpen(true); }}
                        title="In hóa đơn"
                      >
                        <Printer size={18} />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => setDeleteTarget(inv)}
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
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Không tìm thấy hóa đơn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Lập Hóa Đơn Mới"
        footer={<><button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Hủy</button><button className="btn btn-primary" onClick={handleSaveNew}>Lưu Hóa Đơn</button></>}>
        <form onSubmit={handleSaveNew}>
          <div className="form-group">
            <label className="form-label">Chọn Bệnh nhân *</label>
            <select className="form-control" value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tên dịch vụ / Nội dung thanh toán *</label>
            <input type="text" className="form-control" value={formData.serviceName} onChange={e => setFormData({ ...formData, serviceName: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tổng tiền (VNĐ) *</label>
              <input type="number" className="form-control" value={formData.total} onChange={e => setFormData({ ...formData, total: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Số tiền đã thu lần 1 *</label>
              <input type="number" className="form-control" value={formData.paidAmount} onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) })} required />
            </div>
          </div>
        </form>
      </Modal>

      {/* Pay More Modal (Trả Thêm / Thanh Toán Công Nợ) */}
      <Modal
        isOpen={isPayMoreModalOpen}
        onClose={() => setIsPayMoreModalOpen(false)}
        title={`Thanh Toán Thêm Công Nợ - ${selectedInvoice?.code}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsPayMoreModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSavePayMore} style={{ backgroundColor: '#0284c7' }}>
              Xác Nhận Thu Tiền
            </button>
          </>
        }
      >
        {selectedInvoice && (() => {
          const totalVal = Number(selectedInvoice.total || selectedInvoice.totalAmount || 0);
          const paidVal = Number(selectedInvoice.paidAmount || 0);
          const remaining = Math.max(0, totalVal - paidVal);

          return (
            <form onSubmit={handleSavePayMore}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                <p style={{ margin: '0 0 0.375rem 0' }}><strong>Bệnh nhân:</strong> {selectedInvoice.patientName}</p>
                <p style={{ margin: '0 0 0.375rem 0' }}><strong>Tổng giá trị hóa đơn:</strong> {totalVal.toLocaleString('vi-VN')} VNĐ</p>
                <p style={{ margin: '0 0 0.375rem 0', color: '#10b981' }}><strong>Đã thanh toán:</strong> {paidVal.toLocaleString('vi-VN')} VNĐ</p>
                <p style={{ margin: 0, color: '#e11d48', fontSize: '1rem' }}>
                  <strong>CÒN NỢ: {remaining.toLocaleString('vi-VN')} VNĐ</strong>
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Số tiền trả lần này (VNĐ) *</label>
                <input
                  type="number"
                  className="form-control"
                  max={remaining}
                  min={1000}
                  value={payFormData.amount}
                  onChange={e => setPayFormData({ ...payFormData, amount: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phương thức thanh toán *</label>
                  <select
                    className="form-control"
                    value={payFormData.paymentMethod}
                    onChange={e => setPayFormData({ ...payFormData, paymentMethod: e.target.value })}
                  >
                    <option value="Tiền mặt">Tiền mặt</option>
                    <option value="Chuyển khoản QR">Chuyển khoản QR</option>
                    <option value="Thẻ ngân hàng (POS)">Thẻ ngân hàng (POS)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ngày thanh toán</label>
                  <input
                    type="date"
                    className="form-control"
                    value={payFormData.paymentDate}
                    onChange={e => setPayFormData({ ...payFormData, paymentDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú giao dịch</label>
                <input
                  type="text"
                  className="form-control"
                  value={payFormData.notes}
                  onChange={e => setPayFormData({ ...payFormData, notes: e.target.value })}
                  placeholder="Ghi chú đợt thanh toán này..."
                />
              </div>
            </form>
          );
        })()}
      </Modal>

      {/* Print Receipt Modal */}
      <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="Xem & In Hóa Đơn Thanh Toán"
        footer={<button className="btn btn-primary" onClick={() => { window.print(); setIsPrintModalOpen(false); }}>In Hóa Đơn (Print)</button>}>
        {selectedInvoice && (() => {
          const totalVal = Number(selectedInvoice.total || selectedInvoice.totalAmount || 0);
          const paidVal = Number(selectedInvoice.paidAmount || 0);
          const remaining = Math.max(0, totalVal - paidVal);

          return (
            <div style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', fontSize: '0.9rem' }}>
              <h3 style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 800 }}>PHÒNG KHÁM NHA KHOA LUCKY DENTAL</h3>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>ĐC: 123 Nguyễn Trãi, Q.5, TP.HCM • Hotline: 1900 6868</p>
              <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
              <p><strong>Mã hóa đơn:</strong> {selectedInvoice.code}</p>
              <p><strong>Bệnh nhân:</strong> {selectedInvoice.patientName}</p>
              <p><strong>Ngày lập:</strong> {selectedInvoice.invoiceDate || selectedInvoice.date}</p>
              <p><strong>Nội dung:</strong> {selectedInvoice.serviceName}</p>
              <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
              <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Tổng thanh toán: {totalVal.toLocaleString('vi-VN')} đ</p>
              <p style={{ color: '#10b981', fontWeight: 700 }}>Đã thu: {paidVal.toLocaleString('vi-VN')} đ</p>
              <p style={{ color: remaining > 0 ? '#e11d48' : '#64748b', fontWeight: 700 }}>Còn nợ: {remaining.toLocaleString('vi-VN')} đ</p>
            </div>
          );
        })()}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Hóa Đơn" message={`Xóa hóa đơn "${deleteTarget?.code}"?`} />
    </div>
  );
};
