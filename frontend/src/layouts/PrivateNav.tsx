import { Outlet } from "react-router-dom";

import NavBarContent from "./NavBarContent";
import "../styles/PrivateNav.scss";

const PrivateNav = () => {
  return (
    <>
      <NavBarContent pageTo="/" text="Log Out" />
      <div id="privateSeparator"></div>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PrivateNav;
