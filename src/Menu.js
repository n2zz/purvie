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
          <BrowserRouter>
            <div className="menu_header">
              <div className="menu_head">
                <div className="menu_icon">
                  <img src={logo} className="img_title_icon"></img>
                </div>
                <div className="menu_title">
                  PURVIE
                </div>
              </div>
              <div className="menu1">
                <MenuLink />
              </div>
              <div className="search_group">
                <div className="search">
                  <input type="text" class="search_input" placeholder="Search"/>
                  <div class="search_line"></div>
                  <div class="search_close"></div>
                </div>
              </div>
              <div>
                <Switch> 
                  <Route exact path="/"component={Menu1} />
                  <Route path="/menu1"component={Menu1} />
                  <Route path="/menu2" component={Menu2} />
                </Switch>
              </div>
            </div>
          </BrowserRouter>
        </div>
    );
  }
}

export default Menu;
