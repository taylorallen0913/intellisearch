import React, { Component } from "react";
import listReactFiles from 'list-react-files'

const ImageGallery = require("react-image-gallery");
const path = require("path");

export default class Results extends Component {
  constructor() {
    super();
    this.state = {
      images: [],
      imagesLoaded: false
    };
  }

  componentDidMount() {
    this.getImages();
  }

  getImages = async () => {
    const basePath = "../../public/results/";
    listReactFiles(basePath).then(files => console.log(files))
    this.setState({ imagesLoaded: true });
  };

  render() {
    return <div className="container"></div>;
  }
}
