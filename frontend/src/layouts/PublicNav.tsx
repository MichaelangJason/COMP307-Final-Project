import { Outlet } from "react-router-dom";

import NavBarContent from "./NavBarContent";
import "../styles/PublicNav.scss";

const PublicNav = () => {
  return (
    <>
      <NavBarContent pageTo="/login" text="Log In" />
      <div id="publicSeparator"></div>
      <main id="public-nav">
        <Outlet />
      </main>
    </>
  );
};

export default PublicNav;
