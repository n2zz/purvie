import React from "react";
import { Link } from "react-router-dom";
import "./MenuLink.css";

const Menu1Link = () => {
  return (
    <div id="mdiv_sub_menu">
      <ul>
        <li>
          <Link to="/menu1/boxoffice/daily" className="menu_link_sub_li_style">일별박스오피스</Link>
        </li>
        <li>
          <Link to="/menu1/boxoffice/weekly" className="menu_link_sub_li_style">주간박스오피스</Link>
        </li>
        <li>
          <Link to="/menu1/movie/액션" className="menu_link_sub_li_style">액션</Link>
        </li>
        <li>
          <Link to="/menu1/movie/판타지" className="menu_link_sub_li_style">SF/판타지</Link>
        </li>
        <li>
          <Link to="/menu1/movie/애니메이션" className="menu_link_sub_li_style">애니메이션</Link>
        </li>
        <li>
          <Link to="/menu1/movie/로맨스" className="menu_link_sub_li_style">로맨스</Link>
        </li>
        <li>
          <Link to="/menu1/movie/코미디" className="menu_link_sub_li_style">코미디</Link>
        </li>
        <li>
          <Link to="/menu1/movie/공포" className="menu_link_sub_li_style">공포/스릴러</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu1Link;
