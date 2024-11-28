import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

import "../styles/RedButtonLink.scss";

interface Props {
  pageTo?: string;
  text: string;
  goBack?: boolean;
}

const RedButtonLink = ({ pageTo = "/", text, goBack = false }: Props) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <Link
      className="redButton"
      to={pageTo}
      onClick={goBack ? handleClick : undefined}
    >
      {goBack && <FontAwesomeIcon icon={faCaretLeft} />}
      {text}
    </Link>
  );
};

export default RedButtonLink;
