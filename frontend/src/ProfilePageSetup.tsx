import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, TextField, Paper, MenuItem } from "@mui/material";
import Logo from './logo.png';

const ProfilePageSetup = () => {
    const [profileType, setProfileType] = useState<string | null>(null);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [deathDate, setDeathDate] = useState(""); // Add death date state
    const [relationship, setRelationship] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const handleProfileType = (type: string) => {
        setProfileType(type);
    };

    const handleSubmit = () => {
        const profileData = {
            profileType,
            firstName,
            middleName,
            lastName,
            dob, // Date of Birth
            deathDate, // Date of Death
            relationship,
            description,
        };

        // Navigate to ProfilePage and pass profileData as state
        navigate('/profile', { state: profileData });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <img src={Logo} alt="Logo" style={{ width: '150px' }} />
            </Box>

            <Typography variant="h4" sx={{ textAlign: 'center', mb: 1 }}>
                Set up
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 4 }}>
                Start by setting up basic information about your loved one
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                <Button
                    variant="contained"
                    color={profileType === "Human" ? "primary" : "inherit"}
                    onClick={() => handleProfileType("Human")}
                >
                    Human
                </Button>
                <Button
                    variant="contained"
                    color={profileType === "Animal" ? "primary" : "inherit"}
                    onClick={() => handleProfileType("Animal")}
                >
                    Animal
                </Button>
            </Box>

            {profileType && (
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {profileType} Information
                    </Typography>

                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Middle Name"
                        variant="outlined"
                        fullWidth
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Date of Birth"
                        variant="outlined"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Date of Death" // New input field for death date
                        variant="outlined"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={deathDate}
                        onChange={(e) => setDeathDate(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        select
                        label="Relationship"
                        variant="outlined"
                        fullWidth
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="Parent">Parent</MenuItem>
                        <MenuItem value="Sibling">Brother</MenuItem>
                        <MenuItem value="Sibling">Sister</MenuItem>
                        <MenuItem value="Friend">Friend</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    <TextField
                        label="Profile Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default ProfilePageSetup;
