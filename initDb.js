import { pool } from './db.js';

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS calibration_requests (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      device_name VARCHAR(255) NOT NULL,
      serial_number VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(queryText);
  console.log("Tabel berhasil dibuat!");
  process.exit();
};

createTables();