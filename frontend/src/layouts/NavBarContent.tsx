import { useEffect, useState } from "react";
import { useParams, useLocation, matchPath, Link } from "react-router-dom";
import logo from "../images/logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/NavBarContent.scss";

const NavBarContent = () => {
  const { id } = useParams<{ id: string }>(); //Take the userid from the URL
  const location = useLocation(); //Accessing current URL path
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  // To make variables based on the login status
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isGray, setIsGray] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Login");
  const [buttonPageTo, setButtonPageTo] = useState<string>("/login");

  useEffect(() => {
    // Check login status using sessionStorage
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      setButtonText("Logout");
      setButtonPageTo("/");
    } else {
      setButtonText("Login");
      setButtonPageTo("/login");
    }

    // The pages where the buttons are gray
    const grayButtonPagesPatterns = ["/admin/members"];
    setIsGray(
      grayButtonPagesPatterns.some((pattern) =>
        matchPath(pattern, location.pathname)
      )
    );
  }, [location.pathname]);

  // Handle login/logout actions
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      sessionStorage.removeItem("token"); // Remove the token
      setButtonText("Login"); // Update button text
      setButtonPageTo("/login"); // Update button target page
    } else {
      setButtonText("Logout"); // Set button text to Logout
      setButtonPageTo("/"); // Set button target to home page
    }
  };

  // fetching the user firstName and lastName
  useEffect(() => {
    const privatePagePatterns = ["/user/:id", "/admin/members"];

    const isUserPage = privatePagePatterns.some((pattern) =>
      matchPath(pattern, location.pathname)
    );

    const fetchUserData = async () => {
      if (!id || !isUserPage) return; // if not user page or no id, do not fetch
      try {
        const response = await fetch(
          `http://localhost:3007/user/profile/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data1");
        }

        const data = await response.json(); //API returns { firstName, lastName }
        // console.log(data.firstName);
        // console.log(data.lastName);

        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [id, location.pathname]);

  return (
    <div id="navbar">
      <Link to="/">
        <img id="logo" src={logo} alt="Logo" />
      </Link>
      {firstName && lastName && (
        <span>
          Welcome {firstName} {lastName}!
        </span>
      )}
      <RedButtonLink
        pageTo={buttonPageTo}
        text={buttonText}
        isGray={isGray}
        isLoggedIn={isLoggedIn}
        onLogout={handleLoginLogout}
        setButtonText={setButtonText}
        setButtonPageTo={setButtonPageTo}
      />
    </div>
  );
};

export default NavBarContent;
