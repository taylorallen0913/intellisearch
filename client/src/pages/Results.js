import React, { Component } from "react";
import Gallery from "react-grid-gallery";

const axios = require("axios");

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
    let localImages = [];
    await axios
      .get("http://localhost:5000/get-images")
      .then(res => {
        console.log(res);
        res.data.forEach(item => {
          localImages.push({
            src: require("../results/vid-matches/" + item),
            thumbnail: require("../results/vid-matches/" + item),
            thumbnailWidth: 350,
            thumbnailHeight: 250
          });
        });
        this.setState({ images: localImages }, () => {
          this.setState({ imagesLoaded: true });
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        {this.state.images.length === 0 ? (
          <h1>Please be patient as the images load.</h1>
        ) : null}
        {this.state.imagesLoaded && this.state.images.length !== 0 ? (
          <Gallery images={this.state.images} />
        ) : null}
      </div>
    );
  }
}
