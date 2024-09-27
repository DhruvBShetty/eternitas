import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to login page after 5 seconds
    const timer = setTimeout(() => {
      // Set item in local storage to indicate splash screen has been shown
      localStorage.setItem('splashShown', 'true');
      navigate('/login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen-container">
      <video autoPlay muted loop className="splash-video">
        <source src={`${process.env.PUBLIC_URL}/eternitas.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default SplashScreen;
