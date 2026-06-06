import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setUsers(data);
    setLoading(false);
  };

  const handleTogglePremium = async (user) => {
    const newStatus = user.membership === 'Premium' ? 'Free' : 'Premium';
    await updateDoc(doc(db, 'users', user.id), { 
      membership: newStatus,
      isPremium: newStatus === 'Premium'
    });
    loadUsers();
  };

  const getAccuracy = (u) => {
    if (!u.totalQuestions || u.totalQuestions === 0) return 0;
    return Math.round((u.correctAnswers / u.totalQuestions) * 100);
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || (filter === 'Premium' && u.membership === 'Premium') || (filter === 'Free' && u.membership !== 'Premium');
    return matchSearch && matchFilter;
  });

  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.membership === 'Premium').length;
  const activeUsers = users.filter(u => (u.testsCompleted || 0) > 0).length;

  if (loading) return <div style={{ textAlign: 'center', padding: 50, color: '#666' }}>⏳ Loading users...</div>;

  return (
    <div>
      <h2>👥 Users Manager</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>Manage app users and premium status</p>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card"><h3>{totalUsers}</h3><p>Total Users</p></div>
        <div className="stat-card"><h3 style={{ color: '#ffb800' }}>{premiumUsers}</h3><p>Premium 💎</p></div>
        <div className="stat-card"><h3 style={{ color: '#00ff88' }}>{activeUsers}</h3><p>Active 📝</p></div>
        <div className="stat-card"><h3>{totalUsers - activeUsers}</h3><p>Inactive</p></div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        <input placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #2a2a4a', background: '#0a0a1a', color: '#fff', fontSize: 13, width: 250, outline: 'none' }} />
        {['All', 'Free', 'Premium'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid #2a2a4a', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', background: filter === f ? '#00f5ff' : '#141428', color: filter === f ? '#000' : '#fff' }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#666' }}>No users found</div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a4a' }}>
                <th style={th}>User</th>
                <th style={th}>Tests</th>
                <th style={th}>Accuracy</th>
                <th style={th}>XP</th>
                <th style={th}>Streak</th>
                <th style={th}>Status</th>
                <th style={th}>Joined</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>👤</span>
                      <div>
                        <div style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{u.name || 'N/A'}</div>
                        <div style={{ color: '#666', fontSize: 11 }}>{u.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={td}>{u.testsCompleted || 0}</td>
                  <td style={td}><span style={{ color: getAccuracy(u) >= 70 ? '#00ff88' : getAccuracy(u) >= 50 ? '#ffb800' : '#ff2d95' }}>{getAccuracy(u)}%</span></td>
                  <td style={td}>{u.xp || 0}</td>
                  <td style={td}>{u.streak || 0}🔥</td>
                  <td style={td}>
                    <span style={{ background: u.membership === 'Premium' ? 'rgba(255,184,0,0.15)' : 'rgba(255,255,255,0.05)', color: u.membership === 'Premium' ? '#ffb800' : '#666', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>
                      {u.membership || 'Free'}
                    </span>
                  </td>
                  <td style={td}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td style={td}>
                    <button onClick={() => handleTogglePremium(u)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', background: u.membership === 'Premium' ? '#ff2d95' : '#00ff88', color: '#000' }}>
                      {u.membership === 'Premium' ? 'Remove' : 'Make Premium'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setSelectedUser(null)}>
          <div className="card" style={{ width: 400, padding: 25 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>User Details</h3>
            <p style={{ color: '#fff' }}><strong>Name:</strong> {selectedUser.name}</p>
            <p style={{ color: '#666' }}><strong>Email:</strong> {selectedUser.email}</p>
            <p style={{ color: '#666' }}><strong>XP:</strong> {selectedUser.xp}</p>
            <button onClick={() => setSelectedUser(null)} style={{ marginTop: 15, padding: '8px 20px', background: '#ff2d95', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const th = { padding: '12px 10px', textAlign: 'left', color: '#666', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' };
const td = { padding: '12px 10px', color: '#b0b0cc', fontSize: 12 };
