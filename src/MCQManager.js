import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
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

const VALID_SUBJECTS = ['Anatomy', 'Physiology', 'Pharmacology', 'Pathology', 'Microbiology', 'Nursing Fundamentals', 'Community Health', 'Nutrition', 'Child Health', 'Mental Health', 'Obstetrics', 'Medical Surgical'];

const SAMPLE_JSON = `[
  {
    "subject": "Pharmacology",
    "topic": "Antibiotics",
    "difficulty": "Medium",
    "question": "Which is a beta-lactam antibiotic?",
    "optionA": "Penicillin",
    "optionB": "Tetracycline",
    "optionC": "Erythromycin",
    "optionD": "Ciprofloxacin",
    "correctAnswer": "A",
    "explanation": "Penicillin inhibits cell wall synthesis."
  },
  {
    "subject": "Anatomy",
    "topic": "Cardiovascular",
    "difficulty": "Easy",
    "question": "How many chambers in human heart?",
    "optionA": "2",
    "optionB": "3",
    "optionC": "4",
    "optionD": "5",
    "correctAnswer": "C",
    "explanation": "Human heart has 4 chambers: 2 atria and 2 ventricles."
  }
]`;

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function MCQManager() {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upload');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Bulk upload states
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonValid, setJsonValid] = useState(null);
  const [parsedCount, setParsedCount] = useState(0);
  const [distribution, setDistribution] = useState({ A: 0, B: 0, C: 0, D: 0 });
  
  // Edit state
  const [editMcq, setEditMcq] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

  useEffect(() => { loadMCQs(); }, []);

  const loadMCQs = async () => {
    const snap = await getDocs(collection(db, 'questions'));
    setMcqs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const getDistribution = () => {
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    mcqs.forEach(m => {
      const letter = String.fromCharCode(65 + (m.correct || 0));
      if (dist[letter] !== undefined) dist[letter]++;
    });
    const total = mcqs.length || 1;
    return {
      A: ((dist.A/total)*100).toFixed(1),
      B: ((dist.B/total)*100).toFixed(1),
      C: ((dist.C/total)*100).toFixed(1),
      D: ((dist.D/total)*100).toFixed(1),
      total
    };
  };

  // Validate JSON
  const handleValidate = () => {
    setJsonError('');
    setJsonValid(null);
    
    if (!jsonInput.trim()) {
      setJsonError('Please paste JSON data');
      return;
    }
    
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        setJsonError('JSON must be an array []');
        return;
      }
      if (data.length === 0) {
        setJsonError('Array is empty');
        return;
      }
      
      const errors = [];
      const subjectsFound = new Set();
      
      data.forEach((q, i) => {
        if (!q.subject) errors.push(`Q${i+1}: subject missing`);
        else if (!VALID_SUBJECTS.includes(q.subject)) errors.push(`Q${i+1}: Invalid subject "${q.subject}"`);
        else subjectsFound.add(q.subject);
        
        if (!q.question) errors.push(`Q${i+1}: question missing`);
        if (!q.optionA) errors.push(`Q${i+1}: optionA missing`);
        if (!q.optionB) errors.push(`Q${i+1}: optionB missing`);
        if (!q.optionC) errors.push(`Q${i+1}: optionC missing`);
        if (!q.optionD) errors.push(`Q${i+1}: optionD missing`);
        if (!q.correctAnswer || !['A','B','C','D'].includes(q.correctAnswer)) 
          errors.push(`Q${i+1}: correctAnswer must be A/B/C/D`);
      });
      
      if (errors.length > 0) {
        setJsonError(errors.slice(0, 5).join('\n') + (errors.length > 5 ? `\n...and ${errors.length-5} more` : ''));
        setJsonValid(false);
      } else {
        setJsonValid(true);
        setParsedCount(data.length);
        
        // Preview distribution
        const dist = { A: 0, B: 0, C: 0, D: 0 };
        data.forEach(q => dist[q.correctAnswer]++);
        const total = data.length;
        setDistribution({
          A: ((dist.A/total)*100).toFixed(1),
          B: ((dist.B/total)*100).toFixed(1),
          C: ((dist.C/total)*100).toFixed(1),
          D: ((dist.D/total)*100).toFixed(1),
          total,
          subjects: [...subjectsFound]
        });
      }
    } catch (e) {
      setJsonError('Invalid JSON format: ' + e.message);
      setJsonValid(false);
    }
  };

  // Shuffle preview
  const handleShufflePreview = () => {
    if (!jsonInput.trim()) return;
    try {
      const data = JSON.parse(jsonInput);
      const dist = { A: 0, B: 0, C: 0, D: 0 };
      
      // Simulate shuffle 100 times and average
      for (let sim = 0; sim < 100; sim++) {
        data.forEach(q => {
          const correctMap = { A: 0, B: 1, C: 2, D: 3 };
          const options = [q.optionA, q.optionB, q.optionC, q.optionD];
          const correctAnswer = options[correctMap[q.correctAnswer]];
          const indices = [0, 1, 2, 3];
          const shuffledIndices = shuffleArray(indices);
          const newCorrectIndex = shuffledIndices.indexOf(correctMap[q.correctAnswer]);
          dist[String.fromCharCode(65 + newCorrectIndex)]++;
        });
      }
      
      const total = data.length * 100;
      setDistribution({
        A: ((dist.A/total)*100).toFixed(1),
        B: ((dist.B/total)*100).toFixed(1),
        C: ((dist.C/total)*100).toFixed(1),
        D: ((dist.D/total)*100).toFixed(1),
        total: data.length
      });
    } catch(e) {}
  };

  // Upload
  const handleUpload = async () => {
    if (!jsonValid) return handleValidate();
    
    const data = JSON.parse(jsonInput);
    const batch = writeBatch(db);
    const qRef = collection(db, 'questions');
    let uploaded = 0;
    
    data.forEach(q => {
      const correctMap = { A: 0, B: 1, C: 2, D: 3 };
      const options = [q.optionA, q.optionB, q.optionC, q.optionD];
      const correctAnswer = options[correctMap[q.correctAnswer]];
      const indices = [0, 1, 2, 3];
      const shuffledIndices = shuffleArray(indices);
      const shuffledOptions = shuffledIndices.map(i => options[i]);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
      
      batch.set(doc(qRef), {
        subject: q.subject,
        topic: q.topic || '',
        difficulty: q.difficulty || 'Medium',
        question: q.question,
        options: shuffledOptions,
        correct: newCorrectIndex,
        explanation: q.explanation || '',
        batchId: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      uploaded++;
    });

    await batch.commit();
    alert(`✅ ${uploaded} MCQs uploaded successfully!\n\nSubjects: ${[...new Set(data.map(q => q.subject))].join(', ')}`);
    setJsonInput('');
    setJsonValid(null);
    setJsonError('');
    loadMCQs();
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm('Delete this MCQ?')) {
      await deleteDoc(doc(db, 'questions', id));
      loadMCQs();
    }
  };

  // Batch Delete
  const handleBatchDelete = async () => {
    if (selectedBatch.length === 0) return;
    if (window.confirm(`Delete ${selectedBatch.length} MCQs?`)) {
      const batch = writeBatch(db);
      selectedBatch.forEach(id => batch.delete(doc(db, 'questions', id)));
      await batch.commit();
      setSelectedBatch([]);
      loadMCQs();
    }
  };

  // Edit
  const handleEdit = (mcq) => { setEditMcq({...mcq}); setTab('edit'); };
  const handleUpdate = async () => {
    const { id, ...data } = editMcq;
    await updateDoc(doc(db, 'questions', id), data);
    alert('✅ Updated!');
    setEditMcq(null);
    setTab('list');
    loadMCQs();
  };

  const handleShuffleAll = async () => {
    if (!window.confirm(`Shuffle options for ALL ${mcqs.length} MCQs?`)) return;
    const batch = writeBatch(db);
    mcqs.forEach(mcq => {
      const correctAnswer = mcq.options[mcq.correct];
      const indices = [0, 1, 2, 3];
      const shuffledIndices = shuffleArray(indices);
      const shuffledOptions = shuffledIndices.map(i => mcq.options[i]);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
      batch.update(doc(db, 'questions', mcq.id), { options: shuffledOptions, correct: newCorrectIndex });
    });
    await batch.commit();
    alert('✅ Shuffled!');
    loadMCQs();
  };

  const subjectCounts = {};
  mcqs.forEach(m => { subjectCounts[m.subject] = (subjectCounts[m.subject] || 0) + 1; });

  const filtered = mcqs.filter(m => {
    const subjectMatch = selectedSubject === 'All' || m.subject === selectedSubject;
    const searchMatch = !searchTerm || m.question?.toLowerCase().includes(searchTerm.toLowerCase());
    return subjectMatch && searchMatch;
  });

  const dist = getDistribution();
  const isBalanced = ['A','B','C','D'].every(o => parseFloat(dist[o]) >= 20 && parseFloat(dist[o]) <= 30);

  const inputStyle = { padding: '10px 14px', borderRadius: 8, border: '1px solid #2a2a4a', background: '#0a0a1a', color: '#fff', fontSize: 13, width: '100%', outline: 'none' };
  const btnPrimary = { padding: '10px 24px', background: '#00f5ff', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 13 };
  const btnSuccess = { ...btnPrimary, background: '#00ff88' };
  const btnDanger = { ...btnPrimary, background: '#ff2d95', color: '#fff' };
  const btnWarning = { ...btnPrimary, background: '#ffb800' };

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card"><h3>{mcqs.length}</h3><p>Total MCQs</p></div>
        <div className="stat-card"><h3>{Object.keys(subjectCounts).length}</h3><p>Subjects</p></div>
        <div className="stat-card"><h3>{isBalanced ? '✅' : '⚠️'}</h3><p>Distribution</p></div>
        <div className="stat-card"><h3>{selectedBatch.length}</h3><p>Selected</p></div>
      </div>

      {/* Distribution Bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: '#00f5ff', margin: 0 }}>📊 Correct Answer Distribution</h3>
          <button onClick={handleShuffleAll} style={isBalanced ? btnSuccess : btnWarning}>
            🔀 Shuffle All {isBalanced ? '✅' : ''}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          {['A','B','C','D'].map(opt => (
            <div key={opt} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ background: '#0a0a1a', borderRadius: 10, padding: '15px 0', border: `2px solid ${parseFloat(dist[opt]) >= 20 && parseFloat(dist[opt]) <= 30 ? '#00ff88' : '#ff2d95'}` }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#00f5ff' }}>{dist[opt]}%</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 5 }}>Option {opt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { key: 'upload', label: '📦 Bulk Upload', icon: '📦' },
          { key: 'list', label: '📋 MCQ List', icon: '📋' },
          { key: 'edit', label: '✏️ Edit', icon: '✏️' }
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 20px', borderRadius: 10, border: '1px solid #2a2a4a', cursor: 'pointer',
            background: tab === t.key ? '#00f5ff' : '#141428', color: tab === t.key ? '#000' : '#fff', fontWeight: 'bold', fontSize: 13
          }}>{t.label}</button>
        ))}
      </div>

      {/* BULK UPLOAD TAB */}
      {tab === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left - Sample */}
          <div className="card">
            <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>📋 JSON Format</h3>
            <pre style={{ background: '#0a0a1a', padding: 15, borderRadius: 10, color: '#00ff88', fontSize: 11, overflow: 'auto', maxHeight: 350, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{SAMPLE_JSON}</pre>
            <button onClick={() => { setJsonInput(SAMPLE_JSON); handleValidate(); }} style={{...btnPrimary, marginTop: 10, width: '100%' }}>
              📝 Use Sample Data
            </button>
            <div style={{ marginTop: 15, background: 'rgba(0,245,255,0.05)', padding: 12, borderRadius: 8, fontSize: 11, color: '#b0b0cc', lineHeight: 1.8 }}>
              <strong style={{ color: '#00f5ff' }}>Required:</strong> subject, question, optionA, optionB, optionC, optionD, correctAnswer<br/>
              <strong style={{ color: '#00f5ff' }}>Optional:</strong> topic, difficulty, explanation<br/>
              <strong style={{ color: '#00f5ff' }}>Valid subjects:</strong> {VALID_SUBJECTS.join(', ')}
            </div>
          </div>

          {/* Right - Input */}
          <div className="card">
            <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>📦 Paste JSON Data</h3>
            <textarea 
              placeholder='Paste your JSON array here...'
              value={jsonInput}
              onChange={e => { setJsonInput(e.target.value); setJsonValid(null); setJsonError(''); }}
              style={{...inputStyle, minHeight: 250, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
            />
            
            {/* Validation status */}
            {jsonValid === true && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', fontSize: 12 }}>
                ✅ Valid JSON • {parsedCount} MCQs • Subjects: {distribution.subjects?.join(', ')}
              </div>
            )}
            {jsonValid === false && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: 'rgba(255,45,149,0.1)', border: '1px solid rgba(255,45,149,0.3)', color: '#ff2d95', fontSize: 12, whiteSpace: 'pre-wrap' }}>
                ❌ {jsonError}
              </div>
            )}

            {/* Preview Distribution */}
            {parsedCount > 0 && (
              <div style={{ marginTop: 15 }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>After Shuffle Distribution (approx):</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['A','B','C','D'].map(opt => (
                    <div key={opt} style={{ flex: 1, background: '#0a0a1a', borderRadius: 6, padding: '8px 0', textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#00f5ff' }}>{distribution[opt]}%</div>
                      <div style={{ fontSize: 10, color: '#666' }}>{opt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
              <button onClick={handleValidate} style={{...btnWarning, flex: 1}}>🔍 Validate JSON</button>
              <button onClick={handleShufflePreview} style={{...btnPrimary, flex: 1}}>🔀 Shuffle Preview</button>
            </div>
            <button onClick={handleUpload} disabled={!jsonValid} style={{
              ...btnSuccess, marginTop: 10, width: '100%', opacity: jsonValid ? 1 : 0.5, cursor: jsonValid ? 'pointer' : 'not-allowed'
            }}>
              🚀 Upload {parsedCount > 0 ? `${parsedCount} MCQs` : ''}
            </button>
          </div>
        </div>
      )}

      {/* EDIT TAB */}
      {tab === 'edit' && editMcq && (
        <div className="card">
          <h3 style={{ color: '#00f5ff', marginBottom: 15 }}>✏️ Edit MCQ</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 15 }}>
            <select value={editMcq.subject} onChange={e => setEditMcq({...editMcq, subject: e.target.value})} style={inputStyle}>
              {VALID_SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <input value={editMcq.topic || ''} onChange={e => setEditMcq({...editMcq, topic: e.target.value})} style={inputStyle} placeholder="Topic" />
            <select value={editMcq.difficulty || 'Medium'} onChange={e => setEditMcq({...editMcq, difficulty: e.target.value})} style={inputStyle}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
          <textarea value={editMcq.question} onChange={e => setEditMcq({...editMcq, question: e.target.value})} style={{...inputStyle, minHeight: 70, marginBottom: 12}} />
          {editMcq.options?.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
              <span style={{ color: i === editMcq.correct ? '#00ff88' : '#666', fontWeight: 'bold', width: 20 }}>{String.fromCharCode(65+i)}</span>
              <input value={opt} onChange={e => { const opts = [...editMcq.options]; opts[i] = e.target.value; setEditMcq({...editMcq, options: opts}); }} style={{...inputStyle, flex: 1}} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
            <button onClick={handleUpdate} style={btnSuccess}>💾 Update</button>
            <button onClick={() => { setEditMcq(null); setTab('list'); }} style={btnDanger}>Cancel</button>
          </div>
        </div>
      )}

      {/* MCQ LIST TAB */}
      {tab === 'list' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 15, flexWrap: 'wrap', alignItems: 'center' }}>
            <input placeholder="🔍 Search questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{...inputStyle, width: 250}} />
            <button onClick={() => setSelectedSubject('All')} style={chipStyle(selectedSubject === 'All')}>All ({mcqs.length})</button>
            {VALID_SUBJECTS.map(s => subjectCounts[s] && (
              <button key={s} onClick={() => setSelectedSubject(s)} style={chipStyle(selectedSubject === s)}>{s} ({subjectCounts[s]})</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: '#666' }}>No MCQs found</div>
          ) : (
            filtered.map(mcq => (
              <div key={mcq.id} className="card" style={{ marginBottom: 8, padding: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={badge('#00f5ff')}>{mcq.subject}</span>
                    {mcq.topic && <span style={badge('#7b2fff')}>{mcq.topic}</span>}
                    <span style={badge(mcq.difficulty === 'Hard' ? '#ff2d95' : mcq.difficulty === 'Medium' ? '#ffb800' : '#00ff88')}>{mcq.difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleEdit(mcq)} style={iconBtn('#00f5ff')}>✏️</button>
                    <button onClick={() => handleDelete(mcq.id)} style={iconBtn('#ff2d95')}>🗑️</button>
                  </div>
                </div>
                <p style={{ fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }}>{mcq.question}</p>
                {mcq.options?.map((opt, i) => (
                  <p key={i} style={{ color: i === mcq.correct ? '#00ff88' : '#b0b0cc', fontSize: 13, marginBottom: 3, fontWeight: i === mcq.correct ? 'bold' : 'normal' }}>
                    {String.fromCharCode(65+i)}) {opt} {i === mcq.correct ? '✅' : ''}
                  </p>
                ))}
                {mcq.explanation && <p style={{ color: '#666', fontSize: 11, marginTop: 8, borderTop: '1px solid #2a2a4a', paddingTop: 8 }}>💡 {mcq.explanation}</p>}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

const badge = (color) => ({ background: `${color}15`, color, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500 });
const chipStyle = (active) => ({ padding: '6px 14px', borderRadius: 20, border: '1px solid #2a2a4a', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', background: active ? '#00f5ff' : '#141428', color: active ? '#000' : '#b0b0cc' });
const iconBtn = (color) => ({ background: 'transparent', color, border: `1px solid ${color}`, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 });
