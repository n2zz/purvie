import React from "react";
import { Link } from "react-router-dom";
import "./MenuLink.css";

const MenuLink = () => {
  return (
    <div id="mdiv">
      <ul>
        <li>
          <Link to="/menu1">PURVIE</Link>
        </li>
        <li>
          <Link to="/menu2">PURPlog</Link>
        </li>
        <li>
          <Link to="/menu3">PUReview</Link>
        </li>
        <li>
          <Link to="/menu6">MY</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuLink;
