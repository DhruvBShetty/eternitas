// Logo.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import logo from './logo.png'; // Adjust the path if necessary

const Logo = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleLogoClick = () => {
        navigate("/"); // Navigate to the splash screen
    };

    return (
        <div onClick={handleLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="ETERNITAS Logo" style={{ height: '60px', marginRight: '10px' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#212121' }}>
                ETERNITAS
            </Typography>
        </div>
    );
};

export default Logo;
