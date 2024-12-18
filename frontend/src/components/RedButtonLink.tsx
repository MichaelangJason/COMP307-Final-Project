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
}

const RedButtonLink = ({
  pageTo = "/",
  text,
  goBack = false,
  isGray = false,
  isLoggedIn,
  onLogout,
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
      text = "login"; // Reset the text of button to 'login'
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
