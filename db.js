
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Default for XAMPP
  database: 'voice_notes_db'
});

db.connect((err) => {
  if (err) console.error('MySQL connection failed:', err);
  else console.log('Connected to MySQL ✅');
});

module.exports = db;
