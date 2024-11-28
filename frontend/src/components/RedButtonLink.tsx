import { Link } from "react-router-dom";

import "../styles/RedButtonLink.scss";

interface Props {
  pageTo: string;
  text: string;
}

const RedButtonLink = ({ pageTo, text }: Props) => {
  return (
    <Link className="redButton" to={pageTo}>
      {text}
    </Link>
  );
};

export default RedButtonLink;
