import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "This is my root route" });
});

app.get("/data", async (req, res) => {
  const board = req.query.board;
  if (!board) {
    return res.status(400).json({ error: "Board is required" });
  }
  const query = await db.query("SELECT * FROM data WHERE board = $1", [board]);
  res.json(query.rows);
});

app.post("/add-data", async (req, res) => {
  const { name, location, message_post, board } = req.body;

  // Validate inputs
  if (!name || !location || !message_post || !board) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO data(name, location, message_post, likes, board, timestamp)
      VALUES ($1, $2, $3, 0, $4, CURRENT_TIMESTAMP) RETURNING *`,
      [name, location, message_post, board]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/data/:id/like", async (req, res) => {
  const { id } = req.params;
  const result = await db.query(
    "UPDATE data SET likes = likes + 1 WHERE id = $1 RETURNING *",
    [id]
  );
  res.json(result.rows[0]);
});

app.delete("/data/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM data WHERE id = $1", [id]);
  res.json({ status: "Message deleted" });
});
