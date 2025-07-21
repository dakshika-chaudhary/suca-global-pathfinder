// //  # PostgreSQL connection

// import {Pool} from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// src/db.ts or wherever you connect

import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // 👈 Render requires this
  },
});

