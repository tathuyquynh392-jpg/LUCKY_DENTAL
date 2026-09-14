import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/Toast';
import { Calendar, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allServices = storageService.getServices();
  const allDoctors = storageService.getDoctors();
  const allLeaveRequests = storageService.getDoctorLeaveRequests();
  const allAppointments = storageService.getAppointments();

  // Filter active services
  const activeServices = allServices.filter(s => s.status === 'Đang hoạt động' || s.status === 'Hoạt động' || !s.status);
  
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    serviceId: activeServices[0]?.id || '',
    doctorId: '',
    date: todayStr,
    time: '09:00',
    notes: ''
  });

  const [error, setError] = useState('');
  const [toast, setToast] = useState({ type: 'success', message: '' });

  // Helper: check if doctor is on approved leave on given date
  const isDoctorOnLeave = (doctorId, dateStr) => {
    if (!doctorId || !dateStr) return false;
    return allLeaveRequests.some(req => {
      if (req.doctorId !== doctorId || req.status !== 'APPROVED') return false;
      return dateStr >= req.startDate && dateStr <= req.endDate;
    });
  };

  // Filter available doctors (active + not on leave for selected date)
  const activeDoctors = allDoctors.filter(d => {
    const isActive = d.status === 'Đang hoạt động' || d.status === 'Hoạt động' || !d.status;
    if (!isActive) return false;
    return !isDoctorOnLeave(d.id, formData.date);
  });

  // Auto select default service and doctor on load/change
  useEffect(() => {
    if (activeServices.length > 0 && (!formData.serviceId || !activeServices.some(s => s.id === formData.serviceId))) {
      setFormData(prev => ({ ...prev, serviceId: activeServices[0].id }));
    }
  }, [allServices]);

  useEffect(() => {
    if (activeDoctors.length > 0 && (!formData.doctorId || !activeDoctors.some(d => d.id === formData.doctorId))) {
      setFormData(prev => ({ ...prev, doctorId: activeDoctors[0].id }));
    } else if (activeDoctors.length === 0) {
      setFormData(prev => ({ ...prev, doctorId: '' }));
    }
  }, [formData.date, allDoctors, allLeaveRequests]);

  // Selected entities for price calculation & summary
  const selectedService = allServices.find(s => s.id === formData.serviceId);
  const selectedDoctor = allDoctors.find(d => d.id === formData.doctorId);
  const expectedCost = selectedService ? selectedService.price : 0;

  // Check which time slots are booked for selected doctor & date
  const bookedSlots = allAppointments
    .filter(a => a.doctorId === formData.doctorId && a.date === formData.date && a.status !== 'CANCELLED' && a.status !== 'Đã hủy')
    .map(a => a.time);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.serviceId) {
      setError('Vui lòng chọn dịch vụ nha khoa!');
      return;
    }
    if (!formData.doctorId) {
      setError('Vui lòng chọn bác sĩ phụ trách! (Hoặc chọn ngày khác nếu bác sĩ đang nghỉ)');
      return;
    }
    if (!formData.date) {
      setError('Vui lòng chọn ngày khám!');
      return;
    }
    if (formData.date < todayStr) {
      setError('Ngày khám không thể là ngày trong quá khứ!');
      return;
    }
    if (!formData.time) {
      setError('Vui lòng chọn khung giờ khám!');
      return;
    }

    // Check doctor leave
    if (isDoctorOnLeave(formData.doctorId, formData.date)) {
      setError(`Bác sĩ ${selectedDoctor?.name || ''} đang nghỉ phép trong ngày ${formData.date}. Vui lòng chọn ngày hoặc bác sĩ khác!`);
      return;
    }

    // Check time slot conflict
    if (bookedSlots.includes(formData.time)) {
      setError(`Khung giờ ${formData.time} đã có lịch khám khác. Vui lòng chọn khung giờ khác!`);
      return;
    }

    // Create appointment
    const newAppointment = {
      patientId: user?.patientId || user?.id || 'pat-1',
      patientName: user?.name || 'Bệnh nhân Demo',
      phone: user?.phone || '0988776655',
      doctorId: formData.doctorId,
      doctorName: selectedDoctor?.name || 'BS. Chuyên Khoa',
      serviceId: formData.serviceId,
      serviceName: selectedService?.name || 'Khám tổng quát',
      date: formData.date,
      time: formData.time,
      price: expectedCost,
      status: 'PENDING',
      notes: formData.notes
    };

    storageService.addAppointment(newAppointment);

    setToast({ type: 'success', message: 'Đặt lịch khám thành công! Cảm ơn bạn.' });
    setTimeout(() => {
      navigate('/patient/appointments');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          Đặt Lịch Khám Online
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Chọn dịch vụ nha khoa, bác sĩ và khung giờ tiện lợi cho bạn
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#ffe4e6', border: '1px solid #fecdd3', color: '#be123c', padding: '0.875rem 1.25rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="card" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Dịch vụ */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1' }}>
              1. Chọn Dịch Vụ Nha Khoa *
            </label>
            <select
              className="form-control"
              style={{ fontSize: '0.95rem', padding: '0.75rem', borderRadius: '10px' }}
              value={formData.serviceId}
              onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
              required
            >
              {activeServices.length === 0 ? (
                <option value="">Không có dịch vụ khả dụng</option>
              ) : (
                activeServices.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} - Giá: {Number(s.price).toLocaleString('vi-VN')} đ ({s.duration || '30 phút'})
                  </option>
                ))
              )}
            </select>
            {selectedService && selectedService.description && (
              <p style={{ marginTop: '0.375rem', fontSize: '0.825rem', color: '#64748b', fontStyle: 'italic' }}>
                💡 {selectedService.description}
              </p>
            )}
          </div>

          {/* Step 2: Bác sĩ */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1' }}>
              2. Chọn Bác Sĩ Phụ Trách *
            </label>
            <select
              className="form-control"
              style={{ fontSize: '0.95rem', padding: '0.75rem', borderRadius: '10px' }}
              value={formData.doctorId}
              onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
              required
            >
              {activeDoctors.length === 0 ? (
                <option value="">Không có bác sĩ làm việc vào ngày đã chọn</option>
              ) : (
                activeDoctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} — Chuyên khoa: {d.specialty}
                  </option>
                ))
              )}
            </select>
            {activeDoctors.length === 0 && (
              <p style={{ color: '#e11d48', fontSize: '0.825rem', marginTop: '0.375rem' }}>
                ⚠️ Bác sĩ trong hệ thống đang nghỉ phép vào ngày đã chọn. Vui lòng chọn ngày khám khác!
              </p>
            )}
          </div>

          {/* Step 3: Ngày khám */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1' }}>
              3. Chọn Ngày Khám *
            </label>
            <input
              type="date"
              className="form-control"
              style={{ fontSize: '0.95rem', padding: '0.75rem', borderRadius: '10px' }}
              value={formData.date}
              min={todayStr}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Step 4: Khung giờ */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1' }}>
              4. Chọn Khung Giờ Khám *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.625rem', marginTop: '0.5rem' }}>
              {TIME_SLOTS.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = formData.time === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setFormData({ ...formData, time: slot })}
                    style={{
                      padding: '0.625rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      backgroundColor: isBooked ? '#f1f5f9' : (isSelected ? '#0284c7' : '#ffffff'),
                      color: isBooked ? '#94a3b8' : (isSelected ? '#ffffff' : '#334155'),
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      textDecoration: isBooked ? 'line-through' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              * Khung giờ gạch ngang nhạt màu đã có khách hàng khác đặt trước.
            </p>
          </div>

          {/* Step 5: Ghi chú */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1' }}>
              5. Ghi chú mô tả triệu chứng hoặc yêu cầu khác
            </label>
            <textarea
              className="form-control"
              rows={3}
              style={{ fontSize: '0.9rem', borderRadius: '10px' }}
              placeholder="Ví dụ: Đau răng nhức về đêm, muốn khám niềng răng, tư vấn tẩy trắng..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* SECTION: XÁC NHẬN THÔNG TIN ĐẶT LỊCH */}
          <div style={{ backgroundColor: '#f0f9ff', border: '1.5px dashed #0284c7', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0369a1', marginTop: 0, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📋 XÁC NHẬN THÔNG TIN ĐẶT LỊCH
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.925rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Dịch vụ</span>
                <strong style={{ color: '#0f172a' }}>{selectedService?.name || 'Chưa chọn'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Bác sĩ phụ trách</span>
                <strong style={{ color: '#0f172a' }}>{selectedDoctor?.name || 'Chưa chọn'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Chi phí dự kiến</span>
                <strong style={{ color: '#0284c7', fontSize: '1.05rem' }}>
                  {Number(expectedCost).toLocaleString('vi-VN')} VNĐ
                </strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Khung giờ & Ngày khám</span>
                <strong style={{ color: '#0f172a' }}>
                  {formData.time} — {formData.date ? new Date(formData.date).toLocaleDateString('vi-VN') : ''}
                </strong>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: '12px',
              backgroundColor: '#0284c7',
              borderColor: '#0284c7',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              cursor: 'pointer'
            }}
          >
            Xác nhận đặt lịch khám
          </button>
        </form>
      </div>
    </div>
  );
};
