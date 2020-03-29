import React, { Component } from "react";
import ImageUpload from "../components/ImageUpload";
import VideoUpload from "../components/VideoUpload";

export default class Upload extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <h1 className="subtitle">Upload</h1>
        <h1 className="info-text">Update your dataset</h1>
        <VideoUpload />
        <h1 className="info-text">Update your reference images</h1>
        <ImageUpload />
      </div>
    );
  }
}
