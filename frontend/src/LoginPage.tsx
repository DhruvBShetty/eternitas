import React, { useEffect, useState } from "react";
import { Avatar, Container, Paper, Typography, Box, TextField, FormControlLabel, Checkbox, Button, Grid2, Link, IconButton } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from "react-router-dom"; 
import { loginUser } from './api';  
import Logo from './logo.png'; 
import Mymenu from "./Components/Menu";
// import Hamburgermenu from "./Components/HamburgerMenu";
 


const LoginPage = () => {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(" ");
    const [passwordError, setPasswordError] = useState(" ");
    const [apiError, setApiError] = useState(""); 
    const [showPassword, setShowPassword] = useState(false); 
    const [user,setUser]=useState(null);

    console.log(user);
    
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        let hasError = false;
        if (!email.includes("@")) {
            setEmailError("Invalid email address");
            hasError = true;
        } else {
            setEmailError("");
        }
    
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            hasError = true;
        } else {
            setPasswordError("");
        }
    
        if (!hasError) {
            try {
                await loginUser(email, password);
                navigate("/profilepagesetup");
                
            } catch (error) {
                setApiError(`${error}`);
            }
            
        }
    };
    

    return (
       
      <div className="Sidebar">
        <Container 
            maxWidth="xs"
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '60vh',
                padding:2
            }}
        >
       
            <Box 
                sx={{ 
                    mb: { xs: 8, sm: 12, md: 16 }, 
                    mt: { xs: 4, sm: 5, md: 12 },
                    display: "flex",
                    justifyContent: 'center',
                    cursor: 'pointer' 
                }}
            >
                <img 
                    src={Logo} 
                    alt="Logo"
                    style={{ width: '90%', maxWidth: '450px'}} 
                />
            </Box>
            
            <Paper elevation={10} sx={{ padding: 2, width: '100%', maxWidth:'400px' }}>
                <Avatar sx={{
                    mx: "auto",
                    bgcolor:"#212121",
                    textAlign: "center",
                    mb: 2,
                }} >
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5" sx={{ textAlign: "center", fontSize: { xs: 'h6.fontSize', sm: 'h5.fontSize' }}}>
                    Sign In 
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField 
                        placeholder="Enter email" 
                        fullWidth 
                        required 
                        autoFocus 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                        sx={{ mb: 2 }}
                    />

                    <TextField 
                        placeholder="Enter password" 
                        fullWidth 
                        required 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)} 
                                    edge="end"
                                    aria-label="toggle password visibility"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />} 
                                </IconButton>
                            ),
                        }}
                    />

                    <FormControlLabel 
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />

                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        sx={{
                            mt: 2, 
                            bgcolor: "black", 
                            color: "white", 
                            '&:hover': { bgcolor: "#ffca28" }
                        }}
                    >
                        Sign in 
                    </Button>

                    {apiError && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {apiError}
                        </Typography>
                    )}
                </Box>

                <Grid2 container justifyContent='space-between' sx={{ mt: 2 }}>
                    <Grid2>
                        <Link 
                            component={RouterLink} 
                            to="/forgot"
                            sx={{ color: '#212121', textDecoration: 'none', '&:hover': { color: '#ffca28' } }}
                        >
                            Forgot password?
                        </Link>
                    </Grid2>
                    <Grid2>
                        <Link 
                            component={RouterLink} 
                            to="/register"
                            sx={{ color: '#212121', textDecoration: 'none', '&:hover': { color: '#ffca28' } }}
                        >
                            Sign Up 
                        </Link>
                    </Grid2>
                </Grid2>
            </Paper>
        </Container>
        </div>
    );
}

export default LoginPage;
