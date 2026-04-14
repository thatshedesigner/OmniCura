import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Filter, Phone, CheckCircle } from 'lucide-react';

const doctorsData = [
  { id: 1, name: 'Dr. Sarah Kapur', specialty: 'General Physician', location: 'Greater Kailash, Delhi', rating: 4.8, reviews: 120, experience: '12 years', available: 'Today' },
  { id: 2, name: 'Dr. Rajesh Khanna', specialty: 'Cardiologist', location: 'Indiranagar, Bangalore', rating: 4.9, reviews: 350, experience: '18 years', available: 'Tomorrow' },
  { id: 3, name: 'Dr. Priya Sharma', specialty: 'Dermatologist', location: 'Juhu, Mumbai', rating: 4.7, reviews: 85, experience: '8 years', available: 'In 2 days' },
  { id: 4, name: 'Dr. Amit Varma', specialty: 'Neurologist', location: 'Gachibowli, Hyderabad', rating: 4.6, reviews: 150, experience: '15 years', available: 'Today' },
  { id: 5, name: 'Dr. Neha Gupta', specialty: 'Pediatrician', location: 'Sector 62, Noida', rating: 4.9, reviews: 200, experience: '10 years', available: 'Tomorrow' },
  { id: 6, name: 'Dr. Vikram Malhotra', specialty: 'Orthopedic', location: 'Salt Lake, Kolkata', rating: 4.5, reviews: 110, experience: '14 years', available: 'Today' },
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const filteredDoctors = doctorsData.filter(doc => 
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())) &&
    doc.location.toLowerCase().includes(locationTerm.toLowerCase())
  );

  return (
    <div className="container section">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px' }}>Find the Right Care, Right Now</h1>
        <p style={{ color: 'var(--text-muted)' }}>Search from our network of verified healthcare professionals.</p>
      </div>

      <div className="doctor-search-bar">
        <div className="search-input-group">
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Specialty or Doctor Name" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-input-group">
          <MapPin size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Location (e.g. Delhi)" 
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" style={{ padding: '0 24px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: 'white', fontWeight: 600 }}>
          Search
        </button>
      </div>

      <div className="grid grid-3">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <div className="doctor-image">
              <CheckCircle size={40} style={{ opacity: 0.2 }} />
            </div>
            <div className="doctor-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>{doc.name}</h4>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '13px' }}>{doc.specialty}</p>
                </div>
                <div className="rating-badge">
                  <Star size={14} fill="#f59e0b" /> {doc.rating}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> {doc.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <Clock size={14} /> {doc.experience} Experience
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600 }}>Available {doc.available}</span>
                <button className="btn-book">Book Slot</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDoctors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <p>No doctors found matching your criteria. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;
