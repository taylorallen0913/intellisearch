require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const fileUpload = require("express-fileupload");
const extractFrames = require("ffmpeg-extract-frames");
const cors = require("cors");
const app = express();
const fs = require("fs");

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

const s3 = new AWS.S3({});

getFrames = async () => {
  console.log("getting frames...");
  const dir = "./client/public/uploads/images";
  return fs.readdirSync(dir).length - 1;
};

doExtractFrames = async (vidName, framesPerSec) => {
  const inputPath = "./client/public/uploads/" + vidName;
  const outputPath = "./client/public/uploads/images/screenshot-%d.jpeg";
  await extractFrames({
    input: inputPath,
    output: outputPath,
    fps: framesPerSec
  });
  await uploadAll();
};

uploadAll = async () => {
  console.log("Uploading all...");
  const frames = await getFrames();
  for (let i = 1; i < frames + 1; i++) {
    var fileName = "./client/public/uploads/images/screenshot-" + i + ".jpeg";
    console.log(fileName);
    await uploadFile(fileName);
  }
};

uploadFile = fileName => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET,
    Key: fileName, // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    setTimeout(() => {
      doExtractFrames(file.name, 2);
    }, 1000);

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.listen(5000, () => console.log("Server Started..."));
