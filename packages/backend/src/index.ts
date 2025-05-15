// @ts-nocheck
import express from 'express';
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(cors({
  origin: [
    'https://super-duper-space-acorn-vxp4ppvjqvjcpqwp-3000.app.github.dev',
    'https://super-duper-space-acorn-vxp4ppvjqvjcpqwp-4000.app.github.dev',
    'http://localhost:3000',
    'http://localhost:4000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Simple mock user DB
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'school', password: 'school123', role: 'school' }
];

// Auth middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, JWT_SECRET);
      req.user = user;
      return next();
    } catch (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

app.get('/', (req, res) => {
  res.send('GPP Hub Backend API is running.');
});

// Add explicit type annotations for in-memory data to avoid implicit any errors
/**
 * @typedef {Object} School
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {boolean} approved
 */
/**
 * @typedef {Object} AccessCode
 * @property {string} code
 * @property {number} schoolId
 */
/**
 * @typedef {Object} Textbook
 * @property {number} id
 * @property {string} title
 * @property {string} url
 */
/** @type {School[]} */
const schools = [];
/** @type {AccessCode[]} */
const accessCodes = [];
/** @type {Textbook[]} */
const textbooks = [];

// 1. School Approvals
app.post('/api/schools', authenticateJWT, (req, res) => {
  const { name, email } = req.body;
  const school = { id: schools.length + 1, name, email, approved: false };
  schools.push(school);
  res.status(201).json(school);
});

app.patch('/api/schools/:id/approve', authenticateJWT, (req, res) => {
  const school = schools.find(s => s.id === parseInt(req.params.id));
  if (!school) return res.status(404).json({ error: 'School not found' });
  school.approved = true;
  res.json(school);
});

// 2. Access Code Generation
app.post('/api/access-codes', authenticateJWT, (req, res) => {
  const { schoolId } = req.body;
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  accessCodes.push({ code, schoolId });
  res.status(201).json({ code });
});

// 3. Textbook Uploads (mock, no file handling)
app.post('/api/textbooks', authenticateJWT, (req, res) => {
  const { title, url } = req.body;
  const textbook = { id: textbooks.length + 1, title, url };
  textbooks.push(textbook);
  res.status(201).json(textbook);
});

// 4. Analytics (mock)
app.get('/api/analytics', authenticateJWT, (req, res) => {
  res.json({ schools: schools.length, textbooks: textbooks.length, accessCodes: accessCodes.length });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
