import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage'; 
import SignUpPage from './SignUpPage'; 
import ForgotPasswordPage from './ForgotPasswordPage'; 
import ProfilePage from './ProfilePage';
import SplashScreen from './SplashScreen';  

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
