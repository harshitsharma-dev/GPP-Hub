import React, { useState } from 'react';

const API_URL = 'http://3.7.65.128:4000/api';

function AdminApp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('gpp_jwt') || '');
  const [error, setError] = useState('');

  // Types for dashboard data
  type School = { id: number; name: string; email: string; approved: boolean };
  type Analytics = { schools: number; textbooks: number; accessCodes: number };

  // Dashboard state
  const [schools, setSchools] = useState<School[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [accessCodeSchoolId, setAccessCodeSchoolId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [textbookTitle, setTextbookTitle] = useState('');
  const [textbookUrl, setTextbookUrl] = useState('');
  const [textbookResult, setTextbookResult] = useState('');

  // Fetch schools and analytics on mount
  React.useEffect(() => {
    fetch(`${API_URL}/analytics`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setAnalytics);
    fetch(`${API_URL}/schools`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setSchools);
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('gpp_jwt', data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 320, margin: '2rem auto' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <button type="submit" style={{ width: '100%' }}>Login</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  // Approve school
  const approveSchool = async (id: number) => {
    await fetch(`${API_URL}/schools/${id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    setSchools(schools => schools.map(s => s.id === id ? { ...s, approved: true } : s));
  };

  // Add school
  const addSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/schools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: schoolName, email: schoolEmail })
    });
    const data = await res.json();
    setSchools(schools => [...schools, data]);
    setSchoolName(''); setSchoolEmail('');
  };

  // Generate access code
  const generateAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/access-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ schoolId: Number(accessCodeSchoolId) })
    });
    const data = await res.json();
    setAccessCode(data.code || '');
  };

  // Upload textbook (mock)
  const uploadTextbook = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/textbooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: textbookTitle, url: textbookUrl })
    });
    const data = await res.json();
    setTextbookResult(data.title ? `Uploaded: ${data.title}` : 'Error');
    setTextbookTitle(''); setTextbookUrl('');
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>Welcome, Admin</h2>
      <button onClick={() => { setToken(''); localStorage.removeItem('gpp_jwt'); }}>Logout</button>
      <hr />
      <h3>Schools</h3>
      <form onSubmit={addSchool} style={{ marginBottom: 16 }}>
        <input placeholder="School Name" value={schoolName} onChange={e => setSchoolName(e.target.value)} required />
        <input placeholder="Email" value={schoolEmail} onChange={e => setSchoolEmail(e.target.value)} required />
        <button type="submit">Add School</button>
      </form>
      <table border={1} cellPadding={4} style={{ width: '100%', marginBottom: 16 }}>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Approved</th><th>Action</th></tr></thead>
        <tbody>
          {schools && schools.length > 0 ? schools.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td><td>{s.name}</td><td>{s.email}</td><td>{s.approved ? 'Yes' : 'No'}</td>
              <td>{!s.approved && <button onClick={() => approveSchool(s.id)}>Approve</button>}</td>
            </tr>
          )) : <tr><td colSpan={5}>No schools</td></tr>}
        </tbody>
      </table>
      <h3>Generate Access Code</h3>
      <form onSubmit={generateAccessCode} style={{ marginBottom: 16 }}>
        <input placeholder="School ID" value={accessCodeSchoolId} onChange={e => setAccessCodeSchoolId(e.target.value)} required />
        <button type="submit">Generate</button>
        {accessCode && <span style={{ marginLeft: 8 }}>Code: <b>{accessCode}</b></span>}
      </form>
      <h3>Upload Textbook (Mock)</h3>
      <form onSubmit={uploadTextbook} style={{ marginBottom: 16 }}>
        <input placeholder="Title" value={textbookTitle} onChange={e => setTextbookTitle(e.target.value)} required />
        <input placeholder="URL" value={textbookUrl} onChange={e => setTextbookUrl(e.target.value)} required />
        <button type="submit">Upload</button>
        {textbookResult && <span style={{ marginLeft: 8 }}>{textbookResult}</span>}
      </form>
      <h3>Analytics</h3>
      {analytics ? (
        <ul>
          <li>Schools: {analytics.schools}</li>
          <li>Textbooks: {analytics.textbooks}</li>
          <li>Access Codes: {analytics.accessCodes}</li>
        </ul>
      ) : <div>Loading analytics...</div>}
    </div>
  );
}

export default AdminApp;
