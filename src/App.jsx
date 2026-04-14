import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SymptomChecker from './pages/SymptomChecker';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import MedicineInfo from './pages/MedicineInfo';
import Emergency from './pages/Emergency';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/symptoms" element={<SymptomChecker />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/medicine" element={<MedicineInfo />} />
          <Route path="/emergency" element={<Emergency />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
