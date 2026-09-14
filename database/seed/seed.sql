-- LUCKY DENTAL SYSTEM - MySQL Seed Initial Data
USE `lucky_dental`;

-- Users (Pass: admin123 / patient123)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `status`) VALUES
(1, 'Quản Trị Viên Hợp', 'admin@luckydental.com', '0901234567', '$2b$10$w8T0M4j6lS/8K9j5y2F0s.GgK1y4b7Y3w2z1a0b9c8d7e6f5g4h3', 'ADMIN', 'ACTIVE'),
(2, 'Trần Thị Bệnh Nhân', 'patient@luckydental.com', '0988776655', '$2b$10$w8T0M4j6lS/8K9j5y2F0s.GgK1y4b7Y3w2z1a0b9c8d7e6f5g4h3', 'PATIENT', 'ACTIVE');

-- Patients
INSERT INTO `patients` (`id`, `user_id`, `date_of_birth`, `gender`, `address`, `medical_history`, `allergy`, `notes`) VALUES
(1, 2, '1994-05-12', 'Nữ', '123 Nguyễn Trãi, Q.5, TP.HCM', 'Dị ứng Penicillin', 'Penicillin', 'Bệnh nhân nhạy cảm đau');

-- Doctors
INSERT INTO `doctors` (`id`, `name`, `email`, `phone`, `specialty`, `qualification`, `experience`, `working_days`, `working_hours`, `status`) VALUES
(1, 'BS. CKII. Trần Minh Tuấn', 'tuan.tran@luckydental.com', '0912345678', 'Nha Khoa Thẩm Mỹ & Niềng Răng', 'BSCKII Y Dược TP.HCM', '12 năm', 'Thứ 2 - Thứ 6', '08:00 - 17:00', 'Hoạt động'),
(2, 'BS. CKI. Nguyễn Thị Hồng', 'hong.nguyen@luckydental.com', '0922334455', 'Răng Hàm Mặt & Implant', 'BSCKI Răng Hàm Mặt', '9 năm', 'Thứ 3 - Chủ Nhật', '08:30 - 18:00', 'Hoạt động');

-- Services
INSERT INTO `services` (`id`, `name`, `description`, `price`, `duration`, `status`) VALUES
(1, 'Khám Tổng Quát & Tư Vấn', 'Khám kiểm tra toàn bộ khoang miệng, chụp X-quang chẩn đoán.', 150000.00, '20 phút', 'Hoạt động'),
(2, 'Lấy Cao Răng & Đánh Bóng', 'Làm sạch cao răng bằng sóng siêu âm không đau, đánh bóng mịn răng.', 300000.00, '30 phút', 'Hoạt động'),
(3, 'Trám Răng Composite Thẩm Mỹ', 'Trám lỗ sâu răng bằng vật liệu Composite chịu lực màu tự nhiên.', 400000.00, '45 phút', 'Hoạt động'),
(4, 'Tẩy Trắng Răng Laser Whitening', 'Tẩy trắng răng bằng ánh sáng Laser công nghệ Đức bật 2-4 tông.', 2500000.00, '60 phút', 'Hoạt động');

-- Appointments
INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `service_id`, `appointment_date`, `appointment_time`, `notes`, `status`) VALUES
(1, 1, 1, 2, '2026-09-16', '09:30:00', 'Hẹn khám đúng giờ', 'CONFIRMED');

-- Notifications
INSERT INTO `notifications` (`user_id`, `title`, `message`, `is_read`) VALUES
(2, 'Xác nhận lịch hẹn', 'Lịch hẹn Lấy Cao Răng của bạn vào lúc 09:30 ngày 16/09/2026 đã được xác nhận.', FALSE);
