import React from 'react';
import { Shield, Globe, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="section" style={{ backgroundColor: 'white', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: '60px' }}>
          <div>
            <div className="logo" style={{ marginBottom: '20px' }}>
              <Shield size={24} />
              <span>Omnicura</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Your intelligent AI health companion providing trustworthy guidance and accessible care for all.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <li>Home</li>
              <li>Symptom Checker</li>
              <li>Doctor Finder</li>
              <li>Emergency Care</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '20px' }}>Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Disclaimer</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '20px' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
              <Globe size={20} />
              <ExternalLink size={20} />
              <Heart size={20} />
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          <p>© 2026 Omnicura AI Healthcare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
