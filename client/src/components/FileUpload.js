import React, { Fragment, useState } from "react";
import Progress from "./Progress";
import axios from "axios";

const FileUpload = props => {
  let { type } = props;
  type === "dataset" ? (type = "a video") : (type = "an image");
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose " + type);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      let apiToCall;
      type === "dataset"
        ? (apiToCall = "http://localhost:5000/upload-video")
        : (apiToCall = "http://localhost:5000/upload-image");
      const res = await axios.post(apiToCall, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;

      console.log("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        console.log("There was a problem with the server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label
            className="custom-file-label"
            htmlFor="customFile"
            style={{ width: "30%", marginLeft: "34%" }}
          >
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-lg mt-4 text-center"
          style={{ marginLeft: "45%" }}
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;
