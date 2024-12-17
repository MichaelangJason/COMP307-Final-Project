import { Link, Outlet, useParams } from "react-router-dom";
import NavBarContent from "./NavBarContent";
import "../styles/PrivateNav.scss";
import { FaBars, FaTimes } from "react-icons/fa";
import React, { useState, useEffect } from "react";

const PrivateNav = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  // Welcome message
  const [userName, setUserName] = useState<string | null>(null);

  // Extract /user/:id from the URL
  const { id } = useParams<{ id: string }>();

  const toggleNavBar = () => {
    setIsNavVisible((prev) => !prev);

    // Toggle the no-scroll class on the body element
    if (!isNavVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  };

  return (
    <>
      <NavBarContent pageTo="/" text="Log Out" userName={userName} />
      <div id="privateSeparator">
        <nav id="private-nav" className={isNavVisible ? "responsive_nav" : ""}>
          <Link to={`/user/${id}`} onClick={toggleNavBar}>
            MEETING
          </Link>

          <Link to={`/user/${id}/create`} onClick={toggleNavBar}>
            CREATE
          </Link>
          <Link to={`/user/${id}/manage`} onClick={toggleNavBar}>
            MANAGE
          </Link>
          <Link to={`/user/${id}/request`} onClick={toggleNavBar}>
            REQUEST
          </Link>
          <Link to={`/user/${id}/profile`} onClick={toggleNavBar}>
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
      <main id="private-main">
        <Outlet />
      </main>
    </>
  );
};

export default PrivateNav;
