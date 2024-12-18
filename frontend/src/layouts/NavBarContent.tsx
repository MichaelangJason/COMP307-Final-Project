import { useEffect, useState } from "react";
import { useParams, useLocation, matchPath, Link } from "react-router-dom";
import logo from "../images/logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/NavBarContent.scss";

interface Props {
  pageTo: string;
  text: string;
  userName?: string | null;
  isGray?: boolean | false;
}

const NavBarContent = ({ pageTo, text, isGray }: Props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation(); //Accessing current URL path
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

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
      <RedButtonLink pageTo={pageTo} text={text} isGray={isGray} />
    </div>
  );
};

export default NavBarContent;
