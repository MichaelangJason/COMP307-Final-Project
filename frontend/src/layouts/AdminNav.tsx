import { useState, useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import NavBarContent from "./NavBarContent";
import "../styles/AdminNav.scss";

import { FaBars, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

const AdminNav = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Display user email on the Navbar
  useEffect(() => {
    if (id) {
      const fetchEmail = async () => {
        try {
          const response = await fetch(
            `http://localhost:3007/user/profile/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include token if necessary
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();

          // Extract email from the response data and set it in state
          if (data.email) {
            setUserEmail(data.email);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
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
      <NavBarContent />
      <div id="adminSeparator">
        <nav id="admin-nav" className={isNavVisible ? "responsive_nav" : ""}>
          {/* Display only "MEMBERS" when no `id` */}
          <Link to="/admin/members" onClick={toggleNavBar}>
            MEMBERS
          </Link>

          {/* Show email and other links only when `id` is available */}
          {id && userEmail && (
            <>
              <Link to={`/admin/members/${id}/`} className="info">
                <FontAwesomeIcon icon={faCaretRight} />
              </Link>

              <Link to={`/admin/members/${id}`} className="info userEmail">
                {userEmail?.toUpperCase()}
              </Link>
              <Link to={`/admin/members/${id}`} className="info">
                |
              </Link>

              {/* TODO backend : to link to specific id. ~~~ Example: <Link to="/admin/members/$(id}/" onClick={toggleNavBar}></Link> */}
              <Link to={`/admin/members/${id}`} onClick={toggleNavBar}>
                MEETINGS
              </Link>
              <Link to={`/admin/members/${id}/create`} onClick={toggleNavBar}>
                CREATE
              </Link>
              <Link to={`/admin/members/${id}/manage`} onClick={toggleNavBar}>
                MANAGE
              </Link>
              <Link to={`/admin/members/${id}/request`} onClick={toggleNavBar}>
                REQUEST
              </Link>
              <Link to={`/admin/members/${id}/profile`} onClick={toggleNavBar}>
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
