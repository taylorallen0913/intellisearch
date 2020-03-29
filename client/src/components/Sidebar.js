import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <h2 style={{ fontSize: "1.4em" }}>Intellisearch</h2>
        <ul>
          <Link to="/">
            <li>
              <a>Home</a>
            </li>
          </Link>
          <Link to="/upload">
            <li>
              <a>Upload</a>
            </li>
          </Link>
        </ul>
      </div>
    );
  }
}
