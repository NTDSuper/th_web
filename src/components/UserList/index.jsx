import React, { useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const AVATAR_COLORS = [
  "#3949ab", "#00897b", "#e53935", "#8e24aa", "#f4511e", "#039be5",
];

function getAvatarColor(id) {
  const idx = parseInt(id.charAt(id.length - 1), 16) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(user) {
  return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
}

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchModel("/user/list").then((data) => {
      if (data) setUsers(data);
    });
  }, []);

  return (
    <div className="userlist-container">
      <div className="userlist-header">
        <Typography variant="overline" className="userlist-header-text">
          All Users
        </Typography>
      </div>
      <List disablePadding>
        {users.map((user, idx) => {
          const isActive =
            location.pathname.startsWith(`/users/${user._id}`) ||
            location.pathname.startsWith(`/photos/${user._id}`);
          return (
            <div key={user._id}>
              <ListItemButton
                component={Link}
                to={`/users/${user._id}`}
                className={`userlist-item${isActive ? " userlist-item--active" : ""}`}
                id={`user-list-item-${user._id}`}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getAvatarColor(user._id),
                      width: 40,
                      height: 40,
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      boxShadow: isActive
                        ? "0 0 0 3px rgba(57,73,171,0.3)"
                        : "none",
                      transition: "box-shadow 0.2s ease",
                    }}
                  >
                    {getInitials(user)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.9rem",
                    color: isActive ? "#1a237e" : "inherit",
                  }}
                />
              </ListItemButton>
              {idx < users.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </div>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;