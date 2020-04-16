import React, { Component } from "react";
import Gallery from "react-grid-gallery";
import RefreshIcon from "react-ionicons/lib/IosRefresh"
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
    this.refresh()
  }

  refresh = () => {
    this.getImages();
  }

  clearImages = async () => {
    await axios
      .post("http://localhost:5000/clear-images")
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  getImages = async () => {
    let localImages = [];
    await axios
      .get("http://localhost:5000/get-images")
      .then(res => {
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
        <nav class="navbar fixed-bottom navbar-light bg-light" style={{ marginLeft: "200px" }}>
          <button type="button" class="btn btn-primary btn-lg" onClick={() => this.refresh()}><RefreshIcon fontSize="30px" style={{marginTop: "-2%"}} /> Refresh</button>
          <button type="button" class="btn btn-primary btn-lg" onClick={() => this.clear()}>Clear Images</button>
        </nav>
      </div>
    );
  }
}
