import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage'; 
import SignUpPage from './SignUpPage'; 
import ForgotPasswordPage from './ForgotPasswordPage'; 
import ProfilePage from './ProfilePage';
import ProfilePagepublic from './ProfilePagepublic';
import SplashScreen from './SplashScreen';  
import ProfilePageSetup from './ProfilePageSetup'; 
import ResetPasswordPage from './ResetPasswordPage';
import { AuthProvider } from './Auth/Auth';
import { PrivateRoutes } from './Auth/PrivateRoutes';

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route element={<PrivateRoutes/>}>
        <Route path="/profilepagesetup" element={<ProfilePageSetup />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/profile/:id" element={<ProfilePagepublic />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        {/* <Route path="/verify-email/:token" element={<EmailVerificationPage />} />  */}
        <Route path="/Reset-password" element={<ResetPasswordPage/>}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
