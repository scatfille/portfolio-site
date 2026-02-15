
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
  user: 'admin',
  host: 'db',
  database: 'requests_db',
  password: 'admin123',
  port: 5432,
});

app.post('/submit', async (req, res) => {
  const { name, message } = req.body;
  try {
    await pool.query(
      'INSERT INTO requests(name, message) VALUES($1, $2)',
      [name, message]
    );
    res.send('Request submitted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving request');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
