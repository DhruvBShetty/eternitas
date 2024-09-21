import { Avatar, Container, Paper, Typography, Box, TextField, Button, Grid, Link } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link as RouterLink } from "react-router-dom";  // Import react-router-dom's Link
import { useState } from "react"; // Import useState for managing form state

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
            // Submit the form data to your backend here
            try {
                const response = await fetch('YOUR_BACKEND_API_URL/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                const result = await response.json();
                console.log(result);
                // Handle response, e.g., redirect to login page or show success message
            } catch (error) {
                console.error('Error:', error);
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
                minHeight: '100vh',
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
                </Box>

                <Grid container justifyContent='flex-end' sx={{ mt: 2 }}>
                    <Grid item>
                        <Link 
                            component={RouterLink} 
                            to="/login"
                            sx={{ color: '#212121', textDecoration: 'none', '&:hover': { color: '#ffca28' } }}
                        >
                            Already have an account? Sign In
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default SignUpPage;
