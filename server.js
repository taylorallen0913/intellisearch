require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const fileUpload = require("express-fileupload");
const extractFrames = require("ffmpeg-extract-frames");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path")

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_BUCKET_NAME;

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
  const dir = "./client/src/uploads/images";
  return fs.readdirSync(dir).length - 1;
};

doExtractFrames = async (vidName, framesPerSec) => {
  const folder = vidName.replace(/\.[^/.]+$/, "");
  const inputPath = "./client/src/uploads/vid.mp4";
  const outputPath = "./client/src/uploads/images/screenshot-%d.jpeg";
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
    var fileName = "./client/src/uploads/images/screenshot-" + i + ".jpeg";
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
  s3.upload(params, function (err, data) {
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
      "./client/src/results/" + folder + "-matches/" + fileName
    );
    return new Promise(function (resolve, reject) {
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
  let dir = "./client/src/results/" + folder + "-matches";
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
    client.compareFaces(params, function (err, response) {
      if (err) {
        console.log(err)
      } else {
        response.FaceMatches.forEach(data => {
          let position = data.Face.BoundingBox;
          let similarity = data.Similarity;
          console.log(
            `The face in photo ${name} matches with ${similarity}% confidence`
          );
          downloadFile(name, folder);
        });
      }
    });
  }
};


// Upload Video
app.post("/upload-video", (req, res) => {
  console.log("Splitting videos into frames and compressing...")
  console.log("Video uploading starting...");
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  file.mv(`${__dirname}/client/src/uploads/vid.mp4`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    
    setTimeout(() => {
      doExtractFrames("vid.mp4", 2);
    }, 1000);

    
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

// Upload Image
app.post("/upload-image", (req, res) => {
  console.log("Image successfully uploaded.");
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/src/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    imageName = file.name;
    let path = './client/src/uploads/' + file.name;
    uploadFile(path, file.name);

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });

  });
});

app.get("/get-images", async (req, res) => {
  const path = "./client/src/results/vid-matches/";

  fs.readdir(path, (err, items) => {
    console.log(items)
    res.send(items);
  })
})

app.post("/clear-images", async (req, res) => {
  const directory = './client/src/results/vid-matches';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
})

app.listen(5000, () => console.log("Server Started..."));
