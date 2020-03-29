import React, { Component } from "react";
import Gallery from "react-grid-gallery";

const axios = require("axios");

const IMAGES = [
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail:
      "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: true,
    caption: "After Rain (Jeshu John - designerspics.com)"
  },
  {
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    thumbnail:
      "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    tags: [
      { value: "Ocean", title: "Ocean" },
      { value: "People", title: "People" }
    ],
    caption: "Boats (Jeshu John - designerspics.com)"
  },

  {
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail:
      "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212
  }
];

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
          console.log("../results/vid-matches/" + item);
          //item = "screenshot-1.jpeg"
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
        {this.state.images.length == 0 ? (
          <h1>Please be patient as the images load.</h1>
        ) : null}
        {this.state.imagesLoaded && this.state.images.length != 0 ? (
          <Gallery images={this.state.images} />
        ) : null}
      </div>
    );
  }
}
