import React from 'react';
import './Pages.css';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <h1>About Us</h1>
      <p>Learn more about our company and mission.</p>
      <div className="content-section">
        <h2>Our Mission</h2>
        <p>
          We strive to create innovative solutions that help our clients achieve their goals.
          Our team is dedicated to delivering high-quality products and exceptional service.
        </p>
      </div>
      <div className="content-section">
        <h2>Our Team</h2>
        <p>
          Our team consists of experienced professionals who are passionate about technology
          and committed to excellence. We work together to bring creative ideas to life.
        </p>
      </div>
    </div>
  );
};

export default About;
