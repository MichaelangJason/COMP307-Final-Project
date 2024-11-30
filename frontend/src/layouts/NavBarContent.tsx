import logo from "../images/logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/NavBarContent.scss";

interface Props {
  pageTo: string;
  text: string;
}

const NavBarContent = ({ pageTo, text }: Props) => {
  return (
    <div id="navbar">
      <img id="logo" src={logo} alt="Logo" />
      <RedButtonLink pageTo={pageTo} text={text} />
    </div>
  );
};

export default NavBarContent;
