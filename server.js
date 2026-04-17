const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

//  Home route
app.get("/", (req, res) => {
  res.send("Village API is running 🚀");
});

//  PAGINATION API
app.get("/villages", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM villages ORDER BY village_code LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      page,
      limit,
      data: result.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//  SEARCH API
app.get("/villages/search", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "name query is required" });
    }

    const result = await pool.query(
      "SELECT * FROM villages WHERE village_name ILIKE $1 LIMIT 50",
      [`%${name}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 🚀 SERVER START
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});