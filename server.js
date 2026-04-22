const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();

// ✅ CORS 
app.use(cors());

app.use(express.json());

let villages = [];

// ✅ LOAD CSV DATA
fs.createReadStream("villages_final_clean.csv")
  .pipe(csv())
  .on("data", (row) => {
    villages.push({
      village_code: parseInt(row.village_code),
      village_name: row.village_name,
      subdistrict_code: parseInt(row.subdistrict_code),
    });
  })
  .on("end", () => {
    console.log("✅ CSV LOADED:", villages.length);
  })
  .on("error", (err) => {
    console.error("❌ CSV ERROR:", err);
  });

// ✅ HOME ROUTE
app.get("/", (req, res) => {
  res.send("Village API running 🚀");
});

// ✅ PAGINATION
app.get("/villages", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const start = (page - 1) * limit;
  const end = start + limit;

  const data = villages.slice(start, end);

  res.json({
    page,
    limit,
    total: villages.length,
    data,
  });
});

// ✅ SEARCH
app.get("/villages/search", (req, res) => {
  const name = req.query.name?.toLowerCase() || "";

  const results = villages.filter((v) =>
    v.village_name.toLowerCase().includes(name)
  );

  res.json(results.slice(0, 50));
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});