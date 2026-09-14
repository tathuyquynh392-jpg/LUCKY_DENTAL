import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', message: 'Lucky Dental Backend API Service running smoothly' });
});

// Authentication Mock / DB router placeholder
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if ((username === 'admin' || username === 'admin@luckydental.com') && password === 'admin123') {
    return res.json({
      token: 'jwt-mock-token-admin',
      user: { id: 'usr-admin', name: 'Quản Trị Viên', role: 'ADMIN', email: 'admin@luckydental.com' }
    });
  }
  if ((username === 'patient' || username === 'patient@luckydental.com') && password === 'patient123') {
    return res.json({
      token: 'jwt-mock-token-patient',
      user: { id: 'usr-pat1', name: 'Trần Thị Bệnh Nhân', role: 'PATIENT', email: 'patient@luckydental.com' }
    });
  }
  return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ nội bộ!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server Lucky Dental Backend running on port ${PORT}`);
});
