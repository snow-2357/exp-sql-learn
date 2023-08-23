const router = require("express").Router();
const connection = require("../mysql");
const fs = require("fs");
const path = require("path");
const { verifyIndividualUser } = require("../utils/authMiddleware");

// get all  messages
router.get(
  "/all/sender=:id/receiver=:receiverId/:page?",
  verifyIndividualUser,
  (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const page = req.params.page ? parseInt(req.params.page) : 1; // Default to page 1 if not specified
    const itemsPerPage = 10;

    const offset = (page - 1) * itemsPerPage;

    const sql = `
    SELECT message_text, timestamp, image_id
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp
    LIMIT ? OFFSET ?;
  `;

    connection.query(
      sql,
      [senderId, receiverId, receiverId, senderId, itemsPerPage, offset],
      (error, results) => {
        if (error) {
          console.error("Error fetching messages:", error);
          res
            .status(500)
            .json({ error: "An error occurred while fetching messages." });
        } else {
          const modifiedResults = results.map((message) => {
            if (message.image_id) {
              message.image_url = `${req.protocol}://${req.get(
                "host"
              )}/Images/${message.image_id}`;
              delete message.image_id;
            }
            return message;
          });
          res.status(200).json(modifiedResults);
        }
      }
    );
  }
);

module.exports = router;
