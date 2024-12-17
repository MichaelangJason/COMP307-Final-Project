import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../images/mini_logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/LogIn_n_SignUp.scss";

import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // POST request
    try {
      const response = await fetch("http://localhost:3007/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      // Parse the response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Success: Navigate to a different page
      navigate(`/user/${data.userId}`);
    } catch (err: any) {
      // Handle errors
      setError(err.message || "Something went wrong. Please try again later.");
      console.error("Error during registration:", err);
    }

    // Testing purposes
    console.log(formData.firstName);
    console.log(formData.lastName);
    console.log(formData.email);
    console.log(formData.password);
    console.log("inside handle submit~");
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
            <label>First Name</label>
            <input
              id="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <label>Last Name</label>
            <input
              id="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
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

            <div className="submit-signup-login-button">
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
