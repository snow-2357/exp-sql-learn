const router = require("express").Router();
const connection = require("../mysql");

// get all  messages
router.get("/all/sender=:senderId/receiver=:receiverId", (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;

  const sql = `
      SELECT *
      FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp;
    `;

  connection.query(
    sql,
    [senderId, receiverId, receiverId, senderId],
    (error, results) => {
      if (error) {
        console.error("Error fetching messages:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching messages." });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//
module.exports = router;
