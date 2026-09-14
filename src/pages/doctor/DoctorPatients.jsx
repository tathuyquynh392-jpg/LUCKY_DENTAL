import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { Pagination } from '../../components/Pagination';
import { Users, Search, FileText } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);

  useEffect(() => {
    const doctors = storageService.getDoctors();
    const doc = doctors.find(d => d.id === user?.doctorId || d.email === user?.email || d.name === user?.name) || doctors[0];
    const appointments = storageService.getAppointments();
    const docAptPatients = appointments.filter(a => a.doctorId === doc?.id || a.doctorName === doc?.name).map(a => a.patientId);

    const allPatients = storageService.getPatients();
    // Filter patients assigned to doctor or return all patients
    const assigned = allPatients.filter(p => docAptPatients.includes(p.id) || true);
    setPatients(assigned);
  }, []);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const totalItems = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleViewRecords = (patient) => {
    setSelectedPatient(patient);
    const records = storageService.getRecords();
    const pRecs = records.filter(r => r.patientId === patient.id || r.patientName === patient.name);
    setPatientRecords(pRecs);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Danh Sách Bệnh Nhân Phụ Trách
          </h1>
          <p className="page-subtitle">Xem thông tin chi tiết và hồ sơ bệnh án của bệnh nhân</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên bệnh nhân, SĐT, mã bệnh nhân..."
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
                <th>Mã BN</th>
                <th>Họ và tên bệnh nhân</th>
                <th>Ngày sinh / Giới tính</th>
                <th>SĐT & Email</th>
                <th>Địa chỉ</th>
                <th>Tiền sử bệnh</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.code}</strong></td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.dob} ({p.gender})</td>
                  <td>
                    <div>{p.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.email}</div>
                  </td>
                  <td>{p.address}</td>
                  <td><span className="badge badge-warning">{p.medicalHistory || 'Không'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleViewRecords(p)}>
                      <FileText size={14} /> Hồ sơ khám
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Patient Record Modal */}
      <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`Hồ Sơ Khám - ${selectedPatient?.name}`}
        footer={<button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>Đóng</button>}>
        <div>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
            <p><strong>Tiền sử dị ứng:</strong> {selectedPatient?.allergy || 'Không'}</p>
            <p><strong>Bệnh lý toàn thân:</strong> {selectedPatient?.medicalHistory || 'Không'}</p>
            <p><strong>Ghi chú theo dõi:</strong> {selectedPatient?.notes || 'Không'}</p>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Lịch Sử Khám & Đơn Thuốc:</h4>
          {patientRecords.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Chưa có hồ sơ bệnh án nào.</p>
          ) : (
            patientRecords.map(r => (
              <div key={r.id} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0ea5e9', marginBottom: '0.5rem' }}>
                  <span>{r.code} - Bác sĩ: {r.doctorName}</span>
                  <span>Tái khám: {r.followUpDate || 'Không'}</span>
                </div>
                <p><strong>Triệu chứng:</strong> {r.symptoms}</p>
                <p><strong>Chẩn đoán:</strong> {r.diagnosis}</p>
                <p><strong>Điều trị:</strong> {r.treatment}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
