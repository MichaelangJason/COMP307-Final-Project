import { Link } from "react-router-dom";
import "../styles/HomePage.scss";
import homeImage from "../images/dashboard.png";

const Home = () => {
  return (
    <div className="home-page">
      <div className="silver-box">
        <h1>Connecting Educators and Students, with Ease</h1>
        <h3>Set up your meeting today</h3>
      </div>
      <div className="red-box">
        <div className="red-text">
          <h3>Get to know us</h3>
          Our platform makes it easier for teachers and students to schedule and communicate.
          It includes features such as quick meeting scheduling, surveys to collect student preferences for office hours,
          and the option to check forthcoming appointments, ensuring that everyone is kept informed and organized.
          Alerts about upcoming meetings help everyone stay on track, reducing missed opportunities. <Link to="/signup" style={{color:"white", textDecoration: "none"}}><b>Sign up to experience more</b></Link>
        </div>
        <div className="red-image">
          <img src={homeImage} alt="Mn" />
        </div>
      </div>
      <div className="footer">
        <div className="footer-info">
          © 2024 BookedIn. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};


export default Home;
