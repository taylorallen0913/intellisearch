import React, { Component } from "react";
import listReactFiles from 'list-react-files'

const axios = require("axios");
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
      await axios.get("http://localhost:5000/get-images")
      .then((res) => {
          console.log(res);
      })
      .catch((err) => {
          console.log(err);
      })
  };

  render() {
    return <div className="container"></div>;
  }
}
