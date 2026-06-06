import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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

export default function Notifications() {
  const [form, setForm] = useState({ title: '', message: '', type: 'General' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSend = async () => {
    if (!form.title || !form.message) return;
    setLoading(true);
    await addDoc(collection(db, 'notifications'), {
      ...form,
      sentAt: new Date().toISOString(),
      read: false
    });
    setSuccess('✅ Notification sent to all users!');
    setForm({ title: '', message: '', type: 'General' });
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const types = ['General', 'Exam Alert', 'New Test', 'Offer', 'Reminder'];
  const ist = { padding: '10px 14px', borderRadius: 8, border: '1px solid #2a2a4a', background: '#0a0a1a', color: '#fff', fontSize: 13, width: '100%', outline: 'none' };

  return (
    <div>
      <h2>🔔 Notifications</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>Send push notifications to app users</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>📤 Send Notification</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <input placeholder="Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={ist} />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={ist}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <textarea placeholder="Message *" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{...ist, minHeight: 80, marginBottom: 15, resize: 'vertical' }} />
        <button onClick={handleSend} disabled={loading} style={{ padding: '10px 25px', background: '#00f5ff', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Sending...' : '📤 Send to All Users'}
        </button>
        {success && <p style={{ marginTop: 10, color: '#00ff88', fontSize: 13 }}>{success}</p>}
      </div>

      <div className="card">
        <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>📋 Notification History</h3>
        <p style={{ color: '#666', fontSize: 13 }}>Notifications will appear here after sending. Firebase integration ready.</p>
      </div>
    </div>
  );
}
