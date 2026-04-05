import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../App";
import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const [contextText, setContextText] = useState("Photo App");
  const { advanced, setAdvanced } = useContext(AdvancedFeaturesContext);

  useEffect(() => {
    const path = location.pathname;
    const userDetailMatch = path.match(/^\/users\/([^/]+)$/);
    const userPhotosMatch = path.match(/^\/photos\/([^/]+)/);

    if (userDetailMatch) {
      const userId = userDetailMatch[1];
      fetchModel(`/user/${userId}`)
        .then((user) => {
          if (user) setContextText(`${user.first_name} ${user.last_name}`);
        })
        .catch(() => setContextText(""));
    } else if (userPhotosMatch) {
      const userId = userPhotosMatch[1];
      fetchModel(`/user/${userId}`)
        .then((user) => {
          if (user) setContextText(`Photos of ${user.first_name} ${user.last_name}`);
        })
        .catch(() => setContextText(""));
    } else {
      setContextText("Photo App");
    }
  }, [location]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" color="inherit" className="topbar-name">
          Nguyen Tan Dung
        </Typography>
        <div className="topbar-right">
          <FormControlLabel
            className="topbar-checkbox-container"
            control={
              <Checkbox
                checked={advanced}
                onChange={(e) => setAdvanced(e.target.checked)}
                id="advanced-features-checkbox"
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&.Mui-checked": { color: "#fff" },
                }}
              />
            }
            label={
              <Typography variant="body2" color="inherit" className="topbar-checkbox-label">
                Enable Advanced Features
              </Typography>
            }
          />
          <Typography variant="h6" color="inherit" className="topbar-context">
            {contextText}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
