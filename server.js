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

let imageName;

getFrames = async () => {
  console.log("getting frames...");
  const dir = "./client/public/uploads/images";
  return fs.readdirSync(dir).length - 1;
};

doExtractFrames = async (vidName, framesPerSec) => {
  const folder = vidName.replace(/\.[^/.]+$/, "");
  const inputPath = "./client/public/uploads/" + vidName;
  const outputPath = "./client/public/uploads/images/screenshot-%d.jpeg";
  await extractFrames({
    input: inputPath,
    output: outputPath,
    fps: framesPerSec
  });
  await uploadAll(folder);
};

uploadAll = async folder => {
  console.log("Uploading all...");
  const frames = await getFrames();
  for (let i = 1; i < frames + 1; i++) {
    var fileName = "./client/public/uploads/images/screenshot-" + i + ".jpeg";
    var shortName = folder + "images/screenshot-" + i + ".jpeg";
    console.log(fileName);
    await uploadFile(fileName, shortName);
  }
  compareAll(folder, frames);
};

uploadFile = (fileName, shortName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET,
    Key: shortName, // File name you want to save as in S3
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

downloadFile = (fileName, folder) => {
  try {
    const params = {
      Bucket: BUCKET,
      Key: folder + "images/" + fileName
    };
    var file = require("fs").createWriteStream(
      "./client/public/" + folder + "-matches/" + fileName
    );
    return new Promise(function(resolve, reject) {
      resolve(
        new AWS.S3({
          apiVersion: "2006-03-01"
        })
          .getObject(params)
          .createReadStream()
          .pipe(file)
      );
    });
  } catch (error) {
    console.error(
      "Error while getting file from s3 bucket.",
      error,
      error.stack
    );
  }
};

compareAll = async (folder, frames) => {
  let dir = "./client/public/" + folder + "-matches";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  for (let i = 1; i <= frames; i++) {
    let name = "screenshot-" + i + ".jpeg";
    const client = new AWS.Rekognition();
    const params = {
      SourceImage: {
        S3Object: {
          Bucket: BUCKET,
          Name: imageName
        }
      },
      TargetImage: {
        S3Object: {
          Bucket: BUCKET,
          Name: folder + "images/" + name
        }
      },
      SimilarityThreshold: 70
    };
    client.compareFaces(params, function(err, response) {
      if (err) {
        //console.log(err, err.stack); // an error occurred
      } else {
        response.FaceMatches.forEach(data => {
          let position = data.Face.BoundingBox;
          let similarity = data.Similarity;
          console.log(
            `The face in photo ${name} matches with ${similarity}% confidence`
          );
          downloadFile(name, folder);
          //moveFile(name);
          //matchList.push(params.TargetImage.S3Object.Name);
        }); // for response.faceDetails
      } // if
    });
  }
};

// Upload Video
app.post("/upload-video", (req, res) => {
  console.log("VIDEO");
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

// Upload Image
app.post("/upload-image", (req, res) => {
  console.log("IMAGES");
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  // Do what you were going to do with the image in this function

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    imageName = file.name;
    let path = './client/public/uploads/' + file.name;
    uploadFile(path, file.name);

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    
  });
});

app.listen(5000, () => console.log("Server Started..."));
