import { useEffect, useState } from "react";
import { useLocation, matchPath, Link } from "react-router-dom";
import { getAuthToken, isAdmin } from "utils/auth";
import logo from "../images/logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/NavBarContent.scss";

interface User {
  firstName: string;
  lastName: string;
  userId: string;
  role: string;
}

const NavBarContent = () => {
  const location = useLocation(); //Accessing current URL path
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!getAuthToken();

  const isGrayButton = Boolean(
    isAdmin() || matchPath("/admin/members", location.pathname)
  );

  const buttonConfig = {
    text: isLoggedIn ? "Logout" : "Login",
    pageTo: isLoggedIn
      ? "/"
      : {
          pathname: "/login",
          state: {
            from: location.pathname,
          },
        },
  };

  // useEffect manage state on location or token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const userId = sessionStorage.getItem("userId");
        const url = `${(window as any).backendURL}user/profile/${userId}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  const renderWelcomeMessage = () => {
    if (!user) return null;

    const isAdmin = sessionStorage.getItem("role") === "0";
    const loginOrigin = sessionStorage.getItem("loginOrigin");
    const currentPath = location.pathname;

    // Always show welcome message for admin
    if (isAdmin) {
      if (currentPath === "/") {
        return (
          <span>
            Welcome {user.firstName} {user.lastName}!&nbsp;
            <Link to="/admin/members">CHECK your members</Link>
          </span>
        );
      }
      return null;
    }

    // For book/:meetingId path
    if (currentPath.startsWith("/book/")) {
      sessionStorage.setItem("loginOrigin", "booking");
      return (
        <span>
          Welcome {user.firstName} {user.lastName}!&nbsp;
          <Link to={`/user/${sessionStorage.getItem("userId")}`}>
            CHECK your meetings
          </Link>
        </span>
      );
    }

    // For user/:id path -- only show if came from booking
    if (currentPath.startsWith("/user/") && loginOrigin === "booking") {
      const meetingId = sessionStorage.getItem("meetingId");
      return (
        <span>
          Welcome {user.firstName} {user.lastName}!&nbsp;
          <Link to={`/book/${meetingId}`}>Go back to booking</Link>
        </span>
      );
    }

    // Show welcome page on home page only
    if (currentPath === "/" && !loginOrigin) {
      return (
        <span>
          Welcome {user.firstName} {user.lastName}!&nbsp;
          <Link to={`/user/${sessionStorage.getItem("userId")}`}>
            Check your meetings
          </Link>
        </span>
      );
    }

    // otherwise, do not show any welcome messages
    return null;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div id="navbar">
      <Link to="/">
        <img id="logo" src={logo} alt="Logo" />
      </Link>

      {renderWelcomeMessage()}
      <RedButtonLink
        pageTo={buttonConfig.pageTo}
        text={buttonConfig.text}
        isGray={isGrayButton}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default NavBarContent;
