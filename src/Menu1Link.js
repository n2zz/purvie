import React from "react";
import { Link } from "react-router-dom";
import "./MenuLink.css";

const MenuLink = () => {
  return (
    <div id="mdiv">
      <ul>
        <li>
          <Link to="/Menu1">최고 인기</Link>
        </li>
        <li>
          <Link to="/Menu2">새로나왔어요</Link>
        </li>
        <li>
          <Link to="/Menu3">액션</Link>
        </li>
        <li>
          <Link to="/Menu4">SF/판타지</Link>
        </li>
        <li>
          <Link to="/Menu5">애니메이션</Link>
        </li>
        <li>
          <Link to="/Menu6">로맨스</Link>
        </li>
        <li>
          <Link to="/Menu7">코미디</Link>
        </li>
        <li>
          <Link to="/Menu8">공포/스릴러</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuLink;
