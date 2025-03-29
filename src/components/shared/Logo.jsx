import React from "react";
import LogoImage from "../../assets/Logo.png";
import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink to="/overview">
      <img src={LogoImage} alt="logo image" className="h-12 "/>
    </NavLink>
  );
};

export default Logo;
