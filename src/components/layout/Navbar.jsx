import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Shield, Users, LayoutDashboard, HeartPulse, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: HeartPulse },
    { name: 'Symptom Checker', path: '/symptoms', icon: Activity },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', path: '/doctors', icon: Users },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <NavLink to="/" className="logo">
            <Shield size={28} strokeWidth={2.5} />
            <span>Omnicura</span>
          </NavLink>

          <div className="nav-links">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink to="/emergency" className="btn-emergency-nav">
              Emergency
            </NavLink>
          </div>

          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu (Stub) */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay glass">
          <div className="mobile-links">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path} 
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink 
              to="/emergency" 
              className="mobile-link emergency"
              onClick={() => setIsMenuOpen(false)}
            >
              Emergency Mode
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
