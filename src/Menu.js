import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Route } from "react-router-dom";
import logo from "./images/logo-square.png";
import App from "./App";
import Menu1 from "./Menu1";
import MenuLink from "./MenuLink";

const title = "PURVIE";

class Menu extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <link
            rel="icon"
            type="image/png"
            href={logo}
            sizes="16x16"
            alt="favicon"
          />
        </Helmet>
        <div>
          <img src={logo} align="left" width="50" height="50"></img>
          <h1>PURVIE</h1>
        </div>
        <MenuLink />
        <Route path="/" component={Menu1} />
        <Route path="/menu1" component={Menu1} />
      </div>
    );
  }
}

export default Menu;
