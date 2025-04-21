const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

// CORS setup to allow all origins or specify specific ones for more security
app.use(cors()); // Allows requests from any origin
app.use(bodyParser.json());
app.use(express.static('public'));

// Handle POST request to save note
app.post('/add-note', (req, res) => {
  const note = req.body.note;
  db.query('INSERT INTO notes (note) VALUES (?)', [note], (err) => {
    if (err) {
      console.error("Error saving note:", err); // Log the error on the server side
      return res.status(500).send("Failed to save the note.");
    }
    res.send("Note added!");
  });
});

// Handle GET request to retrieve notes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err); // Log the error on the server side
      return res.status(500).send("Failed to fetch notes.");
    }
    res.json(results);
  });
});

// Start server
app.listen(3000, () => {
  console.log("🎤 Voice Note Keeper Server is Running!");
});
