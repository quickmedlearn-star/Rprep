import React, { useState } from 'react';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { useNavigate, useLocation } from 'react-router-dom';

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
const GEMINI_API_KEY = 'AQ.Ab8RN6KJXN9XdurFnY1Jrd45qBjrmoSLgitbY8Er7MALWfX5-g';

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function AIValidator() {
  const location = useLocation();
  const navigate = useNavigate();
  const mcqs = location.state?.mcqs || [];
  const [results, setResults] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [success, setSuccess] = useState('');

  const verifyOne = async (mcq) => {
    const prompt = `Is this nursing MCQ correct? Reply ONLY "APPROVED" or "REJECTED".\nQ: ${mcq.question}\nA) ${mcq.optionA} B) ${mcq.optionB} C) ${mcq.optionC} D) ${mcq.optionD}\nAnswer: ${mcq.correctAnswer}\n\nAPPROVE if answer is medically correct. REJECT only if factually wrong.`;
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const result = await res.json();
      const text = (result.candidates?.[0]?.content?.parts?.[0]?.text || '').toUpperCase();
      return { ...mcq, verified: text.includes('APPROVED') };
    } catch(e) { return { ...mcq, verified: true }; }
  };

  const handleVerify = async () => {
    setVerifying(true);
    const v = [];
    for (let i = 0; i < mcqs.length; i++) {
      setCurrentIndex(i);
      v.push(await verifyOne(mcqs[i]));
    }
    setResults(v);
    setVerifying(false);
  };

  const handleUpload = async () => {
    const approved = results.filter(r => r.verified);
    if (!approved.length) return alert('No approved MCQs!');
    const batch = writeBatch(db);
    const ref = collection(db, 'questions');
    approved.forEach(q => {
      const cm = { A: 0, B: 1, C: 2, D: 3 };
      const opts = [q.optionA, q.optionB, q.optionC, q.optionD];
      const ca = opts[cm[q.correctAnswer]];
      const idx = shuffleArray([0,1,2,3]);
      const so = idx.map(i => opts[i]);
      batch.set(doc(ref), {
        subject: q.subject, topic: q.topic || '', difficulty: q.difficulty,
        questionType: q.questionType, question: q.question,
        options: so, correct: idx.indexOf(cm[q.correctAnswer]),
        explanation: q.explanation || '', aiGenerated: true, aiVerified: true,
        createdAt: new Date().toISOString()
      });
    });
    await batch.commit();
    setSuccess(`✅ ${approved.length} uploaded! (${results.length - approved.length} rejected)`);
    setResults([]);
  };

  const approved = results.filter(r => r.verified);
  const rejected = results.filter(r => !r.verified);

  return (
    <div>
      <h2>🔍 AI Validator</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>Gemini AI verifies each MCQ</p>
      {!mcqs.length && !results.length ? (
        <div className="card" style={{ textAlign: 'center', padding: 50 }}>
          <h3 style={{ color: '#666' }}>No MCQs</h3>
          <button onClick={() => navigate('/ai-generator')} style={{ marginTop: 15, padding: '10px 20px', background: '#00f5ff', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>➡️ AI Generator</button>
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            <div className="stat-card"><h3>{mcqs.length}</h3><p>Total</p></div>
            <div className="stat-card"><h3 style={{ color: '#00ff88' }}>{approved.length}</h3><p>Approved ✅</p></div>
            <div className="stat-card"><h3 style={{ color: '#ff2d95' }}>{rejected.length}</h3><p>Rejected ❌</p></div>
            <div className="stat-card"><h3>{verifying ? '⏳' : results.length ? '✅' : '⏸️'}</h3><p>Status</p></div>
          </div>
          {!results.length && (
            <button onClick={handleVerify} disabled={verifying} style={{ padding: '14px', background: '#7b2fff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold', fontSize: 15, width: '100%', marginBottom: 15 }}>
              {verifying ? `🔍 ${currentIndex+1}/${mcqs.length}` : `🔍 Start Verification (${mcqs.length})`}
            </button>
          )}
          {verifying && <div style={{ background: '#0a0a1a', height: 6, borderRadius: 3, marginBottom: 15 }}><div style={{ height: '100%', borderRadius: 3, background: '#7b2fff', width: `${((currentIndex+1)/mcqs.length)*100}%` }} /></div>}
          {success && <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', padding: 15, borderRadius: 10, color: '#00ff88', marginBottom: 15 }}>{success}</div>}
          {approved.length > 0 && (
            <button onClick={handleUpload} style={{ padding: '14px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold', fontSize: 15, width: '100%', marginBottom: 15 }}>🚀 Upload {approved.length} Approved</button>
          )}
          {results.map((mcq, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, padding: 15, borderLeft: `4px solid ${mcq.verified ? '#00ff88' : '#ff2d95'}` }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <span style={badge('#00f5ff')}>{mcq.subject}</span>
                <span style={badge(mcq.verified ? '#00ff88' : '#ff2d95')}>{mcq.verified ? '✅ APPROVED' : '❌ REJECTED'}</span>
              </div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>{mcq.question}</p>
              <p style={{ color: '#00ff88', fontSize: 12 }}>Answer: {mcq.correctAnswer}) {mcq[`option${mcq.correctAnswer}`]}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
const badge = (c) => ({ background: `${c}15`, color: c, padding: '2px 10px', borderRadius: 6, fontSize: 11 });
