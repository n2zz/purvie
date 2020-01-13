import React from "react";
import { Link } from "react-router-dom";
import "./MenuLink.css";

const MenuLink = () => {
  return (
    <div id="mdiv">
      <ul>
        <li>
          <Link to="/menu1" className="menu_link_li_style">PURVIE</Link>
        </li>
        <li>
          <Link to="/menu2" className="menu_link_li_style">PURPlog</Link>
        </li>
        <li>
          <Link to="/menu3" className="menu_link_li_style">PUReview</Link>
        </li>
        <li>
          <Link to="/menu6" className="menu_link_li_style">MY</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuLink;
