import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Award, ShieldCheck, Clock, Phone, Mail, MapPin, ArrowRight, CheckCircle2, Star, UserCheck } from 'lucide-react';
import { storageService } from '../services/storage';

export const LandingPage = () => {
  const services = storageService.getServices();
  const doctors = storageService.getDoctors();
  const clinicSettings = storageService.getClinicSettings() || {};

  const scrollToSection = (e, sectionId) => {
    e?.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Header / Topbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {clinicSettings.logo ? (
              <img
                src={clinicSettings.logo}
                alt="Clinic Logo"
                style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '10px' }}
              />
            ) : (
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
            )}
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {clinicSettings.shortName || 'LUCKY DENTAL'}
              </h1>
              <p style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 700, marginTop: '-2px' }}>
                {clinicSettings.slogan || 'Chăm sóc nụ cười – Kiến tạo tự tin'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} style={{ color: '#334155', textDecoration: 'none', cursor: 'pointer' }}>Giới thiệu</a>
            <a href="#services" onClick={(e) => scrollToSection(e, 'services')} style={{ color: '#334155', textDecoration: 'none', cursor: 'pointer' }}>Dịch vụ</a>
            <a href="#doctors" onClick={(e) => scrollToSection(e, 'doctors')} style={{ color: '#334155', textDecoration: 'none', cursor: 'pointer' }}>Đội ngũ bác sĩ</a>
            <a href="#process" onClick={(e) => scrollToSection(e, 'process')} style={{ color: '#334155', textDecoration: 'none', cursor: 'pointer' }}>Quy trình</a>
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

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 50%, #0369a1 100%)',
        color: 'white',
        padding: '5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
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
              <Star size={16} fill="#7dd3fc" /> Phòng Khám Nha Khoa Tiêu Chuẩn Quốc Tế
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: 'white' }}>
              Chăm sóc nụ cười – <br />
              <span style={{ color: '#38bdf8' }}>Kiến tạo tự tin</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2rem', lineHeight: 1.6 }}>
              Hệ thống phòng khám Nha Khoa Lucky Dental áp dụng công nghệ chẩn đoán hiện đại, trang thiết bị tiên tiến cùng đội ngũ thạc sĩ, bác sĩ hơn 10 năm kinh nghiệm.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                <Calendar size={20} /> Đặt lịch khám ngay
              </Link>
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="btn btn-secondary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                Tìm hiểu thêm <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
              ✨ Đặt Lịch Hẹn Nhanh Chóng
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Đăng nhập tài khoản Bệnh Nhân để chọn bác sĩ, dịch vụ và thời gian khám phù hợp chỉ trong 30 giây!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} style={{ color: '#38bdf8' }} /> Không chờ đợi tại phòng khám
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} style={{ color: '#38bdf8' }} /> Miễn phí khám và chụp X-quang lần đầu
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} style={{ color: '#38bdf8' }} /> Nhận nhắc lịch qua SMS/Notification
              </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/login" className="btn btn-success" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}>
                Đăng Nhập Ngay (Tài Khoản Demo)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '5rem 1.5rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Về Chúng Tôi - Lucky Dental
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
              Tiên phong mang đến giải pháp điều trị và chăm sóc răng miệng toàn diện, êm ái và đạt chuẩn thẩm mỹ cao nhất.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Award size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Công Nghệ Hiện Đại</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Hệ thống X-quang 3D ConeBeam, máy phẫu thuật siêu âm Piezotome và tẩy trắng Laser Whitening tân tiến.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <UserCheck size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chuyên Gia Đầu Ngành</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Đội ngũ thạc sĩ, Bác sĩ CKII tốt nghiệp trường Y hàng đầu, tu nghiệp chuyên sâu tại Pháp, Đức, Hàn Quốc.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShieldCheck size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Vô Trùng Chuyện Nghiệp</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Quy trình vô trùng khép kín theo tiêu chuẩn Bộ Y Tế, mỗi bệnh nhân dùng 1 bộ dụng cụ riêng biệt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Catalog */}
      <section id="services" style={{ padding: '5rem 1.5rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Dịch Vụ Nha Khoa Nổi Bật
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Bảng giá công khai minh bạch, chất lượng dịch vụ chuẩn 5 sao.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map((s) => (
              <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-info">{s.code}</span>
                    <span style={{ fontWeight: 800, color: '#0284c7', fontSize: '1.1rem' }}>
                      {Number(s.price).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
                    {s.name}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {s.description}
                  </p>
                </div>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> {s.duration}
                  </span>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    Đặt lịch ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" style={{ padding: '5rem 1.5rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Đội Ngũ Bác Sĩ Chuyên Khoa
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Tận tâm, tận lực vì nụ cười hoàn hảo của bạn.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {doctors.map((d) => (
              <div key={d.id} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <img
                  src={d.avatar}
                  alt={d.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1.25rem',
                    border: '4px solid #e0f2fe'
                  }}
                />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {d.name}
                </h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0ea5e9', marginBottom: '0.5rem' }}>
                  {d.specialty}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                  {d.qualification} • {d.experience}
                </p>
                <span className="badge badge-success">{d.workingDays}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" style={{ padding: '5rem 1.5rem', backgroundColor: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
              Quy Trình Khám Điều Trị 5 Bước
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Chuyên nghiệp, nhanh chóng và chuẩn xác.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '1', title: 'Đặt lịch hẹn', desc: 'Đăng ký thời gian & dịch vụ trực tuyến.' },
              { step: '2', title: 'Khám & Chụp chiếu', desc: 'Bác sĩ kiểm tra trực tiếp & chụp X-quang.' },
              { step: '3', title: 'Tư vấn phác đồ', desc: 'Lập kế hoạch điều trị chi tiết & báo giá.' },
              { step: '4', title: 'Thực hiện điều trị', desc: 'Điều trị nhẹ nhàng, êm ái, chuẩn vô trùng.' },
              { step: '5', title: 'Theo dõi & Tái khám', desc: 'Chăm sóc hậu phẫu & hẹn lịch kiểm tra.' }
            ].map((p) => (
              <div key={p.step} style={{
                background: '#1e293b',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #334155',
                position: 'relative'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  {p.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#090d16', color: '#94a3b8', padding: '4rem 1.5rem 2rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              {clinicSettings.logo ? (
                <img src={clinicSettings.logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              ) : (
                <Sparkles size={24} style={{ color: '#0ea5e9' }} />
              )}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                {clinicSettings.shortName || clinicSettings.name || 'LUCKY DENTAL'}
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {clinicSettings.description || 'Hệ Thống Quản Lý Nha Khoa Chuyên Nghiệp - Uy tín & Chất lượng số 1 Việt Nam.'}
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Liên Hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                <span>{clinicSettings.address || '123 Nguyễn Trãi, Q.5, TP.HCM'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                <span>Hotline: {clinicSettings.phone || '1900 6868 - 0901234567'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                <span>{clinicSettings.email || 'contact@luckydental.com'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                <span>Giờ làm việc: {clinicSettings.openingHours || '08:00 - 20:00 (Hàng ngày)'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Tài Khoản Demo</h4>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '10px', fontSize: '0.825rem' }}>
              <p style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.25rem' }}>Admin:</p>
              <p>Email: admin@luckydental.com / Pass: admin123</p>
              <p style={{ color: '#34d399', fontWeight: 700, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Patient:</p>
              <p>Email: patient@luckydental.com / Pass: patient123</p>
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
