import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import square from "./Components/emptysquare.png";
import AddIcon from "@mui/icons-material/Add";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Grid,
  Tabs,
  Tab,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { getprofiledata, profileupload, mediaupload, getmedia } from "./api";
import { amber, brown, grey } from "@mui/material/colors";
import Swal from "sweetalert2";
import Mymenu from "./Components/Menu";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import Logo from "./logo.png";
import Namecomp from "./Components/Namecomp";

const theme = createTheme({
  palette: {
    primary: {
      main: amber[400],
    },
    secondary: {
      main: brown[800],
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface PersonData {
  id: number;
  First_name: string; // First name of the person
  Middle_name: string; // Middle name (optional)
  Last_name: string; // Last name of the person
  Date_of_birth: string; // Date of birth in string format (or use Date if it's a Date object)
  Date_of_death: string; // Date of death (optional)
  Relationship: string; // Relationship (e.g., friend, family, etc.)
  Description: string; // Additional description (optional)
  Profile_pic: string;
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
      {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProfilePage = () => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [profileData, setprofiledata] = useState<PersonData | undefined>(
    undefined
  );
  const [value, setValue] = React.useState(0);
  const [medialinks, setMedialinks] = useState(Array<string>);
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".tif",
    ".webp",
    ".heif",
    ".raw",
    ".jfif",
    ".avif",
  ];
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mkv",
    ".mov",
    ".wmv",
    ".flv",
    ".webm",
    ".mpg",
    ".mpeg",
  ];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalpic, setmodalpic] = useState("");
  const [pfpic, setPfpic] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [remsq, setRemsq] = useState(3);
  const fileInputRef = useRef(null);

  const style = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflowX: "auto",
    overflowY: "scroll",
    p: "0.8%",
    borderRadius: 2,
  };

  const imglink = "https://eternitas-media.s3.eu-central-1.amazonaws.com/";

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function fetchprofile() {
      try {
        await getprofiledata().then((res) => {
          const pdata: PersonData = res?.data ? res.data[0] : undefined;
          if (pdata !== undefined) {
            setprofiledata(pdata);
            setPfpic(imglink + pdata.Profile_pic);
          } else {
            navigate("/profilepagesetup");
          }
        });
      } catch (error: unknown) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Profile couldn't be fetched",
        });
      }
    }
    fetchprofile();
  }, []);

  useEffect(() => {
    async function getmlinks() {
      try {
        const data: Array<string> = await getmedia();
        setMedialinks(data);
        setRemsq(3 - (data.length % 3));
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Media couldn't be fetched",
        });
      }
    }
    getmlinks();
  }, []);

  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event?.target?.files && profileData) {
      // setProfilePic(event.target.files[0]);
      const file = event.target.files[0];
      try {
        await profileupload(file);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Profile picture was updated",
        }).then(() => {
          window.location.reload();
        });
      } catch (error: unknown) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Profile picture update failed (will disappear on reload)",
        });
      }
    }
  };

  const handleMediaChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event?.target?.files && mediaFiles) {
      const filesArray = Array.from(event.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);

      const mediaset: Set<string | undefined> = new Set(
        medialinks.map((item) => item.split("/").pop())
      );

      filesArray.forEach((ele) => {
        if (mediaset.has(ele.name)) {
          Swal.fire({
            icon: "error",
            title: "Duplicate",
            text: `Media file with name:${ele.name} already exists`,
          });
        }
      });

      try {
        await mediaupload(filesArray);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Încărcarea fișierelor media a fost realizată cu succes",
        }).then(() => {
          window.location.reload();
        });
      } catch (error: unknown) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Media files update failed (will disappear on reload)",
        });
      }
    }

    event.target.value = "";
  };
  const handleEditMedia = (index: number) => {
    console.log("Edit media at index:", index);
  };

  const calculateAge = (Date_of_birth: string, Date_of_death?: string) => {
    const birthDate = new Date(Date_of_birth);
    const deathDateObj = Date_of_death ? new Date(Date_of_death) : new Date();
    let age = deathDateObj.getFullYear() - birthDate.getFullYear();
    const monthDiff = deathDateObj.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && deathDateObj.getDate() < birthDate.getDate())
    ) {
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
    <>
      {profileData?.id && <Mymenu uid={profileData.id} />}

      <Container
        sx={{ flex: "display", justifyContent: "center", alignItems: "center" }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4, pt: 3 }}>
          <img src={Logo} alt="Logo" style={{ width: "150px" }} />
        </Box>

        <ThemeProvider theme={theme}>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={{ display: "none" }}
                id="profile-pic-upload"
              />
              <label htmlFor="profile-pic-upload">
                <Avatar
                  sx={{
                    width: 170,
                    height: 170,
                    bgcolor: "secondary",
                    cursor: "pointer",
                    position: "relative",
                    marginTop: 1,
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  {profileData?.Profile_pic ? (
                    <img
                      src={pfpic}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      onError={() => {
                        setPfpic(
                          `${process.env.PUBLIC_URL}/defaultprofile.jfif`
                        );
                      }}
                    />
                  ) : (
                    <Typography variant="h6" color="white">
                      INCARCA
                    </Typography>
                  )}
                </Avatar>
              </label>
            </Box>

            {profileData ? (
              <Box sx={{ mt: 3 }}>
                <Namecomp
                  first_name={profileData.First_name}
                  middle_name={profileData.Middle_name}
                  last_name={profileData.Last_name}
                  fweight={700}
                  fsize="20px"
                />

                {profileData.Date_of_death && profileData.Date_of_birth && (
                  <Typography
                    sx={{ fontFamily: "Times New Roman", fontWeight: 700 }}
                  >
                    <p></p>
                    {new Date(profileData.Date_of_birth).toLocaleDateString(
                      "ro-RO"
                    )}{" "}
                    -{" "}
                    {new Date(profileData.Date_of_death).toLocaleDateString(
                      "ro-RO"
                    )}
                  </Typography>
                )}

                {profileData.Date_of_death && (
                  <Typography
                    sx={{ fontFamily: "Times New Roman", fontWeight: 700 }}
                  >
                    Vârstă:{" "}
                    {calculateAge(
                      profileData.Date_of_birth,
                      profileData.Date_of_death
                    )}{" "}
                    ani
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography>No profile information provided.</Typography>
            )}
          </Box>

          <Box sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="fullWidth"
                textColor="primary"
              >
                <Tab label="Despre" {...a11yProps(0)} />
                <Tab label="Media" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {`${profileData?.Description ? profileData.Description : ""}`}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {/* <Button component="label">
                Incarca amintiri
                <input
                  type="file"
                  onChange={handleMediaChange}
                  hidden
                  multiple
                  accept="image/*,video/*"
                />
              </Button> */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                {medialinks.map((file, index) => (
                  <Box>
                    {imageExtensions.some((ext) =>
                      file.toLowerCase().endsWith(ext)
                    ) ? (
                      <img
                        src={imglink + file}
                        onClick={() => {
                          setmodalpic(imglink + file);
                          handleOpen();
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: 1 / 1,
                          objectFit: "cover",
                        }}
                        title={file.split("/").pop()}
                      />
                    ) : videoExtensions.some((ext) =>
                        file.toLowerCase().endsWith(ext)
                      ) ? (
                      <video
                        title={file.split("/").pop()}
                        controls
                        ref={videoRef}
                        onPlay={handleFullscreen}
                        style={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: 1 / 1,
                          objectFit: "cover",
                        }}
                      >
                        <source
                          src={imglink + file}
                          type={"video/" + file.split(".").pop()}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Typography variant="body2" sx={{ marginRight: 2 }}>
                        {file}
                      </Typography>
                    )}
                  </Box>
                ))}

                {Array.from({ length: remsq }).map(() => (
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button component="label" sx={{ p: 0 }}>
                      <img
                        src={square}
                        style={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: 1 / 1,
                          objectFit: "cover",
                        }}
                      />
                      <AddIcon
                        sx={{
                          position: "absolute",
                          width: "20%",
                          height: "20%",
                          color: "black",
                        }}
                      />
                      <input
                        type="file"
                        onChange={handleMediaChange}
                        hidden
                        multiple
                        accept="image/*,video/*"
                      />
                    </Button>
                  </Box>
                ))}
              </Box>
            </CustomTabPanel>
          </Box>
        </ThemeProvider>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="modalContent">
            <img
              src={modalpic}
              style={{
                objectFit: "contain",
                maxHeight: "85vh",
                maxWidth: "85vw",
              }}
            />
          </Box>
        </Modal>
      </Container>
    </>
  );
};
export default ProfilePage;
