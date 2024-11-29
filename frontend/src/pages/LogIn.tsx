import logo from "../images/logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/LogIn.scss";

import SignUp from "./SignUp";

const LogIn = () => {
  // return <>Log In</>;
  return (
    <>
      <div className="page-body">
        <div className="back-button">
          <RedButtonLink pageTo="/" text="Back" goBack={true} />
        </div>

        <div className="login-wrapper">
          <header>
            Login
            <img src={logo} alt="Logo" />
          </header>

          <div className="errormsg">
            Your login details are incorrect, please try again
          </div>

          <form name="loginForm" action="#" method="GET">
            <label>Email</label>
            <input type="text" name="email" required />
            <label>Password</label>
            <input type="text" name="password" required />

            <div className="login-button">
              <input type="submit" name="login" value="Log In" />
            </div>
          </form>

          <div className="separator"></div>

          <p>
            Don't have an account? <a href="#">SIGN UP</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;
