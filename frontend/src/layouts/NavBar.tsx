import { Outlet } from "react-router-dom";

import logo from "../images/logo.png";
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <>
      <img className="logo" src={logo} alt="Logo" />

      <h1>NavBar</h1>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default NavBar;
