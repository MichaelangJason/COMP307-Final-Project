import logo from "../images/logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/NavBarContent.scss";

interface Props {
  pageTo: string;
  text: string;
  userEmail?: string | null; // New attribute to display msg "Welcome userEmail!"
}

const NavBarContent = ({ pageTo, text, userEmail }: Props) => {
  return (
    <div id="navbar">
      <img id="logo" src={logo} alt="Logo" />
      {userEmail && <span>Welcome {userEmail}!</span>}
      <RedButtonLink pageTo={pageTo} text={text} />
    </div>
  );
};

export default NavBarContent;
