import React from "react";
import { Link } from "react-router-dom";
import "./MenuLink.css";

const MenuLink = () => {
  return (
    <div id="mdiv">
      <ul>
        <li>
          <Link to="/menu1" className="menu_link_li_style">HOME</Link>
        </li>
        <li>
          <Link to="/menu2" className="menu_link_li_style">REVIEW</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuLink;
