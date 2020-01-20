import React, { Component } from "react";
import { BrowserRouter, Route} from "react-router-dom";
import Menu1Link from "./Menu1Link";
import App from "./App";

class Menu1 extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Menu1Link />
            <Route exact path="/" component={App} />
            <Route exact path="/menu1" component={App} />
            <Route path="/menu1/boxoffice/:genre" component={App} />
            <Route path="/menu1/movie/:genre" component={App} />
        </BrowserRouter>
      </div>
    );
  }
}

export default Menu1;
