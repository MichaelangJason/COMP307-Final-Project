import React, { useState, useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import NavBarContent from "./NavBarContent";
import "../styles/AdminNav.scss";

import { FaBars, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

const AdminNav = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const { id } = useParams(); // get the id from the URL
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Display user email on the Navbar
  useEffect(() => {
    if (id) {
      // TODO - backend : Fetch the member's email using the id
      const fetchEmail = async () => {
        // dummy data example
        const data = [
          { id: ":id", email: "user_example@mcgill.ca" },
          { id: "001", email: "user1@mcgill.ca" },
          { id: "002", email: "user2@mail.mcgill.ca" },
          { id: "003", email: "user3@mcgill.ca" },
          { id: "004", email: "user4@mail.mcgill.ca" },
          // More members...
        ];

        const member = data.find((member) => member.id === id);
        if (member) {
          setUserEmail(member.email);
        }
      };

      fetchEmail();
    }
  }, [id]);

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
      <NavBarContent
        pageTo="/"
        text="Log Out"
        userEmail="Admin"
        isGray={true}
      />
      <div id="adminSeparator">
        <nav id="admin-nav" className={isNavVisible ? "responsive_nav" : ""}>
          {/* Display only "MEMBERS" when no `id` */}
          <Link to="/admin/members" onClick={toggleNavBar}>
            MEMBERS
          </Link>

          {/* Show email and other links only when `id` is available */}
          {id && userEmail && (
            <>
              <Link to="/admin/members/:id/" className="info">
                <FontAwesomeIcon icon={faCaretRight} />
              </Link>

              <Link to="/admin/members/:id/" className="info userEmail">
                {userEmail?.toUpperCase()}
              </Link>
              <Link to="/admin/members/:id/" className="info">
                |
              </Link>

              {/* TODO backend : to link to specific id. ~~~ Example: <Link to="/admin/members/$(id}/" onClick={toggleNavBar}></Link> */}
              <Link to="/admin/members/:id/" onClick={toggleNavBar}>
                MEETINGS
              </Link>
              <Link to="/admin/members/:id/create" onClick={toggleNavBar}>
                CREATE
              </Link>
              <Link to="/admin/members/:id/manage" onClick={toggleNavBar}>
                MANAGE
              </Link>
              <Link to="/admin/members/:id/request" onClick={toggleNavBar}>
                REQUEST
              </Link>
              <Link to="/admin/members/:id/profile" onClick={toggleNavBar}>
                PROFILE
              </Link>
            </>
          )}

          {/* Hamburger implementation */}
          <button
            className="nav-button nav-close-button"
            onClick={toggleNavBar}
          >
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

export default AdminNav;
