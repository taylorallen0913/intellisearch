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
        <FileUpload />
      </div>
    );
  }
}
