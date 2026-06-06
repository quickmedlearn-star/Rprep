import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Link } from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyBQX7tciNTgkqOY4tuZJV2ibFmd5ZD_8Ig",
  authDomain: "edutechapprprep.firebaseapp.com",
  projectId: "edutechapprprep",
  storageBucket: "edutechapprprep.firebasestorage.app",
  messagingSenderId: "123508415859",
  appId: "1:123508415859:web:8b6e65537f53027428b906"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [stats, setStats] = useState({ mcqs: 0, users: 0, subjects: 0, premium: 0 });
  const [recentMCQs, setRecentMCQs] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [mcqSnap, userSnap] = await Promise.all([
        getDocs(collection(db, 'questions')),
        getDocs(collection(db, 'users'))
      ]);

      const mcqs = mcqSnap.docs;
      const users = userSnap.docs;
      const subjects = new Set(mcqs.map(d => d.data().subject)).size;
      const premium = users.filter(d => d.data().isPremium || d.data().membership === 'Premium').length;

      // Subject distribution
      const subDist = {};
      mcqs.forEach(d => {
        const s = d.data().subject || 'Unknown';
        subDist[s] = (subDist[s] || 0) + 1;
      });
      const subArray = Object.entries(subDist).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Recent MCQs
      const recent = mcqs
        .sort((a, b) => new Date(b.data().createdAt) - new Date(a.data().createdAt))
        .slice(0, 5)
        .map(d => ({ id: d.id, ...d.data() }));

      setStats({ mcqs: mcqs.length, users: users.length, subjects, premium });
      setSubjectData(subArray);
      setRecentMCQs(recent);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const quickActions = [
    { icon: '🤖', label: 'AI Generator', path: '/ai-generator', color: '#00f5ff' },
    { icon: '📝', label: 'MCQ Manager', path: '/mcq-manager', color: '#7b2fff' },
    { icon: '🔍', label: 'AI Validator', path: '/ai-validator', color: '#ffb800' },
    { icon: '👥', label: 'Users', path: '/users', color: '#00ff88' },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: 50, color: '#666' }}>⏳ Loading dashboard...</div>;

  return (
    <div>
      <h2>📊 Dashboard</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>Welcome back! Here's your overview.</p>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 25 }}>
        <div className="stat-card" style={{ borderLeft: '3px solid #00f5ff' }}>
          <h3>{stats.mcqs}</h3><p>Total MCQs</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #7b2fff' }}>
          <h3>{stats.subjects}</h3><p>Subjects</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #00ff88' }}>
          <h3>{stats.users}</h3><p>Total Users</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #ffb800' }}>
          <h3>{stats.premium}</h3><p>Premium Users</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left Column */}
        <div>
          {/* Subject Distribution */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>📚 Subject Distribution</h3>
            {subjectData.length === 0 ? (
              <p style={{ color: '#666' }}>No MCQs yet. Use AI Generator to create questions.</p>
            ) : (
              subjectData.map((s, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#fff', fontSize: 13 }}>{s.name}</span>
                    <span style={{ color: '#00f5ff', fontSize: 13, fontWeight: 'bold' }}>{s.count}</span>
                  </div>
                  <div style={{ background: '#0a0a1a', height: 6, borderRadius: 3 }}>
                    <div style={{ height: '100%', borderRadius: 3, background: '#00f5ff', width: `${(s.count/stats.mcqs)*100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent MCQs */}
          <div className="card">
            <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>🕐 Recently Added</h3>
            {recentMCQs.length === 0 ? (
              <p style={{ color: '#666' }}>No MCQs yet.</p>
            ) : (
              recentMCQs.map((mcq, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < recentMCQs.length-1 ? '1px solid #2a2a4a' : 'none' }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <span style={badge('#00f5ff')}>{mcq.subject}</span>
                    <span style={badge('#7b2fff')}>{mcq.difficulty}</span>
                  </div>
                  <p style={{ color: '#b0b0cc', fontSize: 12, lineHeight: 1.4 }}>{mcq.question?.substring(0, 80)}...</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>⚡ Quick Actions</h3>
            {quickActions.map((a, i) => (
              <Link key={i} to={a.path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < quickActions.length-1 ? '1px solid #2a2a4a' : 'none', textDecoration: 'none' }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ color: '#fff', fontSize: 13, flex: 1 }}>{a.label}</span>
                <span style={{ color: '#666' }}>→</span>
              </Link>
            ))}
          </div>

          {/* Tips Card */}
          <div className="card" style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.1)' }}>
            <h3 style={{ color: '#00f5ff', marginBottom: 10 }}>💡 Tips</h3>
            <p style={{ color: '#b0b0cc', fontSize: 12, lineHeight: 1.6 }}>
              • Use <strong style={{ color: '#fff' }}>AI Generator</strong> to create MCQs quickly<br/>
              • Validate before uploading to ensure quality<br/>
              • Aim for 100+ MCQs per subject<br/>
              • Maintain option distribution (25% each)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const badge = (c) => ({ background: `${c}15`, color: c, padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 500 });
