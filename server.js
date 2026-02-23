
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'requests_db',
  password: process.env.POSTGRES_PASSWORD || 'admin123',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await pool.query(
      'INSERT INTO requests(name, email, message) VALUES($1, $2, $3)',
      [name, email, message]
    );
    res.send('Request submitted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving request');
  }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, 'contacts.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'portfolio.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});
  