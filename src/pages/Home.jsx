import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, BarChart3, Shield, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { 
    title: 'AI Symptom Checker', 
    desc: 'Describe your symptoms naturally and receive data-backed, intelligent health guidance in seconds.', 
    icon: <Activity size={24} />,
    color: 'var(--primary)',
    bg: 'var(--primary-soft)',
    link: '/symptoms'
  },
  { 
    title: 'Doctor Finder', 
    desc: 'Find highly rated specialists near you, compare experience and ratings, and book appointments seamlessly.', 
    icon: <Users size={24} />,
    color: 'var(--secondary)',
    bg: 'var(--secondary-soft)',
    link: '/doctors'
  },
  { 
    title: 'Health Dashboard', 
    desc: 'Track your health over time with automated charts, activity logs, and smart insights — all in one place.', 
    icon: <BarChart3 size={24} />,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    link: '/dashboard'
  }
];

const testimonials = [
  { name: 'Ananya R.', role: 'Student, Delhi University', text: 'Omnicura helped me understand my symptoms at 2 AM when no clinic was open. The AI was incredibly accurate and reassuring.', rating: 5 },
  { name: 'Vikram S.', role: 'Software Engineer, Bangalore', text: 'The doctor finder saved me hours of searching. Found a great cardiologist nearby and booked in under a minute.', rating: 5 },
  { name: 'Priya M.', role: 'Teacher, Mumbai', text: 'I love the health dashboard. Tracking my vitals and seeing trends over time keeps me motivated to stay healthy.', rating: 4 },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '1200+', label: 'Verified Doctors' },
  { value: '24/7', label: 'AI Availability' },
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--primary-soft) 0%, #ffffff 60%)', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', overflow: 'hidden', paddingTop: '40px' }}>
        <div className="container grid grid-2" style={{ alignItems: 'center', minHeight: '520px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1.5px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-soft)', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px' }}>
              <Shield size={14} /> AI-Powered Healthcare
            </span>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', marginTop: '16px', marginBottom: '24px', lineHeight: 1.1 }}>
              Your AI Health<br />Companion.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px', maxWidth: '480px', lineHeight: 1.7 }}>
              Omnicura uses advanced AI to help you understand symptoms, find professional care, and manage your health journey — all from one beautiful platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/symptoms">
                <button className="btn-primary" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '16px 32px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Start Checking Symptoms <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/doctors">
                <button className="btn-secondary" style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '16px 32px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '16px' }}>
                  Find Doctors
                </button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hero-image"
          >
            <img 
              src="/hero.png" 
              alt="AI Healthcare Illustration" 
              style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }} 
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', background: 'white', borderRadius: 'var(--radius-lg)', padding: '40px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{s.value}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Intelligent Health for Everyone.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginTop: '12px', maxWidth: '500px', marginInline: 'auto' }}>Designed for simplicity, built with trust. Three powerful tools to transform your health journey.</p>
          </div>
          <div className="grid grid-3">
            {features.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to={f.link} style={{ display: 'block' }}>
                  <div className="feature-card" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', background: 'white', border: '1px solid var(--border)' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: f.bg, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                      {f.icon}
                    </div>
                    <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>{f.title}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                    <div style={{ marginTop: '20px', color: f.color, fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Trusted by Thousands</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginTop: '12px' }}>Real stories from real users across India.</p>
          </div>
          <div className="grid grid-3">
            {testimonials.map((t, i) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--bg-main)' }}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '20px', fontSize: '15px' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-xl)', margin: '0 24px 40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <CheckCircle size={48} style={{ marginBottom: '24px', opacity: 0.8 }} />
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'white', marginBottom: '16px' }}>Your Health Deserves Intelligence.</h2>
            <p style={{ fontSize: '18px', opacity: 0.85, maxWidth: '500px', marginInline: 'auto', marginBottom: '40px' }}>
              Join thousands of users who trust Omnicura for smarter, faster, and more accessible healthcare.
            </p>
            <Link to="/symptoms">
              <button style={{ background: 'white', color: 'var(--primary)', padding: '18px 40px', borderRadius: '100px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'transform 0.3s' }}>
                Get Started — It's Free
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
