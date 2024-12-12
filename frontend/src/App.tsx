import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage'; 
import SignUpPage from './SignUpPage'; 
import ForgotPasswordPage from './ForgotPasswordPage'; 
import ProfilePage from './ProfilePage';
import SplashScreen from './SplashScreen';  
import ProfilePageSetup from './ProfilePageSetup'; 
import EmailVerificationPage from './EmailVerificationPage'; 
import ResetPasswordPage from './ResetPasswordPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profilepage" element={<ProfilePage />} /> 
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/profilepagesetup" element={<ProfilePageSetup />} />
        {/* <Route path="/verify-email/:token" element={<EmailVerificationPage />} />  */}
        <Route path="/Reset-password" element={<ResetPasswordPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
