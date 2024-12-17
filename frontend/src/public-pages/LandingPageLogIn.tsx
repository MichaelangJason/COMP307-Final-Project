import React from 'react';
import "../styles/HomePage.scss"; 
import homeImage from "../images/homeImage.png";



const Home = () => {
  return (
    <div className="home-page">
      {}
      <div className="silver-box">
        <h1>Connecting Educators and Students, with Ease</h1>
        <h3>Set up your meeting today</h3>
      </div>

      {}
      <div className="red-box">
        <div className="red-text">Our platform makes it easier for teachers and students to schedule and communicate. 
          It includes features such as quick meeting scheduling, surveys to collect student preferences for office hours, 
          and the option to check forthcoming appointments, ensuring that everyone is kept informed and organized.
           Alerts about upcoming meetings help everyone stay on track, reducing missed opportunities.
        </div>
        <div className="red-image">
        <img src={homeImage} alt="Mn" />
        </div>
      </div>
    </div>
  );
};

export default Home;