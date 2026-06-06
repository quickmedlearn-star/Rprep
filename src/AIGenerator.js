import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
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
const GEMINI_API_KEY = 'AQ.Ab8RN6JPNWKSrrLdn5-nMaSTYijeS7Q4cy2YUMXKwAmvWKkXQA';
const VALID_SUBJECTS = ['Anatomy', 'Physiology', 'Pharmacology', 'Pathology', 'Microbiology', 'Nursing Fundamentals', 'Community Health', 'Nutrition', 'Child Health', 'Mental Health', 'Obstetrics', 'Medical Surgical'];
const QUESTION_TYPES = ["Theoretical", "Clinical", "Case Scenario", "Skill-Based", "Judgement", "Calculation", "Emergency"];

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function AIGenerator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', topic: '', difficulty: 'Medium', questionType: 'Theoretical', count: 5 });
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shuffleCount, setShuffleCount] = useState(0);
  const [distribution, setDistribution] = useState({ A: 0, B: 0, C: 0, D: 0 });

  const istyle = { padding: '10px 14px', borderRadius: 8, border: '1px solid #2a2a4a', background: '#0a0a1a', color: '#fff', fontSize: 13, width: '100%', outline: 'none' };

  const getDist = (data) => {
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    data.forEach(q => dist[q.correctAnswer]++);
    const t = data.length || 1;
    return { A: ((dist.A/t)*100).toFixed(1), B: ((dist.B/t)*100).toFixed(1), C: ((dist.C/t)*100).toFixed(1), D: ((dist.D/t)*100).toFixed(1) };
  };

  const handleShuffle = () => {
    if (!generated.length) return;
    const nd = generated.map(q => {
      const cm = { A: 0, B: 1, C: 2, D: 3 };
      const opts = [q.optionA, q.optionB, q.optionC, q.optionD];
      const ca = opts[cm[q.correctAnswer]];
      const idx = shuffleArray([0,1,2,3]);
      const so = idx.map(i => opts[i]);
      const nc = idx.indexOf(cm[q.correctAnswer]);
      return {...q, optionA: so[0], optionB: so[1], optionC: so[2], optionD: so[3], correctAnswer: String.fromCharCode(65+nc)};
    });
    setGenerated(nd);
    setShuffleCount(shuffleCount+1);
    setDistribution(getDist(nd));
  };

  const handleGenerate = async () => {
    if (!form.subject) return setError('Select subject');
    setLoading(true); setError(''); setSuccess(''); setGenerated([]);
    const prompt = `Generate ${form.count} nursing MCQs. Subject: ${form.subject}, Topic: ${form.topic || 'General'}, Difficulty: ${form.difficulty}, Type: ${form.questionType}. Return ONLY valid JSON array. Each object: subject, topic, difficulty, questionType, question, optionA, optionB, optionC, optionD, correctAnswer (A/B/C/D), explanation.`;
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const result = await res.json();
      let text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Remove markdown code blocks
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      if (!text) { setError('No content from AI'); setLoading(false); return; }
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) { setError('No JSON array found'); setLoading(false); return; }
      let data;
      try { data = JSON.parse(match[0]); } catch(e) { setError('Invalid JSON'); setLoading(false); return; }
      if (!Array.isArray(data) || !data.length) { setError('Empty array'); setLoading(false); return; }
      data.forEach(q => {
        if (!q.subject) q.subject = form.subject;
        if (!q.topic) q.topic = form.topic;
        if (!q.difficulty) q.difficulty = form.difficulty;
        if (!q.questionType) q.questionType = form.questionType;
      });
      setGenerated(data);
      setDistribution(getDist(data));
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!generated.length) return;
    const batch = writeBatch(db);
    const ref = collection(db, 'questions');
    generated.forEach(q => {
      batch.set(doc(ref), {
        subject: form.subject, topic: q.topic || '', difficulty: q.difficulty || form.difficulty,
        questionType: q.questionType || form.questionType, question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correct: ['A','B','C','D'].indexOf(q.correctAnswer),
        explanation: q.explanation || '', aiGenerated: true, createdAt: new Date().toISOString()
      });
    });
    await batch.commit();
    setSuccess(`✅ ${generated.length} MCQs uploaded!`);
    setGenerated([]);
  };

  const bal = ['A','B','C','D'].every(o => parseFloat(distribution[o]) >= 20 && parseFloat(distribution[o]) <= 30);

  return (
    <div>
      <h2>🤖 AI MCQ Generator</h2>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div><label style={lbl}>Subject</label><select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={istyle}><option value="">Select</option>{VALID_SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={lbl}>Topic</label><input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} style={istyle} placeholder="e.g., Heart"/></div>
          <div><label style={lbl}>Difficulty</label><select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})} style={istyle}><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
          <div><label style={lbl}>Type</label><select value={form.questionType} onChange={e=>setForm({...form,questionType:e.target.value})} style={istyle}>{QUESTION_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={lbl}>Count</label><select value={form.count} onChange={e=>setForm({...form,count:parseInt(e.target.value)})} style={istyle}>{[5,10,15,20].map(n=><option key={n}>{n}</option>)}</select></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} style={{ padding: '12px 30px', background: '#00f5ff', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14 }}>
          {loading ? '⏳ Generating...' : '🤖 Generate MCQs'}
        </button>
      </div>
      {error && <div style={{...msg, background:'rgba(255,45,149,0.1)', border:'1px solid rgba(255,45,149,0.3)', color:'#ff2d95'}}>❌ {error}</div>}
      {success && <div style={{...msg, background:'rgba(0,255,136,0.1)', border:'1px solid rgba(0,255,136,0.3)', color:'#00ff88'}}>{success}</div>}
      {generated.length > 0 && (
        <div>
          <div className="card" style={{ marginBottom: 15, padding: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ color: '#00f5ff', margin: 0 }}>🔀 Distribution</h3>
              <button onClick={handleShuffle} style={{ padding: '10px 20px', background: bal ? '#00ff88' : '#ffb800', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 13 }}>🔀 Shuffle ({shuffleCount}x)</button>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['A','B','C','D'].map(o => (
                <div key={o} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '14px 0', border: `2px solid ${parseFloat(distribution[o]) >= 20 && parseFloat(distribution[o]) <= 30 ? '#00ff88' : '#ff2d95'}` }}>
                    <div style={{ fontSize: 22, fontWeight: 'bold', color: '#00f5ff' }}>{distribution[o]}%</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Option {o}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/ai-validator', { state: { mcqs: generated } })} style={{ padding: '14px', background: '#7b2fff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold', fontSize: 15, width: '100%', marginBottom: 10 }}>🔍 Validate with AI</button>
          <button onClick={handleUpload} style={{ padding: '14px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold', fontSize: 15, width: '100%', marginBottom: 15 }}>🚀 Upload {generated.length} MCQs</button>
          {generated.map((mcq, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, padding: 15 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <span style={badge('#00f5ff')}>{mcq.subject}</span>
                <span style={badge('#7b2fff')}>{mcq.difficulty}</span>
                <span style={badge('#ff8c42')}>{mcq.questionType}</span>
              </div>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Q{i+1}. {mcq.question}</p>
              {[mcq.optionA,mcq.optionB,mcq.optionC,mcq.optionD].map((opt,j) => (
                <p key={j} style={{ color: String.fromCharCode(65+j) === mcq.correctAnswer ? '#00ff88' : '#b0b0cc', fontSize: 13, marginBottom: 2, fontWeight: String.fromCharCode(65+j) === mcq.correctAnswer ? 'bold' : 'normal' }}>
                  {String.fromCharCode(65+j)}) {opt} {String.fromCharCode(65+j) === mcq.correctAnswer ? '✅' : ''}
                </p>
              ))}
              {mcq.explanation && <p style={{ color: '#666', fontSize: 11, marginTop: 6 }}>💡 {mcq.explanation}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const lbl = { color: '#b0b0cc', fontSize: 11, marginBottom: 5, display: 'block' };
const badge = (c) => ({ background: `${c}15`, color: c, padding: '2px 10px', borderRadius: 6, fontSize: 11 });
const msg = { padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 13 };
