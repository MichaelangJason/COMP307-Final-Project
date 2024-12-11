import { Link, Outlet } from "react-router-dom";
import NavBarContent from "./NavBarContent";
import "../styles/PrivateNav.scss";
import { FaBars, FaTimes } from "react-icons/fa";
import React, { useState, useEffect } from "react";

const PrivateNav = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  // Welcome message
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // TODO - backend :  to query the userEmail / username
  useEffect(() => {
    // Simulating a backend API call to fetch user details
    const fetchUserData = async () => {
      try {
        // const response = await fetch("/api/user");
        // const data = await response.json();

        // Dummy example
        const data = {
          email: "user@example.com",
          name: "John Doe",
        };

        setUserEmail(data.email); // Assuming the backend returns { email: "user@example.com" }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
      <NavBarContent pageTo="/" text="Log Out" userEmail={userEmail} />
      <div id="privateSeparator">
        <nav id="private-nav" className={isNavVisible ? "responsive_nav" : ""}>
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
      <main id="private-main">
        <Outlet />
      </main>
    </>
  );
};

export default PrivateNav;
