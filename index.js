const express = require("express");
const connection = require("./connection");

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * FROM movies", (err, results) => {
    if (err) {
      res.status(500).send({ error: "You are an error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// 3 propriétés de l'objet Request (req)
// -> params : pour récupérer paramètres "dans l'URL" : /api/movies/:id => req.params.id
// -> query : pour récupérer paramètres passés "derrière l'URL" /api/movies?year=1975 => req.query.year
// -> body : pour récupérer des données de formulaires

// { "title": "Bienvenue à Gattaca", "director": "Someone", "year": "1997", "color": true, "duration": 120 }
app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, status) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: "You are an error" });
      } else {
        res.status(200).json(status);
      }
    }
  );
});

app.listen(port, (err) => {
  if (err) {
    console.error("Warning", err);
  } else {
    console.log("Server running on", port);
  }
});
