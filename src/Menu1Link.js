import React from "react";
import { NavLink } from "react-router-dom";
import "./MenuLink.css";

const Menu1Link = () => {
  return (
    <div id="mdiv_sub_menu">
      <ul>
        <li>
          <NavLink to="/menu1/movie/코미디" className="menu_link_sub_li_style" activeClassName="active">코미디</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/액션" className="menu_link_sub_li_style" activeClassName="active">액션</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/모험" className="menu_link_sub_li_style" activeClassName="active">모험</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/애니메이션" className="menu_link_sub_li_style" activeClassName="active">애니메이션</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/로맨스" className="menu_link_sub_li_style" activeClassName="active">로맨스</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/공포" className="menu_link_sub_li_style" activeClassName="active">공포</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu1Link;
