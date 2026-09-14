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
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

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

  const loadData = () => {
    setInvoices(storageService.getInvoices());
    setPatients(storageService.getPatients());
    setServices(storageService.getServices());
  };

  useEffect(() => { loadData(); }, []);

  const filtered = invoices.filter(i =>
    i.patientName.toLowerCase().includes(search.toLowerCase()) ||
    (i.code && i.code.toLowerCase().includes(search.toLowerCase()))
  );

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
    e.preventDefault();
    const pat = patients.find(p => p.id === formData.patientId);
    storageService.addInvoice({
      ...formData,
      patientName: pat?.name || formData.patientName
    });
    loadData();
    setIsAddModalOpen(false);
    setToast({ type: 'success', message: 'Tạo hóa đơn mới thành công!' });
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
            Quản Lý Hóa Đơn
          </h1>
          <p className="page-subtitle">Quản lý hóa đơn dịch vụ & theo dõi dư nợ bệnh nhân</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Lập Hóa Đơn Mới
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
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
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(inv => (
                <tr key={inv.id}>
                  <td><strong>{inv.code}</strong></td>
                  <td><strong>{inv.patientName}</strong></td>
                  <td>{inv.invoiceDate || inv.date}</td>
                  <td>{inv.serviceName}</td>
                  <td><strong>{Number(inv.total || inv.totalAmount).toLocaleString('vi-VN')} đ</strong></td>
                  <td style={{ color: '#10b981', fontWeight: 700 }}>{Number(inv.paidAmount).toLocaleString('vi-VN')} đ</td>
                  <td>
                    <span className={`badge ${inv.status === 'Đã thanh toán' ? 'badge-success' : 'badge-warning'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => { setSelectedInvoice(inv); setIsPrintModalOpen(true); }} title="In hóa đơn">
                      <Printer size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => setDeleteTarget(inv)} style={{ color: '#f43f5e' }} title="Xóa"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
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
              <label className="form-label">Số tiền đã thu *</label>
              <input type="number" className="form-control" value={formData.paidAmount} onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) })} required />
            </div>
          </div>
        </form>
      </Modal>

      {/* Print Receipt Modal */}
      <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="Xem & In Hóa Đơn Thanh Toán"
        footer={<button className="btn btn-primary" onClick={() => { window.print(); setIsPrintModalOpen(false); }}>In Hóa Đơn (Print)</button>}>
        {selectedInvoice && (
          <div style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', fontSize: '0.9rem' }}>
            <h3 style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 800 }}>PHÒNG KHÁM NHA KHOA LUCKY DENTAL</h3>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>ĐC: 123 Nguyễn Trãi, Q.5, TP.HCM • Hotline: 1900 6868</p>
            <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
            <p><strong>Mã hóa đơn:</strong> {selectedInvoice.code}</p>
            <p><strong>Bệnh nhân:</strong> {selectedInvoice.patientName}</p>
            <p><strong>Ngày lập:</strong> {selectedInvoice.invoiceDate || selectedInvoice.date}</p>
            <p><strong>Nội dung:</strong> {selectedInvoice.serviceName}</p>
            <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Tổng thanh toán: {Number(selectedInvoice.total || selectedInvoice.totalAmount).toLocaleString('vi-VN')} đ</p>
            <p style={{ color: '#10b981', fontWeight: 700 }}>Đã thu: {Number(selectedInvoice.paidAmount).toLocaleString('vi-VN')} đ</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa Hóa Đơn" message={`Xóa hóa đơn "${deleteTarget?.code}"?`} />
    </div>
  );
};
