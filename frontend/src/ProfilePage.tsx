import React, { useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Snackbar, Alert, Avatar, Grid } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

const ProfilePage = () => {
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePic(event.target.files[0]);
        }
    };

    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setMediaFiles((prev) => [...prev, ...filesArray]);
        }
    };

    const handleUpload = async () => {
        if (!profilePic && mediaFiles.length === 0) {
            setSnackbarMessage('Please select a file to upload.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        if (profilePic) formData.append('profilePic', profilePic);
        mediaFiles.forEach((file) => formData.append('media', file));

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed. Please try again.');
            }

            const data = await response.json();
            setSnackbarMessage(data.message || 'Files uploaded successfully!');
            setSnackbarSeverity('success');
        } catch (error: unknown) {
            console.error('Upload error:', error);
            const errorMessage = (error instanceof Error) ? error.message : 'An error occurred during upload.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEditMedia = (index: number) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*/*';
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const newMediaFiles = [...mediaFiles];
                newMediaFiles[index] = target.files[0];
                setMediaFiles(newMediaFiles);
            }
        };
        input.click();
    };

    const handleDeleteMedia = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
        setSnackbarMessage('File deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    return (
        <Container>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        style={{ display: 'none' }}
                        id="profile-pic-upload"
                    />
                    <label htmlFor="profile-pic-upload">
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: '#212121',
                                cursor: 'pointer',
                                position: 'relative',
                                border: '2px solid #ffca28',
                                '&:hover': { opacity: 0.8 }
                            }}
                        >
                            {profilePic ? (
                                <img
                                    src={URL.createObjectURL(profilePic)}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <Typography variant="h6" color="white">INCARCA</Typography>
                            )}
                        </Avatar>
                    </label>
                    <Box sx={{ width: '90%', borderBottom: '2px solid #ffca28', my: 2 }} />
                </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Incarca amintiri</Typography>
                <input
                    type="file"
                    accept="*/*"
                    onChange={handleMediaChange}
                    multiple
                    style={{ marginBottom: '16px' }}
                />
                <Grid container spacing={2}>
                    {mediaFiles.map((file, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', width: '100%', height: '100px', border: '1px solid #ffca28', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Box>
                            <Button variant="outlined" onClick={() => handleEditMedia(index)} sx={{ mt: 1 }}>
                                Edit
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => handleDeleteMedia(index)} sx={{ mt: 1 }}>
                                Delete
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Button
                variant="contained"
                onClick={handleUpload}
                sx={{ mt: 3 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'INCARCA'}
            </Button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProfilePage;
