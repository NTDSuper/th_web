import React, {
  useState,
  useEffect,
  useContext,
  useRef
} from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  Alert
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

import fetchModel from "../../lib/fetchModelData";

import { AdvancedFeaturesContext } from "../../App";

import "./styles.css";

const API_BASE = "https://tf5pw3-8081.csb.app/api";

function TopBar(props) {

  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [contextText, setContextText] =
    useState("Photo App");

  const {
    advanced,
    setAdvanced
  } = useContext(AdvancedFeaturesContext);

  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSeverity, setUploadSeverity] = useState("success");

  useEffect(() => {

    // chua login thi khong fetch
    if (!props.currentUser) {
      return;
    }

    const path = location.pathname;

    const userDetailMatch =
      path.match(/^\/users\/([^/]+)$/);

    const userPhotosMatch =
      path.match(/^\/photos\/([^/]+)/);

    if (userDetailMatch) {

      const userId = userDetailMatch[1];

      fetchModel(`/user/${userId}`)
        .then((user) => {

          if (user) {
            setContextText(
              `${user.first_name} ${user.last_name}`
            );
          }

        })
        .catch(() => setContextText(""));

    } else if (userPhotosMatch) {

      const userId = userPhotosMatch[1];

      fetchModel(`/user/${userId}`)
        .then((user) => {

          if (user) {
            setContextText(
              `Photos of ${user.first_name} ${user.last_name}`
            );
          }

        })
        .catch(() => setContextText(""));

    } else {

      setContextText("Photo App");

    }

  }, [location, props.currentUser]);

  const handleLogout = () => {

    axios.post(`${API_BASE}/admin/logout`, {}, { withCredentials: true })
      .then(() => {

        props.setCurrentUser(null);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    axios
      .post(`${API_BASE}/photo/photos/new`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setUploadMsg("Photo uploaded successfully!");
        setUploadSeverity("success");
        setUploadOpen(true);
        // Notify App to refresh UserPhotos
        if (props.onPhotoUpload) props.onPhotoUpload();
        // Navigate to the current user's photos page
        if (props.currentUser) {
          navigate(`/photos/${props.currentUser._id}`);
        }
      })
      .catch((err) => {
        const msg =
          err.response && err.response.data
            ? err.response.data
            : "Failed to upload photo.";
        setUploadMsg(msg);
        setUploadSeverity("error");
        setUploadOpen(true);
      })
      .finally(() => {
        // Reset file input so the same file can be selected again
        e.target.value = "";
      });
  };

  return (
    <>
    <AppBar
      className="topbar-appBar"
      position="absolute"
    >

      <Toolbar className="topbar-toolbar">

        <Typography
          variant="h6"
          color="inherit"
          className="topbar-name"
        >
          Nguyen Tan Dung
        </Typography>

        <div className="topbar-right">

          {
            props.currentUser ? (
              <Typography
                variant="body1"
                color="inherit"
                sx={{ marginRight: "16px" }}
              >
                Hi {props.currentUser.first_name}
              </Typography>
            ) : (
              <Typography
                variant="body1"
                color="inherit"
                sx={{ marginRight: "16px" }}
              >
                Please Login
              </Typography>
            )
          }

          {/* {
            props.currentUser && (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ marginRight: "16px" }}
              >
                Logout
              </Button>
            )
          } */}

          <FormControlLabel
            className="topbar-checkbox-container"
            control={
              <Checkbox
                checked={advanced}
                onChange={(e) =>
                  setAdvanced(e.target.checked)
                }
                id="advanced-features-checkbox"
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&.Mui-checked": {
                    color: "#fff"
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                color="inherit"
                className="topbar-checkbox-label"
              >
                Photo Card Model
              </Typography>
            }
          />

          {props.currentUser && <Typography
            variant="h6"
            color="inherit"
            className="topbar-context"
          >
            {contextText}
          </Typography>
          }

          {
            props.currentUser && (
              <Button
                color="inherit"
                onClick={handleAddPhoto}
                sx={{ marginRight: "8px" }}
                id="add-photo-btn"
              >
                Add Photo
              </Button>
            )
          }

          {
            props.currentUser && (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ marginRight: "16px" }}
              >
                Logout
              </Button>
            )
          }
        </div>

      </Toolbar>

    </AppBar>

    {/* Hidden file input for photo upload */}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
      id="photo-upload-input"
    />

    {/* Upload feedback snackbar */}
    <Snackbar
      open={uploadOpen}
      autoHideDuration={4000}
      onClose={() => setUploadOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setUploadOpen(false)}
        severity={uploadSeverity}
        sx={{ width: "100%" }}
      >
        {uploadMsg}
      </Alert>
    </Snackbar>

    </>
  );
}

export default TopBar;