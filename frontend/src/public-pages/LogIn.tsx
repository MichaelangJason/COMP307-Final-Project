import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../images/mini_logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/LogIn_n_SignUp.scss";

const LogIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage; // To check if we are redirected from the sign up page after successful registration

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3007/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      // Parse the response
      const data = await response.json();

      console.log("Raw API response:", data); // Log the full response for debugging
      if (response.ok) {
        // *** store the token in sessionStorage
        sessionStorage.setItem("token", data.token); //storing the token
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("email", formData.email);

        // Navigate base on role
        if (data.role === 0) {
          navigate(`/admin/members/`);
        } else {
          navigate(`/user/${data.userId}`);
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

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

          {/* Success message from successful sign up */}
          {successMessage && <div className="successmsg">{successMessage}</div>}

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

            <div className="submit-signup-login-button">
              <input type="submit" value="Log In" />
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
