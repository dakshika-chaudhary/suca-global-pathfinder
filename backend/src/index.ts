//  Main server

import express from 'express';
import cors from 'cors';
import { pool } from './db';
import pathRouter from './routes/path';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/shortestPath', pathRouter);

app.get('/',(req,res)=>
    res.send('SUCA Backend is running')
);

app.listen(5000,()=>{
    console.log('Server listening on port 5000')
});

app.get('/nodes',async(req,res)=>{
  try{
     const result = await pool.query('SELECT * FROM nodes');
     res.json(result.rows);
  }
  catch(error){
      console.error(error);
    res.status(500).send('Error fetching nodes');
  }
});

app.get('/edges',async(req,res)=>{
    try{
      const result = await pool.query('SELECT *FROM edges');
      res.json(result.rows);
    }
    catch(error){
         console.error(error);
    res.status(500).send('Error fetching edges');
    }
})

