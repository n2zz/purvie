import React from "react";
import { NavLink } from "react-router-dom";
import "./MenuLink.css";

const MenuLink = () => {
  return (
    <div id="mdiv">
      <ul>
        <li>
          <NavLink to="/menu1" className="menu_link_li_style" activeClassName="active">HOME</NavLink>
        </li>
        <li>
          <NavLink to="/menu2" className="menu_link_li_style" activeClassName="active">REVIEW</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MenuLink;
