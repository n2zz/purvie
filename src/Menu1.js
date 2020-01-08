import React, { Component } from "react";
import { Route } from "react-router-dom";
import Menu1Link from "./Menu1Link";
import App from "./App";

class Menu extends Component {
  render() {
    return (
      <div>
        <Menu1Link />
        <Route exact path="/" component={App} />
        <Route path="/submenu1/" component={App} />
        <Route path="/submenu2/" component={App} />
      </div>
    );
  }
}

export default Menu;
