import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

dotenv.config(); // Load environment variables from .env file

// Setup PostgreSQL database connection
const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
  ssl: {
    require: true,
    rejectUnauthorized: false, // Ensure SSL is handled properly
  },
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

// Endpoint to fetch messages based on board type
app.get("/data", async (req, res) => {
  const board = req.query.board; // Get the board name from the query parameter
  if (!board) {
    return res.status(400).json({ error: "Board is required" }); // Error if board is not provided
  }
  try {
    const query = await db.query('SELECT * FROM data WHERE board = $1', [board]);
    res.json(query.rows); // Send the retrieved rows as a response
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" }); // Internal server error
  }
});

// Endpoint to add a new message
app.post("/add-data", async (req, res) => {
  const { name, location, message_post, board } = req.body; // Extract data from the request body

  // Validate inputs
  if (!name || !location || !message_post || !board) {
    return res.status(400).json({ error: "All fields are required" }); // Error if any field is missing
  }

  try {
    const result = await db.query(
      `INSERT INTO data(name, location, message_post, likes, board, timestamp)
      VALUES ($1, $2, $3, 0, $4, CURRENT_TIMESTAMP) RETURNING *`,
      [name, location, message_post, board]
    );
    res.json(result.rows[0]); // Send the newly created message as a response
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" }); // Internal server error
  }
});

// Endpoint to like a message
app.post("/data/:id/like", async (req, res) => {
  const { id } = req.params; // Get the message ID from the URL parameters
  try {
    const result = await db.query(
      'UPDATE data SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" }); // Error if message is not found
    }
    res.json(result.rows[0]); // Send the updated message back to the client
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" }); // Internal server error
  }
});

// Endpoint to delete a message
app.delete("/data/:id", async (req, res) => {
  const { id } = req.params; // Get the message ID from the URL
  try {
    const result = await db.query('DELETE FROM data WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Message not found" }); // Error if message is not found
    }
    res.json({ status: "Message deleted" }); // Respond with a confirmation message
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" }); // Internal server error
  }
});

// Centralized error handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!'); // Handle any unhandled errors
});