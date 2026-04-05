import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Button, Divider, Chip } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModel(`/user/${userId}`).then((data) => {
      if (data) setUser(data);
    });
  }, [userId]);

  if (!user) {
    return (
      <div className="userdetail-loading">
        <Typography color="text.secondary">Loading user...</Typography>
      </div>
    );
  }

  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="userdetail-container">
      <div className="userdetail-hero">
        <div className="userdetail-avatar">{initials}</div>
        <Typography variant="h5" className="userdetail-name">
          {user.first_name} {user.last_name}
        </Typography>
        {user.occupation && (
          <Chip label={user.occupation} size="small" className="userdetail-chip" />
        )}
      </div>

      <Divider sx={{ mx: 3 }} />

      <div className="userdetail-info">
        {user.location && (
          <div className="userdetail-info-row" id={`user-location-${user._id}`}>
            <span className="userdetail-info-icon">📍</span>
            <Typography variant="body2" color="text.secondary">
              {user.location}
            </Typography>
          </div>
        )}
        {user.occupation && (
          <div className="userdetail-info-row" id={`user-occupation-${user._id}`}>
            <span className="userdetail-info-icon">💼</span>
            <Typography variant="body2" color="text.secondary">
              {user.occupation}
            </Typography>
          </div>
        )}
      </div>

      {user.description && (
        <div className="userdetail-description" id={`user-description-${user._id}`}>
          <Typography variant="body2" className="userdetail-description-text">
            {user.description}
          </Typography>
        </div>
      )}

      <div className="userdetail-actions">
        <Button
          variant="contained"
          component={Link}
          to={`/photos/${user._id}`}
          className="userdetail-photos-btn"
          id={`view-photos-btn-${user._id}`}
        >
          View Photos
        </Button>
      </div>
    </div>
  );
}

export default UserDetail;