import React, { useState } from 'react';
import { Search, Info, AlertTriangle, Pill, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const medicineDatabase = {
  'paracetamol': {
    name: 'Paracetamol',
    tag: 'Analgesic & Antipyretic',
    uses: ['Relief of mild to moderate pain', 'Reduction of fever', 'Headaches and toothaches'],
    sideEffects: ['Nausea', 'Allergic reactions (rare)', 'Liver damage (if overdosed)'],
    dosage: '500mg to 1000mg every 4-6 hours. Do not exceed 4000mg in 24 hours.',
    precautions: 'Avoid with alcohol. Consult doctor if you have liver disease.'
  },
  'ibuprofen': {
    name: 'Ibuprofen',
    tag: 'NSAID',
    uses: ['Reducing inflammation', 'Relief of menstrual pain', 'Arthritis pain relief'],
    sideEffects: ['Stomach upset', 'Dizziness', 'Heartburn'],
    dosage: '200mg to 400mg every 4-6 hours. Max 1200mg/day for over-the-counter use.',
    precautions: 'Take with food or milk. Avoid if you have stomach ulcers.'
  },
  'amoxicillin': {
    name: 'Amoxicillin',
    tag: 'Antibiotic',
    uses: ['Bacterial infections', 'Chest infections', 'Ear & dental infections'],
    sideEffects: ['Diarrhea', 'Rash', 'Feeling sick'],
    dosage: '250mg to 500mg three times a day, as prescribed by your doctor.',
    precautions: 'Complete the entire course. Do not use for viral infections (like cold/flu).'
  }
};

const MedicineInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.toLowerCase().trim();
    if (medicineDatabase[query]) {
      setResult(medicineDatabase[query]);
    } else {
      setResult('not_found');
    }
  };

  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px' }}>Medicine Information Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Learn about uses, side effects, and safe dosage of common medications.</p>
      </div>

      <div className="medicine-search-container">
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <div className="chat-input-area" style={{ borderRadius: 'var(--radius-md)', padding: '6px' }}>
            <Search size={20} color="var(--text-muted)" style={{ marginLeft: '12px' }} />
            <input 
              type="text" 
              className="chat-input" 
              style={{ border: 'none' }}
              placeholder="Search medicine (e.g. Paracetamol, Ibuprofen...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 24px', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'white' }}>
              Lookup
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {result === 'not_found' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}
            >
              Medicine not found. Try searching for Paracetamol, Ibuprofen, or Amoxicillin.
            </motion.div>
          )}

          {result && result !== 'not_found' && (
            <motion.div 
              key={result.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="med-card"
            >
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Pill size={32} />
                </div>
                <div>
                  <span className="med-tag">{result.tag}</span>
                  <h2 style={{ fontSize: '32px', marginBottom: '4px' }}>{result.name}</h2>
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} color="var(--secondary)" /> Verified Medical Info
                  </p>
                </div>
              </div>

              <div className="grid grid-2" style={{ marginTop: '32px' }}>
                <div className="med-section">
                  <div className="med-section-title"><Info size={16} color="var(--primary)" /> Common Uses</div>
                  <ul className="med-list">
                    {result.uses.map(u => <li key={u}><ChevronRight size={14} /> {u}</li>)}
                  </ul>
                </div>
                <div className="med-section">
                  <div className="med-section-title" style={{ color: 'var(--emergency)' }}><AlertTriangle size={16} /> Side Effects</div>
                  <ul className="med-list">
                    {result.sideEffects.map(s => <li key={s}><ChevronRight size={14} /> {s}</li>)}
                  </ul>
                </div>
              </div>

              <div className="med-section" style={{ background: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div className="med-section-title">Dosage Guidance</div>
                <p style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: 500 }}>{result.dosage}</p>
              </div>

              <div className="med-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <div className="med-section-title" style={{ color: '#d97706' }}>Precautions</div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{result.precautions}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicineInfo;
