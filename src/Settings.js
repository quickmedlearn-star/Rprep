import React, { useState } from 'react';
import { getAuth, updatePassword, signOut } from 'firebase/auth';
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
const auth = getAuth(app);

export default function Settings() {
  const [tab, setTab] = useState('profile');
  const [newPass, setNewPass] = useState('');
  const [msg, setMsg] = useState('');

  const handlePasswordChange = async () => {
    if (newPass.length < 6) return setMsg('Password must be 6+ characters');
    try {
      await updatePassword(auth.currentUser, newPass);
      setMsg('✅ Password updated!');
    } catch(e) { setMsg('❌ ' + e.message); }
  };

  return (
    <div>
      <h2>⚙️ Settings</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>Admin panel configuration</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['profile', 'password', 'about'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', borderRadius: 8, border: '1px solid #2a2a4a', cursor: 'pointer',
            background: tab === t ? '#00f5ff' : '#141428', color: tab === t ? '#000' : '#fff', fontWeight: 'bold', fontSize: 13, textTransform: 'capitalize'
          }}>{t}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card">
          <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>👤 Admin Profile</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: 'rgba(0,245,255,0.1)', border: '2px solid #00f5ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 28 }}>👤</div>
            <div>
              <p style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{auth.currentUser?.email || 'Admin'}</p>
              <p style={{ color: '#666', fontSize: 12 }}>Super Admin</p>
            </div>
          </div>
          <div style={infoRow}><span style={infoLabel}>Email:</span><span style={infoVal}>{auth.currentUser?.email}</span></div>
          <div style={infoRow}><span style={infoLabel}>Role:</span><span style={infoVal}>Super Admin</span></div>
          <div style={infoRow}><span style={infoLabel}>Last Login:</span><span style={infoVal}>{new Date().toLocaleString()}</span></div>
        </div>
      )}

      {tab === 'password' && (
        <div className="card">
          <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>🔒 Change Password</h3>
          <input type="password" placeholder="New Password (6+ chars)" value={newPass} onChange={e => setNewPass(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #2a2a4a', background: '#0a0a1a', color: '#fff', fontSize: 13, width: '100%', marginBottom: 15, outline: 'none' }} />
          <button onClick={handlePasswordChange} style={{ padding: '10px 25px', background: '#00f5ff', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Update Password</button>
          {msg && <p style={{ marginTop: 10, color: msg.includes('✅') ? '#00ff88' : '#ff2d95', fontSize: 13 }}>{msg}</p>}
        </div>
      )}

      {tab === 'about' && (
        <div className="card">
          <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>ℹ️ About RPREP Admin</h3>
          <div style={infoRow}><span style={infoLabel}>App:</span><span style={infoVal}>RPREP - Nursing Exam Prep</span></div>
          <div style={infoRow}><span style={infoLabel}>Version:</span><span style={infoVal}>1.0.0 Pro</span></div>
          <div style={infoRow}><span style={infoLabel}>Firebase:</span><span style={infoVal}>edutechapprprep</span></div>
          <div style={infoRow}><span style={infoLabel}>AI Model:</span><span style={infoVal}>Gemini Flash (Google)</span></div>
          <div style={infoRow}><span style={infoLabel}>Database:</span><span style={infoVal}>Firestore</span></div>
          <p style={{ color: '#666', fontSize: 11, marginTop: 15 }}>© 2026 RPREP Technologies. All rights reserved.</p>
        </div>
      )}
    </div>
  );
}

const infoRow = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' };
const infoLabel = { color: '#666', fontSize: 13 };
const infoVal = { color: '#fff', fontSize: 13 };
