import { Link, Outlet } from "react-router-dom";
import NavBarContent from "./NavBarContent";
import "../styles/PrivateNav.scss";
import { FaBars, FaTimes } from "react-icons/fa";
import React, { useState } from "react";

const PrivateNav = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNavBar = () => {
    setIsNavVisible((prev) => !prev);
  };

  return (
    <>
      <NavBarContent pageTo="/" text="Log Out" />
      <div id="privateSeparator">
        <nav className={isNavVisible ? "responsive_nav" : ""}>
          <Link to="/user/:id" onClick={toggleNavBar}>
            MEETING
          </Link>
          <Link to="/user/:id/create" onClick={toggleNavBar}>
            CREATE
          </Link>
          <Link to="/user/:id/manage" onClick={toggleNavBar}>
            MANAGE
          </Link>
          <Link to="/user/:id/request" onClick={toggleNavBar}>
            REQUEST
          </Link>
          <Link to="/user/:id/profile" onClick={toggleNavBar}>
            PROFILE
          </Link>
          <button
            className="nav-button nav-close-button"
            onClick={toggleNavBar}
          >
            {/* npm install react-icons */}
            <FaTimes />
          </button>
        </nav>

        <button className="nav-button" onClick={toggleNavBar}>
          <FaBars />
        </button>
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PrivateNav;
