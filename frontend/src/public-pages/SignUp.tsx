import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../images/mini_logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/LogIn_n_SignUp.scss";

import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = e.currentTarget.email as HTMLInputElement; // Access the email input
    const passwordInput = e.currentTarget.password as HTMLInputElement; // Access the password input

    // error - Invalid email address
    if (!emailInput.checkValidity()) {
      setError("Please enter a valid email address");
      return;
    }
    // error - Missing Email
    if (!emailInput.value) {
      setError("Email is required");
      return;
    }
    // error - Missing password
    if (!passwordInput.value) {
      setError("Password is required");
      return;
    }

    // TODO backend: error - Account already exists
    const accountAlreadyExists = false;
    if (accountAlreadyExists) {
      setError("Account already exists");
      return;
    }

    // TODO backend: success - New email => Link to Meeting Private Page
    navigate("/user/:id");

    // Testing: View the formData through the console
    console.log("Submitted Data:", formData);

    // Reset error
    setError("");
  };

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

          {/* Error handling */}
          {error && <div className="errormsg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="submit-button">
              <input type="submit" value="Sign Up" />
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
