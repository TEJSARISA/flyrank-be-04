-- Initial database schema
-- This runs automatically when the Postgres container first starts

CREATE TABLE IF NOT EXISTS greetings (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
