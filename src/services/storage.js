// LUCKY DENTAL - Complete Storage & Local State Management Engine

const KEYS = {
  USERS: 'lucky_dental_users',
  PATIENTS: 'lucky_dental_patients',
  DOCTORS: 'lucky_dental_doctors',
  SERVICES: 'lucky_dental_services',
  APPOINTMENTS: 'lucky_dental_appointments',
  RECORDS: 'lucky_dental_records',
  TREATMENTS: 'lucky_dental_treatments',
  MEDICATIONS: 'lucky_dental_medications',
  INVOICES: 'lucky_dental_invoices',
  PAYMENTS: 'lucky_dental_payments',
  NOTIFICATIONS: 'lucky_dental_notifications',
  CURRENT_USER: 'lucky_dental_current_user'
};

// Default Pre-populated Demo Data
const DEFAULT_USERS = [
  { id: 'usr-admin', username: 'admin', email: 'admin@luckydental.com', name: 'Nguyễn Văn Quản Lý', role: 'ADMIN', status: 'ACTIVE', phone: '0901234567', createdAt: '2026-01-01' },
  { id: 'usr-pat1', username: 'patient', email: 'patient@luckydental.com', name: 'Trần Thị Bệnh Nhân', role: 'PATIENT', status: 'ACTIVE', phone: '0988776655', patientId: 'pat-1', createdAt: '2026-01-10' },
  { id: 'usr-pat2', username: 'lemai', email: 'mai.le@gmail.com', name: 'Lê Thị Mai', role: 'PATIENT', status: 'ACTIVE', phone: '0977112233', patientId: 'pat-2', createdAt: '2026-01-15' },
  { id: 'usr-pat3', username: 'hoanglong', email: 'long.pham@gmail.com', name: 'Phạm Hoàng Long', role: 'PATIENT', status: 'ACTIVE', phone: '0909888777', patientId: 'pat-3', createdAt: '2026-02-01' }
];

const DEFAULT_PATIENTS = [
  { id: 'pat-1', userId: 'usr-pat1', code: 'BN001', name: 'Trần Thị Bệnh Nhân', email: 'patient@luckydental.com', phone: '0988776655', dob: '1994-05-12', gender: 'Nữ', address: '123 Nguyễn Trãi, Q.5, TP.HCM', medicalHistory: 'Dị ứng Penicillin', allergy: 'Penicillin', notes: 'Bệnh nhân nhạy cảm đau', status: 'Hoạt động', createdAt: '2026-01-10' },
  { id: 'pat-2', userId: 'usr-pat2', code: 'BN002', name: 'Lê Thị Mai', email: 'mai.le@gmail.com', phone: '0977112233', dob: '1998-09-24', gender: 'Nữ', address: '456 Lê Lợi, Q.1, TP.HCM', medicalHistory: 'Tiền sử huyết áp thấp', allergy: 'Không', notes: 'Đang theo dõi niềng răng', status: 'Hoạt động', createdAt: '2026-01-15' },
  { id: 'pat-3', userId: 'usr-pat3', code: 'BN003', name: 'Phạm Hoàng Long', email: 'long.pham@gmail.com', phone: '0909888777', dob: '1981-11-03', gender: 'Nam', address: '789 Võ Văn Tần, Q.3, TP.HCM', medicalHistory: 'Tiểu đường tuýp 2 nhẹ', allergy: 'Aspirin', notes: 'Khám định kỳ 6 tháng', status: 'Hoạt động', createdAt: '2026-02-01' },
  { id: 'pat-4', code: 'BN004', name: 'Trần Hương Giang', email: 'giang.tran@gmail.com', phone: '0934567890', dob: '2001-03-18', gender: 'Nữ', address: '12 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM', medicalHistory: 'Không', allergy: 'Không', notes: 'Muốn tẩy trắng răng', status: 'Hoạt động', createdAt: '2026-02-20' },
  { id: 'pat-5', code: 'BN005', name: 'Vũ Đức Anh', email: 'ducanh.vu@gmail.com', phone: '0918273645', dob: '1988-07-30', gender: 'Nam', address: '88 CMT8, Q.10, TP.HCM', medicalHistory: 'Gan nhiễm mỡ', allergy: 'Không', notes: 'Tư vấn cấy ghép Implant', status: 'Hoạt động', createdAt: '2026-03-01' }
];

const DEFAULT_DOCTORS = [
  { id: 'doc-1', code: 'BS001', name: 'BS. CKII. Trần Minh Tuấn', email: 'tuan.tran@luckydental.com', phone: '0912345678', specialty: 'Nha Khoa Thẩm Mỹ & Niềng Răng', qualification: 'Thạc sĩ - BSCKII Y Dược TP.HCM', experience: '12 năm', workingDays: 'Thứ 2 - Thứ 6', workingHours: '08:00 - 17:00', status: 'Hoạt động', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300' },
  { id: 'doc-2', code: 'BS002', name: 'BS. CKI. Nguyễn Thị Hồng', email: 'hong.nguyen@luckydental.com', phone: '0922334455', specialty: 'Răng Hàm Mặt & Implant', qualification: 'BSCKI Răng Hàm Mặt', experience: '9 năm', workingDays: 'Thứ 3 - Chủ Nhật', workingHours: '08:30 - 18:00', status: 'Hoạt động', avatar: 'https://images.unsplash.com/photo-1594824813566-88a8340d8692?w=300' },
  { id: 'doc-3', code: 'BS003', name: 'ThS. BS. Vũ Quốc Bảo', email: 'bao.vu@luckydental.com', phone: '0933445566', specialty: 'Nhổ Răng Khôn & Nội Nha', qualification: 'Thạc sĩ Y Khoa', experience: '7 năm', workingDays: 'Thứ 2 - Thứ 7', workingHours: '08:00 - 17:30', status: 'Hoạt động', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300' },
  { id: 'doc-4', code: 'BS004', name: 'BS. Phạm Khánh Linh', email: 'linh.pham@luckydental.com', phone: '0944556677', specialty: 'Nha Khoa Trẻ Em & Tổng Quát', qualification: 'Bác sĩ Răng Hàm Mặt', experience: '5 năm', workingDays: 'Thứ 2 - Chủ Nhật', workingHours: '09:00 - 18:30', status: 'Hoạt động', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300' }
];

const DEFAULT_SERVICES = [
  { id: 'srv-1', code: 'DV001', name: 'Khám Tổng Quát & Tư Vấn', description: 'Khám kiểm tra toàn bộ khoang miệng, chụp X-quang chẩn đoán.', price: 150000, duration: '20 phút', status: 'Hoạt động' },
  { id: 'srv-2', code: 'DV002', name: 'Lấy Cao Răng & Đánh Bóng', description: 'Làm sạch cao răng bằng sóng siêu âm không đau, đánh bóng mịn răng.', price: 300000, duration: '30 phút', status: 'Hoạt động' },
  { id: 'srv-3', code: 'DV003', name: 'Trám Răng Composite Thẩm Mỹ', description: 'Trám lỗ sâu răng bằng vật liệu Composite chịu lực màu tự nhiên.', price: 400000, duration: '45 phút', status: 'Hoạt động' },
  { id: 'srv-4', code: 'DV004', name: 'Nhổ Răng Khôn Mọc Lệch', description: 'Nhổ răng khôn bằng công nghệ Piezotome giảm tối đa sưng đau.', price: 1800000, duration: '45 phút', status: 'Hoạt động' },
  { id: 'srv-5', code: 'DV005', name: 'Điều Trị Tủy Răng Hàm', description: 'Làm sạch ống tủy, hàn kín ống tủy bằng Gutta Percha.', price: 1200000, duration: '60 phút', status: 'Hoạt động' },
  { id: 'srv-6', code: 'DV006', name: 'Tẩy Trắng Răng Laser Whitening', description: 'Tẩy trắng răng bằng ánh sáng Laser công nghệ Đức bật 2-4 tông.', price: 2500000, duration: '60 phút', status: 'Hoạt động' },
  { id: 'srv-7', code: 'DV007', name: 'Niềng Răng Mắc Cài Kim Loại', description: 'Chỉnh nha nắn chỉnh răng đều đặn chuẩn khớp cắn.', price: 28000000, duration: '18-24 tháng', status: 'Hoạt động' },
  { id: 'srv-8', code: 'DV008', name: 'Bọc Răng Sứ Zirconia', description: 'Răng sứ nguyên chất độ bền 20 năm, màu sắc tự nhiên sáng bóng.', price: 4500000, duration: '2 lần hẹn', status: 'Hoạt động' },
  { id: 'srv-9', code: 'DV009', name: 'Cấy Ghép Implant Straumann', description: 'Trụ Implant Thụy Sĩ phục hồi răng mất vĩnh viễn.', price: 19500000, duration: '60 phút', status: 'Hoạt động' }
];

const DEFAULT_APPOINTMENTS = [
  { id: 'apt-1', code: 'LH001', patientId: 'pat-1', patientName: 'Trần Thị Bệnh Nhân', phone: '0988776655', doctorId: 'doc-1', doctorName: 'BS. CKII. Trần Minh Tuấn', serviceId: 'srv-2', serviceName: 'Lấy Cao Răng & Đánh Bóng', date: '2026-09-16', time: '09:30', status: 'CONFIRMED', notes: 'Bệnh nhân hẹn đúng giờ' },
  { id: 'apt-2', code: 'LH002', patientId: 'pat-2', patientName: 'Lê Thị Mai', phone: '0977112233', doctorId: 'doc-2', doctorName: 'BS. CKI. Nguyễn Thị Hồng', serviceId: 'srv-6', serviceName: 'Tẩy Trắng Răng Laser Whitening', date: '2026-09-17', time: '14:00', status: 'PENDING', notes: 'Yêu cầu bác sĩ Hồng trực tiếp làm' },
  { id: 'apt-3', code: 'LH003', patientId: 'pat-3', patientName: 'Phạm Hoàng Long', phone: '0909888777', doctorId: 'doc-3', doctorName: 'ThS. BS. Vũ Quốc Bảo', serviceId: 'srv-4', serviceName: 'Nhổ Răng Khôn Mọc Lệch', date: '2026-09-14', time: '10:00', status: 'COMPLETED', notes: 'Đã hoàn thành phẫu thuật nhẹ nhàng' },
  { id: 'apt-4', code: 'LH004', patientId: 'pat-4', patientName: 'Trần Hương Giang', phone: '0934567890', doctorId: 'doc-4', doctorName: 'BS. Phạm Khánh Linh', serviceId: 'srv-1', serviceName: 'Khám Tổng Quát & Tư Vấn', date: '2026-09-18', time: '15:30', status: 'PENDING', notes: 'Khám lần đầu' }
];

const DEFAULT_RECORDS = [
  { id: 'rec-1', code: 'BA001', patientId: 'pat-3', patientName: 'Phạm Hoàng Long', doctorId: 'doc-3', doctorName: 'ThS. BS. Vũ Quốc Bảo', appointmentId: 'apt-3', symptoms: 'Đau nhức sưng vùng nướu răng hàm dưới bên trái', diagnosis: 'Răng khôn 38 mọc lệch 90 độ đâm vào răng 37', dentalCondition: 'Viêm quanh thân răng 38', treatment: 'Nhổ răng 38 Piezotome + Khâu 2 mũi chỉ tự tiêu', prescription: 'Amoxicillin 500mg (14 viên, 2v/ngày)\nParacetamol 500mg (10 viên, 2v/ngày khi đau)\nNước súc miệng Chlorohexidine 0.12%', followUpDate: '2026-09-21', notes: 'Dặn bệnh nhân kiêng đồ nóng, chốt đá lạnh 24h đầu.' },
  { id: 'rec-2', code: 'BA002', patientId: 'pat-1', patientName: 'Trần Thị Bệnh Nhân', doctorId: 'doc-1', doctorName: 'BS. CKII. Trần Minh Tuấn', appointmentId: 'apt-1', symptoms: 'Ê buốt nhẹ khi ăn đồ lạnh', diagnosis: 'Sâu răng mặt nhai răng 46 độ 1', dentalCondition: 'Cao răng độ 2', treatment: 'Cạo vôi răng siêu âm + Trám răng Composite răng 46', prescription: 'Súc miệng nước muối sinh lý 0.9%', followUpDate: '2026-12-15', notes: 'Vệ sinh răng miệng đúng cách 2 lần/ngày.' }
];

const DEFAULT_TREATMENTS = [
  { id: 'trm-1', patientId: 'pat-2', patientName: 'Lê Thị Mai', doctorId: 'doc-1', doctorName: 'BS. CKII. Trần Minh Tuấn', serviceName: 'Niềng Răng Mắc Cài Kim Loại', startDate: '2026-02-10', endDate: '2027-08-10', cost: 28000000, status: 'Đang điều trị', notes: 'Giai đoạn dàn đều răng 2 hàm, tái khám mỗi 4 tuần.' },
  { id: 'trm-2', patientId: 'pat-5', patientName: 'Vũ Đức Anh', doctorId: 'doc-2', doctorName: 'BS. CKI. Nguyễn Thị Hồng', serviceName: 'Cấy Ghép Implant Straumann', startDate: '2026-03-05', endDate: '2026-06-05', cost: 19500000, status: 'Chưa bắt đầu', notes: 'Đợi kết quả xét nghiệm máu & chụp CT ConeBeam.' }
];

const DEFAULT_MEDICATIONS = [
  { id: 'med-1', name: 'Amoxicillin 500mg', category: 'Kháng sinh', unit: 'Viên', quantity: 350, price: 3000, expiryDate: '2027-08-15', supplier: 'Dược Hậu Giang', status: 'Bình thường' },
  { id: 'med-2', name: 'Paracetamol 500mg', category: 'Giảm đau hạ sốt', unit: 'Viên', quantity: 500, price: 1500, expiryDate: '2027-12-30', supplier: 'Pharmedic', status: 'Bình thường' },
  { id: 'med-3', name: 'Augmentin 625mg', category: 'Kháng sinh phổ rộng', unit: 'Viên', quantity: 15, price: 18000, expiryDate: '2026-10-01', supplier: 'GSK', status: 'Sắp hết' },
  { id: 'med-4', name: 'Nước súc miệng Chlorhexidine 0.12%', category: 'Kháng khuẩn', unit: 'Chai 250ml', quantity: 8, price: 85000, expiryDate: '2026-09-30', supplier: 'Kin Dental', status: 'Sắp hết hạn' }
];

const DEFAULT_INVOICES = [
  { id: 'inv-1', code: 'HD001', patientId: 'pat-3', patientName: 'Phạm Hoàng Long', appointmentId: 'apt-3', invoiceDate: '2026-09-14', subtotal: 1800000, discount: 100000, total: 1700000, paidAmount: 1700000, status: 'Đã thanh toán', items: [{ serviceName: 'Nhổ Răng Khôn Mọc Lệch', quantity: 1, unitPrice: 1800000, amount: 1800000 }] },
  { id: 'inv-2', code: 'HD002', patientId: 'pat-1', patientName: 'Trần Thị Bệnh Nhân', appointmentId: 'apt-1', invoiceDate: '2026-08-20', subtotal: 700000, discount: 0, total: 700000, paidAmount: 700000, status: 'Đã thanh toán', items: [{ serviceName: 'Lấy Cao Răng', quantity: 1, unitPrice: 300000, amount: 300000 }, { serviceName: 'Trám Răng Composite', quantity: 1, unitPrice: 400000, amount: 400000 }] },
  { id: 'inv-3', code: 'HD003', patientId: 'pat-2', patientName: 'Lê Thị Mai', appointmentId: 'apt-2', invoiceDate: '2026-09-10', subtotal: 2500000, discount: 200000, total: 2300000, paidAmount: 0, status: 'Chưa thanh toán', items: [{ serviceName: 'Tẩy Trắng Răng Laser Whitening', quantity: 1, unitPrice: 2500000, amount: 2500000 }] }
];

const DEFAULT_PAYMENTS = [
  { id: 'pay-1', code: 'TT001', invoiceId: 'inv-1', patientName: 'Phạm Hoàng Long', amount: 1700000, paymentMethod: 'Chuyển khoản QR', paymentDate: '2026-09-14 11:30', status: 'Thành công' },
  { id: 'pay-2', code: 'TT002', invoiceId: 'inv-2', patientName: 'Trần Thị Bệnh Nhân', amount: 700000, paymentMethod: 'Tiền mặt', paymentDate: '2026-08-20 16:15', status: 'Thành công' }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'notif-1', userId: 'usr-pat1', title: 'Xác nhận lịch hẹn', message: 'Lịch hẹn Lấy Cao Răng của bạn vào lúc 09:30 ngày 16/09/2026 đã được BS. Trần Minh Tuấn xác nhận.', isRead: false, createdAt: '2026-09-14 09:00' },
  { id: 'notif-2', userId: 'usr-pat2', title: 'Nhắc nhở hóa đơn', message: 'Bạn có 1 hóa đơn tẩy trắng răng chưa thanh toán số tiền 2,300,000đ.', isRead: false, createdAt: '2026-09-13 14:20' },
  { id: 'notif-3', userId: 'usr-admin', title: 'Lịch hẹn mới', message: 'Bệnh nhân Trần Hương Giang vừa đặt lịch hẹn khám tổng quát.', isRead: true, createdAt: '2026-09-14 15:30' }
];

// Helper Functions
const getStorage = (key, initial) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return initial;
  }
};

const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
};

export const storageService = {
  init() {
    getStorage(KEYS.USERS, DEFAULT_USERS);
    getStorage(KEYS.PATIENTS, DEFAULT_PATIENTS);
    getStorage(KEYS.DOCTORS, DEFAULT_DOCTORS);
    getStorage(KEYS.SERVICES, DEFAULT_SERVICES);
    getStorage(KEYS.APPOINTMENTS, DEFAULT_APPOINTMENTS);
    getStorage(KEYS.RECORDS, DEFAULT_RECORDS);
    getStorage(KEYS.TREATMENTS, DEFAULT_TREATMENTS);
    getStorage(KEYS.MEDICATIONS, DEFAULT_MEDICATIONS);
    getStorage(KEYS.INVOICES, DEFAULT_INVOICES);
    getStorage(KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    getStorage(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  },

  getCurrentUser() {
    return getStorage(KEYS.CURRENT_USER, null);
  },
  setCurrentUser(user) {
    setStorage(KEYS.CURRENT_USER, user);
  },

  // USERS
  getUsers() { return getStorage(KEYS.USERS, DEFAULT_USERS); },
  saveUsers(users) { setStorage(KEYS.USERS, users); },
  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: 'usr-' + Date.now(),
      status: user.status || 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.unshift(newUser);
    this.saveUsers(users);
    return newUser;
  },
  updateUser(id, updated) {
    const users = this.getUsers().map(u => u.id === id ? { ...u, ...updated } : u);
    this.saveUsers(users);
  },
  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);
  },

  // PATIENTS
  getPatients() { return getStorage(KEYS.PATIENTS, DEFAULT_PATIENTS); },
  savePatients(patients) { setStorage(KEYS.PATIENTS, patients); },
  addPatient(patient) {
    const list = this.getPatients();
    const newPat = {
      ...patient,
      id: 'pat-' + Date.now(),
      code: 'BN' + String(list.length + 1).padStart(3, '0'),
      status: patient.status || 'Hoạt động',
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newPat);
    this.savePatients(list);
    return newPat;
  },
  updatePatient(id, updated) {
    const list = this.getPatients().map(p => p.id === id ? { ...p, ...updated } : p);
    this.savePatients(list);
  },
  deletePatient(id) {
    const list = this.getPatients().filter(p => p.id !== id);
    this.savePatients(list);
  },

  // DOCTORS
  getDoctors() { return getStorage(KEYS.DOCTORS, DEFAULT_DOCTORS); },
  saveDoctors(doctors) { setStorage(KEYS.DOCTORS, doctors); },
  addDoctor(doc) {
    const list = this.getDoctors();
    const newDoc = {
      ...doc,
      id: 'doc-' + Date.now(),
      code: 'BS' + String(list.length + 1).padStart(3, '0'),
      status: doc.status || 'Hoạt động',
      avatar: doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'
    };
    list.unshift(newDoc);
    this.saveDoctors(list);
    return newDoc;
  },
  updateDoctor(id, updated) {
    const list = this.getDoctors().map(d => d.id === id ? { ...d, ...updated } : d);
    this.saveDoctors(list);
  },
  deleteDoctor(id) {
    const list = this.getDoctors().filter(d => d.id !== id);
    this.saveDoctors(list);
  },

  // SERVICES
  getServices() { return getStorage(KEYS.SERVICES, DEFAULT_SERVICES); },
  saveServices(services) { setStorage(KEYS.SERVICES, services); },
  addService(srv) {
    const list = this.getServices();
    const newSrv = {
      ...srv,
      id: 'srv-' + Date.now(),
      code: 'DV' + String(list.length + 1).padStart(3, '0'),
      status: srv.status || 'Hoạt động'
    };
    list.unshift(newSrv);
    this.saveServices(list);
    return newSrv;
  },
  updateService(id, updated) {
    const list = this.getServices().map(s => s.id === id ? { ...s, ...updated } : s);
    this.saveServices(list);
  },
  deleteService(id) {
    const list = this.getServices().filter(s => s.id !== id);
    this.saveServices(list);
  },

  // APPOINTMENTS
  getAppointments() { return getStorage(KEYS.APPOINTMENTS, DEFAULT_APPOINTMENTS); },
  saveAppointments(apts) { setStorage(KEYS.APPOINTMENTS, apts); },
  addAppointment(apt) {
    const list = this.getAppointments();
    const newApt = {
      ...apt,
      id: 'apt-' + Date.now(),
      code: 'LH' + String(list.length + 1).padStart(3, '0'),
      status: apt.status || 'PENDING'
    };
    list.unshift(newApt);
    this.saveAppointments(list);
    return newApt;
  },
  updateAppointment(id, updated) {
    const list = this.getAppointments().map(a => a.id === id ? { ...a, ...updated } : a);
    this.saveAppointments(list);
  },
  deleteAppointment(id) {
    const list = this.getAppointments().filter(a => a.id !== id);
    this.saveAppointments(list);
  },

  // MEDICAL RECORDS
  getRecords() { return getStorage(KEYS.RECORDS, DEFAULT_RECORDS); },
  saveRecords(recs) { setStorage(KEYS.RECORDS, recs); },
  addRecord(rec) {
    const list = this.getRecords();
    const newRec = {
      ...rec,
      id: 'rec-' + Date.now(),
      code: 'BA' + String(list.length + 1).padStart(3, '0')
    };
    list.unshift(newRec);
    this.saveRecords(list);
    return newRec;
  },
  updateRecord(id, updated) {
    const list = this.getRecords().map(r => r.id === id ? { ...r, ...updated } : r);
    this.saveRecords(list);
  },
  deleteRecord(id) {
    const list = this.getRecords().filter(r => r.id !== id);
    this.saveRecords(list);
  },

  // TREATMENTS
  getTreatments() { return getStorage(KEYS.TREATMENTS, DEFAULT_TREATMENTS); },
  saveTreatments(trms) { setStorage(KEYS.TREATMENTS, trms); },
  addTreatment(trm) {
    const list = this.getTreatments();
    const newTrm = {
      ...trm,
      id: 'trm-' + Date.now()
    };
    list.unshift(newTrm);
    this.saveTreatments(list);
    return newTrm;
  },
  updateTreatment(id, updated) {
    const list = this.getTreatments().map(t => t.id === id ? { ...t, ...updated } : t);
    this.saveTreatments(list);
  },
  deleteTreatment(id) {
    const list = this.getTreatments().filter(t => t.id !== id);
    this.saveTreatments(list);
  },

  // MEDICATIONS
  getMedications() { return getStorage(KEYS.MEDICATIONS, DEFAULT_MEDICATIONS); },
  saveMedications(meds) { setStorage(KEYS.MEDICATIONS, meds); },
  addMedication(med) {
    const list = this.getMedications();
    const newMed = {
      ...med,
      id: 'med-' + Date.now(),
      status: med.status || 'Bình thường'
    };
    list.unshift(newMed);
    this.saveMedications(list);
    return newMed;
  },
  updateMedication(id, updated) {
    const list = this.getMedications().map(m => m.id === id ? { ...m, ...updated } : m);
    this.saveMedications(list);
  },
  deleteMedication(id) {
    const list = this.getMedications().filter(m => m.id !== id);
    this.saveMedications(list);
  },

  // INVOICES
  getInvoices() { return getStorage(KEYS.INVOICES, DEFAULT_INVOICES); },
  saveInvoices(invs) { setStorage(KEYS.INVOICES, invs); },
  addInvoice(inv) {
    const list = this.getInvoices();
    const newInv = {
      ...inv,
      id: 'inv-' + Date.now(),
      code: 'HD' + String(list.length + 1).padStart(3, '0')
    };
    list.unshift(newInv);
    this.saveInvoices(list);
    return newInv;
  },
  updateInvoice(id, updated) {
    const list = this.getInvoices().map(i => i.id === id ? { ...i, ...updated } : i);
    this.saveInvoices(list);
  },
  deleteInvoice(id) {
    const list = this.getInvoices().filter(i => i.id !== id);
    this.saveInvoices(list);
  },

  // PAYMENTS
  getPayments() { return getStorage(KEYS.PAYMENTS, DEFAULT_PAYMENTS); },
  savePayments(pays) { setStorage(KEYS.PAYMENTS, pays); },
  addPayment(pay) {
    const list = this.getPayments();
    const newPay = {
      ...pay,
      id: 'pay-' + Date.now(),
      code: 'TT' + String(list.length + 1).padStart(3, '0'),
      paymentDate: new Date().toLocaleString('vi-VN')
    };
    list.unshift(newPay);
    this.savePayments(list);

    // Update invoice paid amount
    if (pay.invoiceId) {
      const invs = this.getInvoices();
      const inv = invs.find(i => i.id === pay.invoiceId || i.code === pay.invoiceId);
      if (inv) {
        const newPaid = (inv.paidAmount || 0) + Number(pay.amount);
        const status = newPaid >= inv.total ? 'Đã thanh toán' : 'Thanh toán một phần';
        this.updateInvoice(inv.id, { paidAmount: newPaid, status });
      }
    }
    return newPay;
  },
  updatePayment(id, updated) {
    const list = this.getPayments().map(p => p.id === id ? { ...p, ...updated } : p);
    this.savePayments(list);
  },
  deletePayment(id) {
    const list = this.getPayments().filter(p => p.id !== id);
    this.savePayments(list);
  },

  // NOTIFICATIONS
  getNotifications() { return getStorage(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS); },
  saveNotifications(notifs) { setStorage(KEYS.NOTIFICATIONS, notifs); },
  addNotification(notif) {
    const list = this.getNotifications();
    const newNotif = {
      ...notif,
      id: 'notif-' + Date.now(),
      isRead: false,
      createdAt: new Date().toLocaleString('vi-VN')
    };
    list.unshift(newNotif);
    this.saveNotifications(list);
    return newNotif;
  },
  markNotificationRead(id) {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
    this.saveNotifications(list);
  },
  markAllNotificationsRead(userId) {
    const list = this.getNotifications().map(n => (!userId || n.userId === userId) ? { ...n, isRead: true } : n);
    this.saveNotifications(list);
  }
};

// Auto-run init
storageService.init();
