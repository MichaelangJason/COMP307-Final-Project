import logo from "../images/mini_logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/LogIn_n_SignUp.scss";

import { Link } from "react-router-dom";

const LogIn = () => {
  return (
    <>
      <div className="page-body">
        <div className="back-button">
          <RedButtonLink text="Back" goBack={true} />
        </div>

        <div className="wrapper">
          <header>
            Login
            <img src={logo} alt="Logo" />
          </header>

          <div className="errormsg">
            Your login details are incorrect, please try again
          </div>

          <form name="loginForm" action="#" method="GET">
            <label>Email</label>
            <input type="email" name="email" required />
            <label>Password</label>
            <input type="password" name="password" required />

            <div className="submit-button">
              <input type="submit" name="login" value="Log In" />
            </div>
          </form>

          <div className="separator"></div>

          <p>
            Don't have an account? <Link to="/signup">SIGN UP</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;
