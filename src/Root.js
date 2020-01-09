import React from "react";
import { MemoryRouter } from "react-router-dom";
import Menu from "./Menu";

const Root = () => (
  <MemoryRouter basename="/purvie">
    <Menu />
  </MemoryRouter>
);

export default Root;
