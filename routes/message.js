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
    const itemsPerPage = 10; // Number of messages per page

    const offset = (page - 1) * itemsPerPage;

    const sql = `
    SELECT *
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
          res.status(200).json(results);
        }
      }
    );
  }
);

// test
router.post("/image", (req, res) => {
  const imageFilePath = path.join(__dirname, "..", "Images", "image.jpg");
  const binaryImageData = fs.readFileSync(imageFilePath);
  const insertQuery = "INSERT INTO attachment_blobs (blob_data) VALUES (?)";

  connection.query(insertQuery, [binaryImageData], (error, results) => {
    if (error) {
      console.error("Error inserting image data:", error);
      res.status(500).send("Error inserting image data");
    } else {
      console.log("Image data inserted successfully");
      res.status(200).send("Image data inserted successfully");
    }
  });
});

router.get("/image/:id", (req, res) => {
  const attachmentId = req.params.id;

  const selectQuery = "SELECT blob_data FROM attachment_blobs WHERE id = ?";

  connection.query(selectQuery, [attachmentId], (error, results) => {
    if (error) {
      console.error("Error retrieving image data:", error);
      res.status(500).send("Error retrieving image data");
    } else {
      if (results.length === 0) {
        res.status(404).send("Image data not found");
      } else {
        const binaryImageData = results[0].blob_data;
        res.writeHead(200, {
          "Content-Type": "image/jpeg",
          "Content-Length": binaryImageData.length,
        });
        res.end(binaryImageData);
      }
    }
  });
});

//
module.exports = router;
