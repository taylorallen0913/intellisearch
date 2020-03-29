import React, { Component } from "react";
import TextyAnim from "rc-texty";

export default class Home extends Component {
  render() {
    return (
      <div className="container">
          <div className="title">
        <TextyAnim
          type="mask-top"
          onEnd={type => {
            console.log(type);
          }}
        >
          Intellisearch
        </TextyAnim>
        </div>
        <div className="subtext">
        Intellisearch is a novel search engine that lets users search through videos for specific faces. This technology will allow law enforcement to locate missing and kidnapped persons much quicker if they have access to large databases of video. Our software uses an advanced facial recognition algorithm to compare the face of a missing person against faces in gathered videos. By being able to see the last known location of a person, it will aid authorities in locating them faster than ever. AI is the our future and may be one of our best weapons against human trafficking.
        </div>
      </div>
    );
  }
}
