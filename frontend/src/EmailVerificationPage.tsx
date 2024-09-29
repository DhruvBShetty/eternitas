import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...'); 
  const [isVerified, setIsVerified] = useState(false); 
  useEffect(() => {
    const verifyEmail = async () => {
      const response = await fetch(`http://localhost:8000/api/verify-email/${token}`, {
        method: 'GET',
      });

      if (response.ok) {
        setIsVerified(true);
        setVerificationStatus('Your email has been verified! Redirecting to profile setup...'); 
        setTimeout(() => {
          navigate('/profilepagesetup'); 
        }, 3000);
      } else {
        setVerificationStatus('Email verification failed. Please try again.'); 
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <h1>{verificationStatus}</h1> 
      {!isVerified && <p>Waiting on email verification...</p>} 
    </div>
  );
};

export default EmailVerificationPage;
