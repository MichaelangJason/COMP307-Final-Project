import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

import "../styles/RedButtonLink.scss";

interface Props {
  pageTo: string;
  text: string;
  arrow?: boolean;
}

const RedButtonLink = ({ pageTo, text, arrow = false }: Props) => {
  return (
    <Link className="redButton" to={pageTo}>
      {arrow && <FontAwesomeIcon icon={faCaretLeft} />}
      {text}
    </Link>
  );
};

export default RedButtonLink;
