require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todoapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 50
});

app.get('/ping', (_req, res) => {
  res.send('pong');
})

app.get('/api/todos', async (req, res) => {
  try {
    const [todos] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
    console.error(error);
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO todos (text, completed) VALUES (?, ?)',
      [req.body.text, false]
    );
    const [todo] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(todo[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
    console.error(error);
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE todos SET completed = ? WHERE id = ?',
      [req.body.completed, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    const [todo] = await pool.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    res.json(todo[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
    console.error(error);
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
