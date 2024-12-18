import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

import "../styles/RedButtonLink.scss";

interface Props {
  pageTo?: string;
  text: string;
  goBack?: boolean;
  isGray?: boolean;
  isLoggedIn?: boolean;
  onLogout?: () => void; //used to handle logout
  setButtonText?: React.Dispatch<React.SetStateAction<string>>;
  setButtonPageTo?: React.Dispatch<React.SetStateAction<string>>;
}

const RedButtonLink = ({
  pageTo = "/",
  text,
  goBack = false,
  isGray = false,
  isLoggedIn,
  onLogout,
  setButtonPageTo,
  setButtonText,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // back navigation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    navigate(-2); // Default to going back by one step in the history
  };

  // login/logout
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      if (onLogout) onLogout();
      sessionStorage.removeItem("token"); //removes the token
      if (setButtonText) setButtonText("Login");
      if (setButtonPageTo) setButtonPageTo("/login"); // Update state here

      navigate("/"); //redirect to login page
    } else {
      navigate("/login");
    }
  };
  return (
    <Link
      className={`redButton ${isGray ? "isGray" : ""}`} //add condition
      to={pageTo}
      onClick={goBack ? handleClick : handleLoginLogout}
    >
      {goBack && <FontAwesomeIcon icon={faCaretLeft} />}
      {text}
    </Link>
  );
};

export default RedButtonLink;
