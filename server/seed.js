import { db } from "./server.js";

db.query(`CREATE TABLE IF NOT EXISTS data (
    id SERIAL PRIMARY KEY,
    name TEXT,
    location TEXT,
    message_post VARCHAR(255),
    likes INT DEFAULT 0,
    board TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

db.query(`INSERT INTO data(name, location, message_post, likes, board, timestamp) 
    VALUES ('Bob Geldof', 'Ireland', 'I Don\'t like Mondays', 0, 'chat', CURRENT_TIMESTAMP)`);
db.query(`INSERT INTO data(name, location, message_post, likes, board, timestamp) 
    VALUES ('Jane Doe', 'USA', 'Remember to stay hydrated!', 0, 'health-and-wellness', CURRENT_TIMESTAMP)`);
db.query(`INSERT INTO data(name, location, message_post, likes, board, timestamp) 
    VALUES ('John Smith', 'UK', 'Always ask questions!', 0, 'advice', CURRENT_TIMESTAMP)`);
