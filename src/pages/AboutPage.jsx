import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, UserCheck, ShieldCheck, ArrowLeft, Phone, Mail, MapPin, Clock, HeartPulse, Building2, Target, Users, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Header / Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                LUCKY DENTAL
              </h1>
              <p style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 700, marginTop: '-2px' }}>
                Giới Thiệu Hệ Thống
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <Link to="/" style={{ color: '#334155', textDecoration: 'none' }}>Trang chủ</Link>
            <Link to="/about" style={{ color: '#0ea5e9', fontWeight: 700, textDecoration: 'none' }}>Giới thiệu</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 50%, #0369a1 100%)',
        color: 'white',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#7dd3fc',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <HeartPulse size={16} /> VỀ CHÚNG TÔI - LUCKY DENTAL
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
            Kiến Tạo Nụ Cười Rạng Rỡ & Tự Tin Cho Mọi Gia Đình
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#93c5fd', lineHeight: 1.6, maxWidth: '750px', margin: '0 auto' }}>
            LUCKY DENTAL tự hào là hệ thống nha khoa uy tín hàng đầu, tiên phong trong công nghệ điều trị hiện đại, tiêu chuẩn vô trùng nghiêm ngặt và dịch vụ tận tâm.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Core Pillars */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Giá Trị Cốt Lõi Vượt Trội
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
            Chúng tôi không ngừng nâng cao chất lượng chuyên môn và trải nghiệm của từng khách hàng.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Award size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>
              Công Nghệ Hiện Đại
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Trang bị máy chụp X-quang 3D ConeBeam CT, công nghệ nhổ răng siêu âm Piezotome, máy tẩy trắng Laser Whitening tân tiến và phần mềm lập phác đồ điều trị 3D.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <UserCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>
              Đội Ngũ Bác Sĩ Chuyên Khoa
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              100% thạc sĩ, bác sĩ tốt nghiệp các đại học y dược uy tín hàng đầu Việt Nam, thường xuyên tu nghiệp tại Pháp, Đức, Hàn Quốc với hơn 15 năm kinh nghiệm.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>
              Chuẩn Vô Trùng Tuyệt Đối
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Áp dụng quy trình vô trùng khép kín 1 chiều theo tiêu chuẩn Bộ Y Tế. Mỗi bệnh nhân sử dụng 1 phòng điều trị riêng và 1 bộ dụng cụ y tế tiệt trùng riêng biệt.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '4rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#0284c7' }}>
              <Target size={28} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Tầm Nhìn & Sứ Mệnh</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              <strong>Tầm nhìn:</strong> Trở thành thương hiệu nha khoa thẩm mỹ & điều trị dẫn đầu Việt Nam về chất lượng kỹ thuật, tính an toàn và mức độ hài lòng của khách hàng.
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7 }}>
              <strong>Sứ mệnh:</strong> Mang lại dịch vụ chăm sóc răng miệng cao cấp với chi phí hợp lý, giúp mọi khách hàng sở hữu nụ cười khỏe mạnh, rạng rỡ và tự tin.
            </p>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Cam Kết Dịch Vụ Tại Lucky Dental:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#334155', fontSize: '0.925rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ color: '#0ea5e9' }} /> Báo giá minh bạch, không phát sinh chi phí
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#334155', fontSize: '0.925rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ color: '#0ea5e9' }} /> Thẻ bảo hành chính hãng dịch vụ niềng & sứ
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#334155', fontSize: '0.925rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ color: '#0ea5e9' }} /> Đặt lịch nhanh chóng, không phải chờ đợi
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#334155', fontSize: '0.925rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ color: '#0ea5e9' }} /> Chăm sóc, hỗ trợ khách hàng 24/7
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Sẵn Sàng Trải Nghiệm Dịch Vụ Nha Khoa Chất Lượng Cao?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '1.75rem' }}>
            Đăng nhập hệ thống quản lý hoặc đăng ký tài khoản để theo dõi hồ sơ bệnh án và lịch hẹn trực tuyến.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700 }}>
              Đăng Nhập Ngay
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700 }}>
              Đăng Ký Tài Khoản
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#090d16', color: '#94a3b8', padding: '3rem 1.5rem 2rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Sparkles size={24} style={{ color: '#0ea5e9' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>LUCKY DENTAL</h3>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Hệ Thống Quản Lý Nha Khoa Chuyên Nghiệp - Uy tín & Chất lượng hàng đầu.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Liên Hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} style={{ color: '#0ea5e9' }} /> 123 Nguyễn Trãi, Q.5, TP.HCM</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} style={{ color: '#0ea5e9' }} /> Hotline: 1900 6868 - 0901234567</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} style={{ color: '#0ea5e9' }} /> contact@luckydental.com</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} style={{ color: '#0ea5e9' }} /> Giờ làm việc: 08:00 - 20:00 (Hàng ngày)</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          © 2026 LUCKY DENTAL SYSTEM. All rights reserved. Built for GitHub Pages.
        </div>
      </footer>
    </div>
  );
};
