const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ensure greetings table exists
pool.query(`
  CREATE TABLE IF NOT EXISTS greetings (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).catch(console.error);

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    try {
      await pool.query('SELECT 1');
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', db: 'connected' }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ status: 'error', db: 'disconnected', error: err.message }));
    }
  } else if (req.url === '/hello' && req.method === 'GET') {
    try {
      const result = await pool.query(
        'INSERT INTO greetings (message) VALUES ($1) RETURNING *',
        ['Hello, World!']
      );
      res.writeHead(200);
      res.end(JSON.stringify(result.rows[0]));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  } else if (req.url === '/greetings' && req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM greetings ORDER BY created_at DESC');
      res.writeHead(200);
      res.end(JSON.stringify(result.rows));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
