import { Avatar, Container, Paper, Typography, Box, TextField, Button, Grid2, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom"; // Import react-router-dom's Link
import { useState } from "react"; // Import useState for managing form state

const ForgotPasswordPage = () => {
    // State for email input and error message
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // Handle form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
            // Process the email submission here
            console.log("Email submitted:", email);
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
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
                    Forgot Password
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField 
                        placeholder="Enter your email" 
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
                        Submit
                    </Button>
                </Box>

                <Grid2 container justifyContent='center' sx={{ mt: 2 }}>
                    <Grid2>
                        <Link 
                            component={RouterLink} 
                            to="/login"
                            sx={{ color: '#212121', textDecoration: 'none', '&:hover': { color: '#ffca28' } }}
                        >
                            Back to Login
                        </Link>
                    </Grid2>
                </Grid2>
            </Paper>
        </Container>
    );
}

export default ForgotPasswordPage;
