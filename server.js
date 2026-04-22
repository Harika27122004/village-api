const express = require("express");
const cors = require("cors");
const villages = require("./villages.json"); 

const app = express();


app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ✅ Home route
app.get("/", (req, res) => {
  res.send("Village API running 🚀");
});

// ✅ Get villages (pagination)
app.get("/villages", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const start = (page - 1) * limit;
  const end = start + limit;

  const data = villages.slice(start, end);

  res.json({
    page,
    limit,
    data,
  });
});

// ✅ Search villages
app.get("/villages/search", (req, res) => {
  const name = req.query.name?.toLowerCase() || "";

  const results = villages.filter((v) =>
    v.village_name.toLowerCase().includes(name)
  );

  res.json(results.slice(0, 50));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});