require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

const ID = "AKIAJZWJTDZWPTHBFAGQ";
const SECRET = "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";
const REGION = "us-west-1";
const BUCKET = "intellisearch";

app.use(cors());

app.use(fileUpload());

AWS.config.update({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: REGION
});

// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
  
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
  
      res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
  });

app.listen(5000, () => console.log("Server Started..."));
