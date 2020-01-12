import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Menu1Link from "./Menu1Link";
import App from "./App";

class Menu1 extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Menu1Link />
          <Switch>
            <Route path="/" component={App} />
            <Route path="/app/:section" component={App} />
            <Route path="/app/:section/:genre" component={App} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default Menu1;
