import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { PatientLayout } from './layouts/PatientLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PatientManagement } from './pages/admin/PatientManagement';
import { PatientDetail } from './pages/admin/PatientDetail';
import { DoctorManagement } from './pages/admin/DoctorManagement';
import { ServiceManagement } from './pages/admin/ServiceManagement';
import { AppointmentManagement } from './pages/admin/AppointmentManagement';
import { CalendarView } from './pages/admin/CalendarView';
import { MedicalRecordManagement } from './pages/admin/MedicalRecordManagement';
import { TreatmentManagement } from './pages/admin/TreatmentManagement';
import { MedicationManagement } from './pages/admin/MedicationManagement';
import { InvoiceManagement } from './pages/admin/InvoiceManagement';
import { PaymentManagement } from './pages/admin/PaymentManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { NotificationManagement } from './pages/admin/NotificationManagement';
import { Reports } from './pages/admin/Reports';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientProfile } from './pages/patient/PatientProfile';
import { BookAppointment } from './pages/patient/BookAppointment';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientMedicalRecords } from './pages/patient/PatientMedicalRecords';
import { PatientTreatments } from './pages/patient/PatientTreatments';
import { PatientInvoices } from './pages/patient/PatientInvoices';
import { PatientNotifications } from './pages/patient/PatientNotifications';

export default function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <BrowserRouter basename={baseUrl}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<PatientManagement />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="doctors" element={<DoctorManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="medical-records" element={<MedicalRecordManagement />} />
            <Route path="treatments" element={<TreatmentManagement />} />
            <Route path="medications" element={<MedicationManagement />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Patient Protected Routes */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="appointments/create" element={<BookAppointment />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="medical-records" element={<PatientMedicalRecords />} />
            <Route path="treatments" element={<PatientTreatments />} />
            <Route path="invoices" element={<PatientInvoices />} />
            <Route path="notifications" element={<PatientNotifications />} />
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
