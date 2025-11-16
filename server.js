const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));
app.use(express.json())
app.get('/leaderboard', (req, res) => {
  const file = req.query.file; // e.g., "chal/typing/leaderboard/leaderboard.txt"
  console.log(`[SERVER] Request leaderboard file: ${file}`);

  if (!file) {
    console.log("[SERVER] No file provided");
    return res.status(400).json([]);
  }

  const filePath = path.join(__dirname, file);
  console.log(`[SERVER] Resolved path: ${filePath}`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("[SERVER] Error reading leaderboard file:", err);
      return res.status(500).json([]);
    }

    console.log(`[SERVER] File contents:\n${data}`);
    const lines = data.trim().split("\n").slice(0, 5);
    const list = lines.map(line => {
      const [name, points] = line.split(",");
      return { name, points };
    });

    console.log("[SERVER] Sending JSON:", list);
    res.json(list);
  });
});

app.get('/leaderboard/:game', (req, res) => {
  const game = req.params.game; // "typing", "binary", etc.
  const filePath = path.join(__dirname, 'chal', game, 'leaderboard', 'leaderboard.txt');
  console.log('Fetching leaderboard file:', filePath);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading leaderboard:', err);
      return res.status(404).send('Leaderboard not found');
    }
    res.send(data); // raw CSV lines
  });
});

app.post("/update-leaderboard", (req, res) => {
    console.log('hello i received update leaderboard')
  const { username, score, gameType } = req.body;
  const filePath = path.join(__dirname, "chal", gameType, "leaderboard", "leaderboard.txt");

let lines = [];
if (fs.existsSync(filePath)) {
  lines = fs.readFileSync(filePath, "utf-8")
            .trim()
            .split("\n")
            .filter(line => line.trim() !== "")  // ignore empty lines
            .map(line => {
              const [name, pts] = line.split(",");
              return { name, score: parseInt(pts) || 0 };

            });
}


  const existing = lines.find(l => l.name === username);
  if (existing) {
    if (score > existing.score) existing.score = score; // update if higher
  } else {
    lines.push({ name: username, score });
  }

  // sort descending
  lines.sort((a,b) => b.score - a.score);

  const output = lines.map(l => `${l.name},${l.score}`).join("\n");
  fs.writeFileSync(filePath, output);

  res.json({ success: true, leaderboard: lines.slice(0,5) });
});

app.post("/clear-leaderboards", (req, res) => {
  const { password } = req.body;
  const crypto = require("crypto");

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const correctHash = "b6444c25e10ad13e4472e9d243c8cc2b4bbe7fc73d79847e13a9d3da22f5b400";

  if (hash !== correctHash) {
    console.log("incorrect password!")
    return res.status(403).json({ success: false, message: "Invalid password" });
  }

  const leaderboardDirs = [
    path.join(__dirname, "chal", "typing", "leaderboard", "leaderboard.txt"),
    path.join(__dirname, "chal", "programming", "leaderboard.txt"),
    path.join(__dirname, "chal", "crypto", "leaderboard.txt"),
    path.join(__dirname, "chal", "logic", "leaderboard.txt")
  ];

  let cleared = [];
  leaderboardDirs.forEach(file => {
    if (fs.existsSync(file)) {
      fs.writeFileSync(file, ""); // empty the file
      cleared.push(path.relative(__dirname, file));
    }
  });

  console.log("[SERVER] Cleared leaderboards:", cleared);
  res.json({ success: true, cleared });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
