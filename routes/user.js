const router = require("express").Router();
const connection = require("../mysql");
const { verifyUser } = require("./authMiddleware");

// get all  user
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

// add new user
// router.post("/adduser", (req, res) => {
//   const { name, email } = req.body;

//   const insertQuery = "INSERT INTO users (name, email) VALUES (?, ?)";
//   connection.query(insertQuery, [name, email], (error, results) => {
//     if (error) {
//       console.error("Error inserting user:", error);
//       res.status(500).json({ error: "Error inserting user" });
//     } else {
//       console.log("User inserted successfully");
//       res.json({ message: "User inserted successfully" });
//     }
//   });
// });

// get all posts by a user
router.get("/allpost/:id", verifyUser, (req, res) => {
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

// add new posts
router.post("/addpost/:id", verifyUser, (req, res) => {
  const { title, content } = req.body;
  const author_id = req.params.id;

  const insertQuery =
    "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)";
  connection.query(
    insertQuery,
    [title, content, author_id],
    (error, results) => {
      if (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ error: "Error adding post" });
      } else {
        console.log("Post added successfully");
        res.json({ message: "Post added successfully" });
      }
    }
  );
});

//
module.exports = router;
