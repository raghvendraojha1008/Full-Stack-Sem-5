// Dummy Express + JWT server (NOT used by the frontend demo).
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET = "dummy-secret";

app.use(cors());
app.use(express.json());

// POST /login  { username, role } -> { token }
app.post("/login", (req, res) => {
  const { username, role } = req.body;
  const token = jwt.sign({ username, role }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.listen(5000, () => console.log("Dummy server on http://localhost:5000"));
