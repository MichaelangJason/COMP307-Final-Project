import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../images/mini_logo.png";
import RedButtonLink from "../components/RedButtonLink";
import "../styles/LogIn_n_SignUp.scss";

const LogIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Use window.location.pathname if location.state does not exist
  const state = location.state as { from?: string };
  const currentPath = window.location.pathname; // Use window.location.pathname if location.state.from is not available
  const from = state?.from || (currentPath === "/login" ? "/" : currentPath);

  const isBookingPage = /^\/book\/[^/]+$/.test(from);
  const meetingId = isBookingPage ? from.split("/").pop() : null;

  console.log("Current path:", currentPath);
  console.log("From path:", from);
  console.log("Is booking page:", isBookingPage);
  console.log("Meeting ID:", meetingId);

  // Display success sign up message
  const signupState = location.state as { successMessage?: string };
  const successMessage = signupState?.successMessage;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3007/login";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      // Parse the response
      const data = await response.json();
      console.log("Raw API response:", data); // for debugging

      if (response.ok) {
        sessionStorage.setItem("token", data.token); //storing the token
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("email", formData.email);

        if (isBookingPage) {
          // Store information for booking-related navigation
          sessionStorage.setItem("loginOrigin", "booking");
          sessionStorage.setItem("meetingId", from.split("/").pop() || "");

          console.log(sessionStorage.getItem("loginOrigin"));
          console.log(sessionStorage.getItem("meetingId"));

          navigate(`/book/${sessionStorage.getItem("meetingId")}`);
        }

        // handle navigation based on user role and origin
        if (data.role === "0") {
          navigate("/admin/members");
        } else {
          navigate(from);
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
