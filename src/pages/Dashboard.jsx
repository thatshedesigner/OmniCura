import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  History, Calendar, FileText, ArrowRight, Activity, TrendingUp, Heart, Droplet 
} from 'lucide-react';

const data = [
  { name: 'Mon', steps: 4000, pulse: 72 },
  { name: 'Tue', steps: 3000, pulse: 68 },
  { name: 'Wed', steps: 2000, pulse: 75 },
  { name: 'Thu', steps: 2780, pulse: 80 },
  { name: 'Fri', steps: 1890, pulse: 72 },
  { name: 'Sat', steps: 2390, pulse: 70 },
  { name: 'Sun', steps: 3490, pulse: 65 },
];

const Dashboard = () => {
  return (
    <div className="container section">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px' }}>Welcome back, Advait</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here is your health overview for the last 7 days.</p>
      </div>

      <div className="health-status-bar" style={{ marginBottom: '32px' }}>
        {[
          { label: 'Heart Rate', value: '72', unit: 'bpm', icon: <Heart size={16} /> },
          { label: 'Steps', value: '3,490', unit: 'steps', icon: <Activity size={16} /> },
          { label: 'Sleep', value: '7.5', unit: 'hrs', icon: <TrendingUp size={16} /> },
          { label: 'Water', value: '2.1', unit: 'L', icon: <Droplet size={16} /> }
        ].map(s => (
          <div key={s.label} className="status-pill animate-fade-in">
            <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {s.icon} {s.label}
            </span>
            <div className="status-value">{s.value}<span className="status-unit">{s.unit}</span></div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px' }}>Health Trends</h3>
            <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Last 7 Days</span>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                />
                <Area type="monotone" dataKey="steps" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorSteps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Symptoms */}
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Recent Activity</h3>
              <History size={18} color="var(--text-muted)" />
            </div>
            <div className="list-item">
              <div className="item-icon"><Activity size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Mild Headache</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Yesterday, 4:30 PM</div>
              </div>
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <div className="list-item">
              <div className="item-icon" style={{ background: 'var(--secondary-soft)', color: 'var(--secondary)' }}><FileText size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Blood Report Uploaded</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>2 days ago</div>
              </div>
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
          </div>

          {/* Reminders */}
          <div className="stat-card" style={{ background: 'var(--primary)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Reminders</h3>
              <Calendar size={18} />
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }}></div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Dentist Appointment</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Tomorrow, 10:00 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
