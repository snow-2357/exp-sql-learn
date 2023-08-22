const router = require("express").Router();
const uuid = require("uuid");
const path = require("path");

router.post("/attachment", async (req, res) => {
  if (!req.files || !req.files.attachment) {
    return res.status(400).json({ message: "No attachment provided." });
  }

  const attachmentFile = req.files.attachment;
  const originalFilename = attachmentFile.name;
  const fileExtension = path.extname(originalFilename);
  const attachment = uuid.v4() + fileExtension;
  const attachmentPath = path.join(__dirname, "..", "Images", attachment);

  attachmentFile.mv(attachmentPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error uploading attachment." });
    }

    console.log("Attachment uploaded:", attachmentPath);
    return res.status(200).json(attachment);
  });
});

module.exports = router;
