import React from "react";
import { Link } from "react-router-dom";
import "./MenuLink.css";

const Menu2Link = () => {
  return (
    <div id="mdiv_sub_menu">
      <ul>
        <li>
          <Link to="/submenu1" className="menu_link_sub_li_style">Top Blog</Link>
        </li>
        <li>
          <Link to="/submenu2" className="menu_link_sub_li_style">내블로그</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu2Link;
