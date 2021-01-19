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
  const sql =
    "INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    sql,
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

app.post("/api/reviews", (req, res) => {
  const sql = "INSERT INTO reviews SET ?";
  connection.query(sql, [req.body], (err, status) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "You are an error" });
    } else {
      res.status(200).json(status);
    }
  });
});

// routes : /api/reviews ?
// ou /api/movies/:movieId/reviews ?
// ou encore /api/users/:userId/reviews ?
app.get("/api/movies/:movieId/reviews", (req, res) => {
  connection.query(
    "SELECT * FROM movies WHERE id=?",
    [req.params.movieId],
    (err, movies) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "You are an error" });
      }
      if (movies.length === 0) {
        res.status(404).send({ error: "Movie not found" });
        return;
      }
      const sql = "SELECT * FROM reviews WHERE movie_id=?";
      connection.query(sql, [req.params.movieId], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "You are an error" });
        }
        return res.status(200).json(results);
      });
    }
  );
});

// route pour récupérer les films favoris d'un user
// /api/users/:userId/favorite-movies
app.get("/api/users/:userId/favorite-movies", (req, res) => {
  const sql = `
    SELECT m.* FROM movies m
    JOIN users_like_movies ulm ON m.id = ulm.movie_id
    JOIN users u ON ulm.user_id = u.id
    WHERE u.id = ?
  `;
  connection.query(sql, [req.params.userId], (err, movies) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "You are an error" });
    }
    return res.json(movies);
  });
});

app.listen(port, (err) => {
  if (err) {
    console.error("Warning", err);
  } else {
    console.log("Server running on", port);
  }
});
