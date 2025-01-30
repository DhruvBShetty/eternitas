import React, { useState,useEffect, MouseEventHandler,useRef } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Button, Box, CircularProgress, Snackbar, Alert, Avatar, Grid,Tabs,Tab,createTheme,ThemeProvider } from "@mui/material";
import { getpublicprofiledata,profileupload,mediaupload,getpublicmedia } from "./api";
import { amber,brown } from '@mui/material/colors';
import Swal from 'sweetalert2'
import Mymenu from "./Components/Menu";
import Modal from '@mui/material/Modal';
import Publicmenu from "./Components/Publicmenu";
import Logo from './logo.png';
const theme = createTheme({
    palette: {
      primary: {
        main: amber[400],
      },
      secondary:{
        main:brown[800]
      }
    },
  });

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

interface PersonData {
    First_name: string;       // First name of the person
    Middle_name: string;     // Middle name (optional)
    Last_name: string;        // Last name of the person
    Date_of_birth: string;    // Date of birth in string format (or use Date if it's a Date object)
    Date_of_death: string;   // Date of death (optional)
    Relationship: string;     // Relationship (e.g., friend, family, etc.)
    Description: string;     // Additional description (optional)
    Profile_pic:string;
}
  
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

const ProfilePagepublic = () => {

    // const [profilePic, setProfilePic] = useState<File | null>(null);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [profileData,setprofiledata]=useState<PersonData|undefined>(undefined);
    const [value, setValue] = React.useState(0);
    const [medialinks,setMedialinks]=useState(Array<string>);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.heif', '.raw','.jfif','.avif'];
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.mpg', '.mpeg'];
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [modalpic,setmodalpic]=useState("");
    const [pfpic,setPfpic]=useState("")
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const url = window.location.href;

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      height:'auto',
      width:'auto',
      border: '2px solid black',
      maxWidth:'80%',
      maxHeight:'80%',
      overflowX:'auto',
      overflowY:'scroll'
    };
    
    const imglink="https://eternitas-media.s3.eu-central-1.amazonaws.com/"
    const personid=url.split("/")
    const pid=parseInt(personid[personid.length-1])

    
    const handleChange =(event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    useEffect(()=>{
        if(isNaN(Number(pid))){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid link"
                });
                return;
            }
      async function fetchprofile(){
        try{
            await getpublicprofiledata(pid).then(res=>{let pdata:PersonData=res?.data?res.data[0]:undefined;
            if(pdata!==undefined){
            setprofiledata(pdata);
            setPfpic(imglink+pdata.Profile_pic);
            }
        }
            )
        }
        catch(error:unknown){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Profile couldn't be fetched"
                });
        }
      }
      async function getmlinks() {
        try{
            let data:Array<string>=await getpublicmedia(pid);
            setMedialinks(data)
          }catch(error:any){
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Media couldn't be fetched"
              });
          }
        }
      fetchprofile();
      getmlinks();
    },[])



    const calculateAge = (Date_of_birth: string, Date_of_death?: string) => {
        const birthDate = new Date(Date_of_birth);
        const deathDateObj = Date_of_death ? new Date(Date_of_death) : new Date();
        let age = deathDateObj.getFullYear() - birthDate.getFullYear();
        const monthDiff = deathDateObj.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && deathDateObj.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleFullscreen = () => {
      const video = videoRef.current;
  
      if (video) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if ((video as any).webkitRequestFullscreen) {
          (video as any).webkitRequestFullscreen(); // Safari/Old Chrome
        } else if ((video as any).msRequestFullscreen) {
          (video as any).msRequestFullscreen(); // IE/Edge
        }
      }
    };

    return (
      <div>
        <Publicmenu/>
        <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <img src={Logo} alt="Logo" style={{ width: '150px' }} />
            </Box>
            <ThemeProvider theme={theme}>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <label htmlFor="profile-pic-upload">
                        <Avatar
                            sx={{
                                width: 150,
                                height: 150,  
                                bgcolor: 'secondary',
                                cursor: 'pointer',
                                position: 'relative',
                                marginTop:1,
                                border: '2px solid #ffca28',
                                '&:hover': { opacity: 0.8 }
                            }}
                        >
                            {profileData?.Profile_pic ? (
                                <img
                                    src={pfpic}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                    onError={()=>{setPfpic(`${process.env.PUBLIC_URL}/defaultprofile.jfif`)}}
                                />
                            ) : (
                                <Typography variant="h6" color="white">INCARCA</Typography>
                            )}
                        </Avatar>
                    </label>
                    <Box sx={{ width: '90%', borderBottom: '2px solid #ffca28', my: 2 }} />
                </Box>

                {profileData ? (
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: -2.5 }}>
                            {profileData.First_name && (
                                <Typography sx={{ mr: 1 }}>{profileData.First_name}</Typography>
                            )}
                            {profileData.Middle_name && (
                                <Typography sx={{ mr: 1 }}>{profileData.Middle_name}</Typography>
                            )}
                            {profileData.Last_name && (
                                <Typography>{profileData.Last_name}</Typography>
                                
                            )}
                        </Box>
                        <Box sx={{mb:1}}>
                        {profileData.Date_of_death && (
                                <Typography sx={{fontFamily:'Times New Roman'}}>
                                    <p></p>
                            {new Date(profileData.Date_of_birth).toLocaleDateString('en-GB')} - {new Date(profileData.Date_of_death).toLocaleDateString('en-GB')}
                             </Typography>)}
                        </Box>
                       
                        {profileData.Date_of_death && (
                            <Typography>
                                <strong>Age:</strong> {calculateAge(profileData.Date_of_birth, profileData.Date_of_death)} years
                            </Typography>
                        )}
                        {profileData.Relationship && (
                            <Typography>{profileData.Relationship}</Typography>
                        )}
                    </Box>
                ) : (
                    <Typography>No profile information provided.</Typography>
                )}
            </Box>
 
<Box sx={{ width: '100%'}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth" textColor="primary"> 
          <Tab label="About" {...a11yProps(0)} />
          <Tab label="Media" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
       {`${profileData?.Description?profileData.Description:""}`}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>

    <Box sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
      {medialinks.map((file,index)=>(
       <Typography>
       {imageExtensions.some(ext=>file.toLowerCase().endsWith(ext)) ? (
         <img
           src={imglink+file}
           onClick={()=>{
            setmodalpic(imglink+file);
            handleOpen();}}
           style={{
             width: 'auto',
             height: 215,
             objectFit: "contain",
             marginRight: 10,
             marginTop:35
           }}
           title={file.split("/").pop()}
         />
       ) : videoExtensions.some(ext=>file.toLowerCase().endsWith(ext)) ? (
         <video
           title={file.split("/").pop()}
           controls
           ref={videoRef}
           onPlay={handleFullscreen}
           style={{width: 'auto',
            height: 215,
            objectFit: "contain",
            marginRight: 10,
            marginTop:35}}
         >
           <source
             src={imglink+file}
             type={"video/"+file.split(".").pop()}
           />
           Your browser does not support the video tag.
         </video>
       ) : (
         <Typography variant="body2" sx={{ marginRight: 2 }}>
           {file}
         </Typography>
       )}
       </Typography>
       ))}
       </Box>

      </CustomTabPanel>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modalContent">
          <img src={modalpic} style={{display:"block"}}/>
        </Box>
      </Modal>
    </Box>
    </ThemeProvider>
        </Container>
        </div>
    );
};
export default ProfilePagepublic;
