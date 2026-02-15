
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));  

const pool = new Pool({
    user: 'admin',
    host: 'db',          
    database: 'requests_db',
    password: 'admin123',
    port: 5432,
});
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await pool.query(
            'INSERT INTO requests (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        res.send('Request submitted successfully!');  
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
