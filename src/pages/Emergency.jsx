import React from 'react';
import { Phone, MapPin, AlertCircle, ShieldAlert, Heart, Bell, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const hospitals = [
  { name: 'Apollo Hospitals', dist: '1.2 km', time: '5 mins', phone: '1066' },
  { name: 'Max Super Speciality', dist: '2.8 km', time: '12 mins', phone: '011-26515050' },
  { name: 'Fortis Memorial', dist: '4.5 km', time: '18 mins', phone: '0124-4921021' },
];

const firstAid = [
  { title: 'Severe Bleeding', step: 'Apply direct pressure to the wound with a clean cloth. Keep pressure constant until help arrives.' },
  { title: 'Choking', step: 'Perform abdominal thrusts (Heimlich maneuver) if the person cannot breathe or talk.' },
  { title: 'Cardiac Arrest', step: 'Call emergency services and start Hands-Only CPR. Push hard and fast in the center of the chest.' },
];

const Emergency = () => {
  return (
    <div className="emergency-page" style={{ background: '#fff' }}>
      <section className="emergency-hero">
        <div className="container">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShieldAlert size={80} style={{ marginBottom: '24px' }} />
            <h1 style={{ fontSize: '48px', fontWeight: 900 }}>EMERGENCY MODE</h1>
            <p style={{ fontSize: '20px', opacity: 0.9 }}>Immediate assistance, at your fingertips.</p>
            
            <button className="btn-emergency-huge">
               <Phone size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} /> Call Ambulance (108)
            </button>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <MapPin color="var(--emergency)" /> Nearby Hospitals
              </h2>
              {hospitals.map(h => (
                <div key={h.name} className="first-aid-item" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '18px' }}>{h.name}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{h.dist} • {h.time} away</p>
                  </div>
                  <button style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                    Navigate
                  </button>
                </div>
              ))}
            </div>

            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <Heart color="var(--emergency)" /> Instant First Aid
              </h2>
              {firstAid.map(fa => (
                <div key={fa.title} className="first-aid-item">
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--emergency)' }}>{fa.title}</h4>
                    <p style={{ fontSize: '15px' }}>{fa.step}</p>
                  </div>
                  <ArrowRight size={20} color="var(--border)" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '60px' }}>
             <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Other Emergency Contacts</h2>
             <div className="grid grid-3">
               {[
                 { label: 'Police', num: '100', icon: <Bell /> },
                 { label: 'Fire Service', num: '101', icon: <AlertCircle /> },
                 { label: 'Women Helpline', num: '1091', icon: <Phone /> }
               ].map(c => (
                 <div key={c.label} className="emergency-contact-card">
                   <div style={{ color: 'var(--emergency)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                     {c.icon}
                   </div>
                   <h3 style={{ fontSize: '32px' }}>{c.num}</h3>
                   <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{c.label}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Emergency;
