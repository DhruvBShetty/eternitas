import React, { useState } from "react";
import { Avatar, Container, Paper, Typography, Box, TextField, Button, Grid2, Link } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link as RouterLink } from "react-router-dom";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [apiError, setApiError] = useState(""); 

    // Add registerUser function
    const registerUser = async (email: string, password: string) => {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Failed to register user');
        }

        return response.json();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        } else {
            setConfirmPasswordError("");
        }

        if (!hasError) {
            try {
                await registerUser(email, password);
                console.log("Registration successful");
            } catch (error) {
                setApiError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <Container 
            maxWidth="xs"
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '90vh',
                padding: 2 
            }}
        >
            <Paper elevation={10} sx={{ padding: 2, width: '100%', maxWidth: '400px' }}>
                <Avatar sx={{
                    mx: "auto",
                    bgcolor:"#212121",
                    textAlign: "center",
                    mb: 2,
                }} >
                    <AccountCircleOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
                    Sign Up
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
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        sx={{ mb: 2 }}
                    />

                    <TextField 
                        placeholder="Confirm password" 
                        fullWidth 
                        required 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        sx={{ mb: 2 }}
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
                        Sign Up
                    </Button>

                    {apiError && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {apiError}
                        </Typography>
                    )}
                </Box>

                <Grid2 container justifyContent='flex-end' sx={{ mt: 2 }}>
                    <Grid2>
                        <Link 
                            component={RouterLink} 
                            to="/login"
                            sx={{ color: '#212121', textDecoration: 'none', '&:hover': { color: '#ffca28' } }}
                        >
                            Already have an account? Sign In
                        </Link>
                    </Grid2>
                </Grid2>
            </Paper>
        </Container>
    );
}

export default SignUpPage;
