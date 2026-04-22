const express = require("express");
const cors = require("cors");
const villages = require("./villages.json");

const app = express();
app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.send("Village API running 🚀");
});

// Pagination
app.get("/villages", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    page,
    limit,
    data: villages.slice(start, end),
  });
});

// Search
app.get("/villages/search", (req, res) => {
  const name = req.query.name?.toLowerCase() || "";

  const results = villages.filter(v =>
    v.village_name.toLowerCase().includes(name)
  );

  res.json(results.slice(0, 50));
});

// Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});