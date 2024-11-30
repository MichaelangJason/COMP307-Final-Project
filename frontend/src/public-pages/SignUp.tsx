import logo from "../images/mini_logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/LogIn_n_SignUp.scss";

import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <>
      <div className="page-body">
        <div className="back-button">
          <RedButtonLink text="Back" goBack={true} />
        </div>

        <div className="wrapper">
          <header>
            Sign Up
            <img src={logo} alt="Logo" />
          </header>

          <div className="errormsg">Account already exists</div>

          <form name="signUpForm" action="#" method="POST">
            <label>Email</label>
            <input type="email" name="email" required />
            <label>Password</label>
            <input type="password" name="password" required />

            <div className="submit-button">
              <input type="submit" name="signup" value="Sign Up" />
            </div>
          </form>

          <div className="separator"></div>

          <p>
            Already have an account? <Link to="/login">LOGIN</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
