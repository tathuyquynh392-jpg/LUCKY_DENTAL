import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Modal } from '../../components/Modal';
import { Receipt, Printer } from 'lucide-react';

export const PatientInvoices = () => {
  const { user } = useAuth();
  const invoices = storageService.getInvoices().filter(i => i.patientName === user?.name || i.patientId === user?.patientId);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Receipt className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Hóa Đơn & Lịch Sử Thanh Toán
          </h1>
          <p className="page-subtitle">Chi tiết dịch vụ đã sử dụng và biên lai thanh toán</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Dịch vụ sử dụng</th>
                <th>Ngày lập</th>
                <th>Tổng tiền</th>
                <th>Đã thanh toán</th>
                <th>Còn nợ</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Biên lai</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    Bạn chưa có hóa đơn nào.
                  </td>
                </tr>
              ) : (
                invoices.map(inv => {
                  const debt = (inv.total || inv.totalAmount) - inv.paidAmount;
                  return (
                    <tr key={inv.id}>
                      <td><strong>{inv.code}</strong></td>
                      <td><strong>{inv.serviceName}</strong></td>
                      <td>{inv.invoiceDate || inv.date}</td>
                      <td><strong>{Number(inv.total || inv.totalAmount).toLocaleString('vi-VN')} đ</strong></td>
                      <td style={{ color: '#10b981', fontWeight: 700 }}>{Number(inv.paidAmount).toLocaleString('vi-VN')} đ</td>
                      <td style={{ color: debt > 0 ? '#f43f5e' : '#64748b', fontWeight: 700 }}>{Number(debt).toLocaleString('vi-VN')} đ</td>
                      <td>
                        <span className={`badge ${inv.status === 'Đã thanh toán' ? 'badge-success' : 'badge-warning'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedInvoice(inv)}>
                          <Printer size={14} /> In Biên Lai
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title="Biên Lai Thanh Toán"
        footer={<button className="btn btn-primary" onClick={() => { window.print(); setSelectedInvoice(null); }}>In Hóa Đơn (Print)</button>}>
        {selectedInvoice && (
          <div style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', fontSize: '0.9rem' }}>
            <h3 style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 800 }}>PHÒNG KHÁM NHA KHOA LUCKY DENTAL</h3>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>ĐC: 123 Nguyễn Trãi, Q.5, TP.HCM • Hotline: 1900 6868</p>
            <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
            <p><strong>Mã hóa đơn:</strong> {selectedInvoice.code}</p>
            <p><strong>Bệnh nhân:</strong> {selectedInvoice.patientName}</p>
            <p><strong>Ngày thanh toán:</strong> {selectedInvoice.invoiceDate || selectedInvoice.date}</p>
            <p><strong>Nội dung dịch vụ:</strong> {selectedInvoice.serviceName}</p>
            <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Tổng tiền: {Number(selectedInvoice.total || selectedInvoice.totalAmount).toLocaleString('vi-VN')} đ</p>
            <p style={{ color: '#10b981', fontWeight: 700 }}>Đã thanh toán: {Number(selectedInvoice.paidAmount).toLocaleString('vi-VN')} đ</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
