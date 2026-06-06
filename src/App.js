import Notifications from "./Notifications";
import Settings from "./Settings";
import UsersManager from "./UsersManager";
import AIValidator from "./AIValidator";
import Dashboard from "./Dashboard";
import AIGenerator from "./AIGenerator";
import MCQManager from './MCQManager';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';

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

const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/ai-generator', icon: '🤖', label: 'AI Generator' },
  { path: '/ai-validator', icon: '🔍', label: 'AI Validator' },
  { path: '/mcq-manager', icon: '📝', label: 'MCQ Manager' },
  { path: '/test-manager', icon: '📋', label: 'Test Manager' },
  { path: '/users', icon: '👥', label: 'Users' },
  { path: '/notifications', icon: '🔔', label: 'Notifications' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigate('/dashboard');
    } catch (e) {
      alert('❌ ' + e.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🎓</div>
        <h1>RPREP Admin</h1>
        <p>Nursing Exam Platform</p>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <button onClick={handleLogin}>🔐 Login</button>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { signOut(auth); navigate('/'); };

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">🎓</div>
          {sidebarOpen && <span className="sidebar-title">RPREP Admin</span>}
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h2>{menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}</h2>
          </div>
          <div className="header-right">
            <span className="header-user">👤 Admin</span>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-screen">⏳ Loading...</div>;

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-generator" element={<AIGenerator />} />
          <Route path="/ai-validator" element={<AIValidator />} />
            <Route path="/mcq-manager" element={<MCQManager />} />
            <Route path="/test-manager" element={<div className="card"><h3>📋 Test Manager</h3><p>Coming soon...</p></div>} />
            <Route path="/users" element={<UsersManager />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div className="stats-grid"><div className="stat-card"><h3>0</h3><p>Total MCQs</p></div></div>} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}

export default App;
