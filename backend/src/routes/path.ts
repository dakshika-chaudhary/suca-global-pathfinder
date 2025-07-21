

import express from 'express';
import { pool } from '../db';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

router.post('/shortest-path', async (req, res) => {
  console.log('BODY:', req.body);
   const { source, destination } = req.body;

  const src = source.trim().toLowerCase();
const dest = destination.trim().toLowerCase();


  try {
    const result = await pool.query('SELECT * FROM edges');
    const edges = result.rows;

    const edgeLines = edges.map(e =>
      `${e.from_node} ${e.to_node} ${e.weight} ${e.safe ? 1 : 0} ${e.shaded ? 1 : 0} ${e.accessible ? 1 : 0} ${e.traffic}`
    );

   const input = [
  `${edges.length}`,
  src,
  dest,
  ...edgeLines
].join('\n');

    

    const executablePath = path.join(__dirname, '../../dijkstra/dijkstra.exe');
    const dijkstra = spawn(executablePath);

    let output = '';
    dijkstra.stdout.on('data', data => {
      output += data.toString();
    });

    dijkstra.stderr.on('data', data => {
      console.error('Dijkstra Error:', data.toString());
    });

    dijkstra.stdin.write(input);
    dijkstra.stdin.end();

    dijkstra.on('close', () => {
      res.json({ result: output.trim() });
    });

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
