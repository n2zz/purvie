import React, { Component } from "react";
import { BrowserRouter, Route} from "react-router-dom";
import Menu1Link from "./Menu1Link";
import MainStillcutSlider from "./MainStillcutSlider"
import App from "./App";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    return promiseInProgress &&
        <div style={{
          width: "100%",
          height: "100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        >
          <Loader type="ThreeDots" color="#777" height="50" width="50" />
        </div>
};


class Menu1 extends Component {
  render() {
    return (
      <div>
        <MainStillcutSlider/>
        <BrowserRouter>
          <Menu1Link />
            <Route exact path="/" component={App} />
            <Route exact path="/menu1" component={App} />
            <Route path="/menu1/boxoffice/:genre" component={App} />
            <Route path="/menu1/movie/:genre" component={App} />
            <LoadingIndicator/>
        </BrowserRouter>
      </div>
    );
  }
}

export default Menu1;
