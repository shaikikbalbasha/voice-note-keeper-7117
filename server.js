
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/add-note', (req, res) => {
  const note = req.body.note;
  db.query('INSERT INTO notes (note) VALUES (?)', [note], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Note added!");
  });
});

app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("🎤 Voice Note Keeper Server is Running!");

});
