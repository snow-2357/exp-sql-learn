const router = require("express").Router();
const connection = require("../mysql");
const { verifyUser, verifyIndividualUser } = require("../utils/authMiddleware");

// get all  user
// router.get("/allusers", (req, res) => {
//   const selectQuery = "SELECT * FROM users";
//   connection.query(selectQuery, (err, rows) => {
//     if (err) {
//       console.error("Error fetching users:", err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//     res.status(200).json(rows);
//   });
// });

// get all posts by a user
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

// self posted posts
router.get("/allpost", verifyUser, (req, res) => {
  const userId = req.userId;
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
router.post("/addpost", verifyUser, (req, res) => {
  const { title, content } = req.body;
  const author_id = req.userId;
  // const author_id = req.params.id;

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
