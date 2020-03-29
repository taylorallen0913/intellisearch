import React, { Component } from "react";
import FileUpload from "../components/FileUpload";

export default class Upload extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    
    return (
      <div>
        <h1 className="subtitle">Upload</h1>
        <h1 className="info-text">Update your dataset</h1>
        <FileUpload type="dataset"/>
        <h1 className="info-text">Update your reference images</h1>
        <FileUpload type="reference"/>
      </div>
    );
  }
}
