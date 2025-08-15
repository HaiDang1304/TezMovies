import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import { OAuth2Client } from 'google-auth-library';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Chỉ định origin của React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Cho phép gửi cookie
  optionsSuccessStatus: 200 // Đảm bảo phản hồi OPTIONS thành công
}));

app.use(bodyParser.json());

// Session
app.use(session({
  secret: 'secret-key', // đổi thành chuỗi bảo mật
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // để true nếu dùng HTTPS
}));

// Google OAuth Client ID
const CLIENT_ID = '685737935777-maqlvjhft09oistl0e1jdm54m1m02fee.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tezmovies'
});
db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected...');
});

// Xử lý preflight request
app.options('/auth/google', cors());

// API Google Login
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Lưu hoặc cập nhật user
    const sql = `
      INSERT INTO users (google_id, name, email, avatar) 
      VALUES (?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE name=?, email=?, avatar=?`;
    db.query(sql, [sub, name, email, picture, name, email, picture], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }

      // Lưu session user_id
      req.session.user_id = sub;

      res.json({ message: 'Login success' });
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// API lấy thông tin user từ session
app.get('/auth/me', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  db.query('SELECT name, email, avatar FROM users WHERE google_id = ?',
    [req.session.user_id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(results[0]);
    });
});

// API Logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));  