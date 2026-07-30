import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- MIDDLEWARE AUTH ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(0, 401).json({ message: 'Akses ditolak, token tidak ada' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---
app.post('/api/register', [
  body('email').isEmail().withMessage('Format email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.status(201).json({ message: 'User berhasil mendaftar', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Email sudah terdaftar atau terjadi kesalahan server' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userRes.rows.length === 0) return res.status(400).json({ message: 'Email atau password salah' });

  const user = userRes.rows[0];
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: 'Email atau password salah' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// --- CALIBRATION REQUEST ENDPOINTS ---
app.post('/api/requests', authenticateToken, [
  body('device_name').notEmpty().escape().withMessage('Nama perangkat wajib diisi'),
  body('serial_number').notEmpty().escape().withMessage('Nomor seri wajib diisi')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { device_name, serial_number } = req.body;
  const result = await pool.query(
    'INSERT INTO calibration_requests (user_id, device_name, serial_number) VALUES ($1, $2, $3) RETURNING *',
    [req.user.id, device_name, serial_number]
  );
  res.status(201).json(result.rows[0]);
});

app.get('/api/requests', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM calibration_requests WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});

app.listen(process.env.PORT, () => console.log(`Server Proyek 1 berjalan di port ${process.env.PORT}`));