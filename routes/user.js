const router = require("express").Router();
const connection = require("../mysql");

router.get("/allusers", (req, res) => {
  const selectQuery = "SELECT * FROM users";
  connection.query(selectQuery, (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(rows);
  });
});

router.post("/adduser", (req, res) => {
  const { name, email } = req.body;

  const insertQuery = "INSERT INTO users (name, email) VALUES (?, ?)";
  connection.query(insertQuery, [name, email], (error, results) => {
    if (error) {
      console.error("Error inserting user:", error);
      res.status(500).json({ error: "Error inserting user" });
    } else {
      console.log("User inserted successfully");
      res.json({ message: "User inserted successfully" });
    }
  });
});

router.get("/allpost/:id", (req, res) => {
  const userId = req.params.id;
  const selectQuery = `
      SELECT users.username as author,posts.*
      FROM posts
      JOIN users ON posts.author_id = users.id
      WHERE users.id = ?
    `;
  connection.query(selectQuery, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching posts:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(rows);
  });
});
//
module.exports = router;
