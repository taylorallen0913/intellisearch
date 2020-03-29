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
      </div>
    );
  }
}
