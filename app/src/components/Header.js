import React from "react";
import logo from "../images/logo.jpg";
import MUISwitch from "./Switch.js";

function Header({ renderRightView, centerClick }) {
  return (
    <div className="header">
      <div className="logoWrapper">
        <img className="logo" src={logo} alt="logo" /> <h1>Monkey Notes</h1>
      </div>
      <MUISwitch defaultChecked onChange={centerClick} />

      <div>{renderRightView()}</div>
    </div>
  );
}

export default Header;
