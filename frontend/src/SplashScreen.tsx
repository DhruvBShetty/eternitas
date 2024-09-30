import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('splashShown', 'true');
      navigate('/login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const isMobile = window.innerWidth < 768; 
  const videoSource = isMobile 
    ? `${process.env.PUBLIC_URL}/eternitas_dog+man.mp4` 
    : `${process.env.PUBLIC_URL}/eternitas.mp4`;

  return (
    <div className="splash-screen-container">
      <video autoPlay muted loop className="splash-video">
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default SplashScreen;
