import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Get all exercises
app.get('/exercises', async (req, res) => {
  try {
    console.log('Fetching all exercises');
    const { rows: exercises } = await pool.query('SELECT * FROM exercises');
    console.log(exercises);
    res.json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Add new exercise via GET request
app.get('/add-exercise', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Exercise name is required' });
  }
  try {
    await pool.query('INSERT INTO exercises (exercise_name) VALUES ($1)', [name]);
    res.json({ success: true, message: 'Exercise added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add exercise' });
  }
});

app.get('/schedule', async (req, res) => {
  const { day } = req.query;
  try {
    const query = `
      SELECT s.exercise_id, e.exercise_name
      FROM schedule s
      JOIN exercises e ON s.exercise_id = e.exercise_id
      WHERE s.day_of_week = $1
    `;
    const { rows: schedule } = await pool.query(query, [day]);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

app.get('/sessions', async (req, res) => {
  const { date } = req.query;
  try {
    const query = `
      SELECT s.*, e.exercise_name
      FROM sessions s
      JOIN exercises e ON s.exercise_id = e.exercise_id
      WHERE s.exercise_date = $1
    `;
    const { rows: sessions } = await pool.query(query, [date]);
    console.log(sessions);
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Add or update a session
app.post('/sessions', async (req, res) => {
  const { exercise_id, exercise_date, set_1, set_2, set_3 } = req.body;
  try {
    await pool.query('BEGIN');
    await pool.query(
      `
      INSERT INTO sessions (exercise_id, exercise_date, set_1, set_2, set_3)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (exercise_id, exercise_date)
      DO UPDATE SET set_1 = EXCLUDED.set_1, set_2 = EXCLUDED.set_2, set_3 = EXCLUDED.set_3
      `,
      [exercise_id, exercise_date, set_1, set_2, set_3]
    );
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to log session' });
  }
});


// Update schedule for a day
app.post('/schedule', async (req, res) => {
  const { day, exercise_ids } = req.body;
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM schedule WHERE day_of_week = $1', [day]);
    for (const id of exercise_ids) {
      await pool.query('INSERT INTO schedule (day_of_week, exercise_id) VALUES ($1, $2)', [day, id]);
    }
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});



app.listen(4000, () => console.log('Server running at http://localhost:4000'));
