import React from "react";
import { Link } from "react-router-dom";
import "./MenuLink.css";

const Menu1Link = () => {
  return (
    <div id="mdiv">
      <ul>
        <li>
          <Link to={"/app/boxoffice"} className="menu_link_sub_li_style">최고 인기</Link>
        </li>
        <li>
          <Link to="/app/boxoffice" className="menu_link_sub_li_style">새로나왔어요</Link>
        </li>
        <li>
          <Link to={"/app/movie/액션"} className="menu_link_sub_li_style">액션</Link>
        </li>
        <li>
          <Link to="/app/movie/판타지" className="menu_link_sub_li_style">SF/판타지</Link>
        </li>
        <li>
          <Link to="/app/movie/애니메이션" className="menu_link_sub_li_style">애니메이션</Link>
        </li>
        <li>
          <Link to="/app/movie/로맨스" className="menu_link_sub_li_style">로맨스</Link>
        </li>
        <li>
          <Link to="/app/movie/코미디" className="menu_link_sub_li_style">코미디</Link>
        </li>
        <li>
          <Link to="/app/movie/공포" className="menu_link_sub_li_style">공포/스릴러</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu1Link;
