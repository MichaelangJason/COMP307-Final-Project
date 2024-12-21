// Han Wen Fu

import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

import "../styles/RedButtonLink.scss";

interface Props {
  pageTo?:
    | string
    | { pathname: string; state: { from: string } | { referrer: string } };
  text: string;
  goBack?: boolean;
  isGray?: boolean;
  isLoggedIn?: boolean;
  onLogout?: () => void; //used to handle logout
  setButtonText?: React.Dispatch<React.SetStateAction<string>>;
  setButtonPageTo?: React.Dispatch<
    React.SetStateAction<string | { pathname: string; state: { from: string } }>
  >;
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (goBack) {
      navigate(-1);
      return;
    }

    if (isLoggedIn !== undefined) {
      if (isLoggedIn) {
        // Handle logout
        if (onLogout) {
          onLogout();
        }
        navigate("/");
        return;
      }

      // Handle login navigation
      const currentPath = location.pathname;
      navigate("/login", {
        state: {
          from: currentPath,
        },
      });
      return;
    }

    // Handle other navigation
    if (typeof pageTo === "object") {
      navigate(pageTo.pathname, { state: pageTo.state });
    } else {
      navigate(pageTo);
    }
  };

  return (
    <Link
      className={`redButton ${isGray ? "isGray" : ""}`} //add condition
      to={pageTo}
      onClick={handleClick}
    >
      {goBack && <FontAwesomeIcon icon={faCaretLeft} />}
      {text}
    </Link>
  );
};

export default RedButtonLink;
