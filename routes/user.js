const router = require("express").Router();
const connection = require("../mysql");

router.get("/allusers", (req, res) => {
  const selectQuery = "SELECT * FROM user";
  connection.query(selectQuery, (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(rows);
  });
});

//
module.exports = router;
