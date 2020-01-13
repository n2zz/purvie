import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import logo from "./images/logo-square.png";
import App from "./App";
import Menu1 from "./Menu1";
import Menu2 from "./Menu2";
import MenuLink from "./MenuLink";
import "./Menu.css";

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
        <div className="menu_head">
          <div className="menu_icon">
            <img src={logo} className="img_title_icon"></img>
          </div>
          <div className="menu_title">
            PURVIE
          </div>
        </div>
          <BrowserRouter>
            <MenuLink />
            <Switch> 
              <Route exact path="/"component={Menu1} />
              <Route path="/menu1"component={Menu1} />
              <Route path="/menu2" component={Menu2} />
              <Route path="/menu3" component={Menu1} />
              <Route path="/menu6" component={Menu1} />
            </Switch>
            
          </BrowserRouter>
      </div>
    );
  }
}

export default Menu;
