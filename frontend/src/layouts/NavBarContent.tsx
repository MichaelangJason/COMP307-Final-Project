import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      console.log(id);
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
  }, [id]);

  return (
    <div id="navbar">
      <img id="logo" src={logo} alt="Logo" />
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
