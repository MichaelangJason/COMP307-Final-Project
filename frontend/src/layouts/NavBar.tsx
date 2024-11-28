import { Outlet } from "react-router-dom";

import logo from "../images/logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/NavBar.scss";

const NavBar = () => {
  return (
    <>
      <div id="navbar">
        <img id="logo" src={logo} alt="Logo" />
        <RedButtonLink pageTo="/login" text="Log In" />
      </div>

      <div id="separator"></div>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default NavBar;
