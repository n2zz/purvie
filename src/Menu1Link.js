import React from "react";
import { NavLink } from "react-router-dom";
import "./MenuLink.css";

const Menu1Link = () => {
  return (
    <div id="mdiv_sub_menu">
      <ul>
        <li>
          <NavLink to="/menu1/movie/COMEDY" className="menu_link_sub_li_style" activeClassName="active">코미디</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/ACTION" className="menu_link_sub_li_style" activeClassName="active">액션</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/ADVENTURE" className="menu_link_sub_li_style" activeClassName="active">모험</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/ANIMATION" className="menu_link_sub_li_style" activeClassName="active">애니메이션</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/ROMANCE" className="menu_link_sub_li_style" activeClassName="active">로맨스</NavLink>
        </li>
        <li>
          <NavLink to="/menu1/movie/HORROR" className="menu_link_sub_li_style" activeClassName="active">공포</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu1Link;
