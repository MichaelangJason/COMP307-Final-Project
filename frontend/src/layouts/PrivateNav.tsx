import { Link, Outlet } from "react-router-dom";

import NavBarContent from "./NavBarContent";
import "../styles/PrivateNav.scss";

const PrivateNav = () => {
  const hamburgerFunction = () => {
    console.log("Hamburger");
  };

  return (
    <>
      <NavBarContent pageTo="/" text="Log Out" />
      <div id="privateSeparator">
        <table>
          <td>
            <Link to="/user/:id">MEETING</Link>
          </td>
          <td>
            <Link to="/user/:id/create">CREATE</Link>
          </td>
          <td>
            <Link to="/user/:id/manage">MANAGE</Link>
          </td>
          <td>
            <Link to="/user/:id/request">REQUEST</Link>
          </td>
          <td>
            <Link to="/user/:id/profile">PROFILE</Link>
          </td>
        </table>
      </div>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PrivateNav;
