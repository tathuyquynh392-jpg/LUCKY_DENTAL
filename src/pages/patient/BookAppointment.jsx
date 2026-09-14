import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/Toast';
import { Calendar, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const doctors = storageService.getDoctors();
  const services = storageService.getServices();

  const [formData, setFormData] = useState({
    serviceId: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    notes: ''
  });

  const [error, setError] = useState('');
  const [toast, setToast] = useState({ type: 'success', message: '' });

  useEffect(() => {
    if (services.length > 0 && doctors.length > 0) {
      setFormData(prev => ({
        ...prev,
        serviceId: services[0].id,
        doctorId: doctors[0].id
      }));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.date || !formData.time) {
      setError('Vui lòng chọn ngày và giờ khám!');
      return;
    }

    // Doctor Conflict Check
    const appointments = storageService.getAppointments();
    const conflict = appointments.some(
      a => a.doctorId === formData.doctorId && a.date === formData.date && a.time === formData.time && a.status !== 'CANCELLED'
    );

    if (conflict) {
      setError('Bác sĩ đã có lịch hẹn vào khung giờ này. Vui lòng chọn khung giờ hoặc bác sĩ khác!');
      return;
    }

    const selectedSrv = services.find(s => s.id === formData.serviceId);
    const selectedDoc = doctors.find(d => d.id === formData.doctorId);

    storageService.addAppointment({
      patientId: user?.patientId || 'pat-1',
      patientName: user?.name || 'Nguyễn Văn An',
      phone: user?.phone || '0988776655',
      doctorId: formData.doctorId,
      doctorName: selectedDoc?.name || 'BS. Trần Minh Tuấn',
      serviceId: formData.serviceId,
      serviceName: selectedSrv?.name || 'Khám Tổng Quát',
      date: formData.date,
      time: formData.time,
      status: 'PENDING',
      notes: formData.notes
    });

    setToast({ type: 'success', message: 'Đặt lịch thành công! Vui lòng chờ phòng khám xác nhận.' });
    setTimeout(() => {
      navigate('/patient/appointments');
    }, 1500);
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <PlusCircle className="text-sky-500" size={28} style={{ color: '#0ea5e9' }} />
            Đặt Lịch Khám Trực Tuyến
          </h1>
          <p className="page-subtitle">Chọn dịch vụ, bác sĩ và thời gian khám thuận tiện nhất cho bạn</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem' }}>
        {error && (
          <div style={{ backgroundColor: '#ffe4e6', border: '1px solid #fecdd3', color: '#be123c', padding: '0.875rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service */}
          <div className="form-group">
            <label className="form-label">1. Chọn Dịch Vụ Nha Khoa *</label>
            <select
              className="form-control"
              value={formData.serviceId}
              onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} - Giá: {Number(s.price).toLocaleString('vi-VN')} đ ({s.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Doctor */}
          <div className="form-group">
            <label className="form-label">2. Chọn Bác Sĩ Chuyên Khoa *</label>
            <select
              className="form-control"
              value={formData.doctorId}
              onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>

          {/* Step 3 & 4: Date & Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">3. Chọn Ngày Khám *</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">4. Chọn Khung Giờ Khám *</label>
              <select
                className="form-control"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              >
                <option value="08:30">08:30 sáng</option>
                <option value="09:00">09:00 sáng</option>
                <option value="09:30">09:30 sáng</option>
                <option value="10:00">10:00 sáng</option>
                <option value="10:30">10:30 sáng</option>
                <option value="14:00">14:00 chiều</option>
                <option value="14:30">14:30 chiều</option>
                <option value="15:00">15:00 chiều</option>
                <option value="15:30">15:30 chiều</option>
                <option value="16:00">16:00 chiều</option>
              </select>
            </div>
          </div>

          {/* Step 5: Notes */}
          <div className="form-group">
            <label className="form-label">5. Ghi Chú Yêu Cầu Thêm</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Mô tả triệu chứng đau răng, yêu cầu đặc biệt..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700, marginTop: '1rem' }}
          >
            Xác Nhận Đặt Lịch Hẹn
          </button>
        </form>
      </div>
    </div>
  );
};
