import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Upload from "./pages/Upload";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="wrapper">
          <Sidebar />
          <div className="main_content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/upload" component={Upload} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
