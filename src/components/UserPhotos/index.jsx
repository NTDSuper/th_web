import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, Button, Divider } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../App";
import "./styles.css";

/**
 * Format a date string into a human-friendly string.
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Dynamically require an image from the local images directory.
 * Falls back to null if the image is not found.
 */
function getImageSrc(fileName) {
  try {
    /* eslint-disable-next-line import/no-dynamic-require */
    return require(`../../images/${fileName}`);
  } catch (e) {
    return null;
  }
}

/**
 * PhotoCard – renders a single photo with its date and comments.
 */
function PhotoCard({ photo }) {
  const imgSrc = getImageSrc(photo.file_name);
  const comments = photo.comments || [];

  return (
    <div className="photo-card" id={`photo-${photo._id}`}>
      <div className="photo-image-wrapper">
        {imgSrc ? (
          <img src={imgSrc} alt={photo.file_name} className="photo-image" />
        ) : (
          <div className="photo-image-placeholder">
            <Typography variant="body2" color="text.secondary">
              Image not available
            </Typography>
          </div>
        )}
      </div>

      <div className="photo-meta">
        <Typography variant="caption" className="photo-date">
          📅 {formatDate(photo.date_time)}
        </Typography>
      </div>

      {comments.length > 0 ? (
        <div className="photo-comments">
          <Typography variant="subtitle2" className="photo-comments-title">
            Comments ({comments.length})
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {comments.map((c) => (
            <div key={c._id} className="comment-item" id={`comment-${c._id}`}>
              <div className="comment-header">
                <Link
                  to={`/users/${c.user._id}`}
                  className="comment-author-link"
                  id={`comment-author-${c._id}`}
                >
                  {c.user.first_name} {c.user.last_name}
                </Link>
                <Typography variant="caption" className="comment-date">
                  {formatDate(c.date_time)}
                </Typography>
              </div>
              <Typography variant="body2" className="comment-text">
                {c.comment}
              </Typography>
            </div>
          ))}
        </div>
      ) : (
        <div className="photo-no-comments">
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        </div>
      )}
    </div>
  );
}

/**
 * Define UserPhotos, a React component of Project 4.
 * Supports both all-photos view and single-photo stepper (Advanced Features).
 */
function UserPhotos() {
  const { userId, photoIndex } = useParams();
  const [photos, setPhotos] = useState([]);
  const { advanced } = useContext(AdvancedFeaturesContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel(`/photosOfUser/${userId}`).then((data) => {
      if (data) setPhotos(data);
    });
  }, [userId]);

  if (photos.length === 0) {
    return (
      <div className="userphotos-loading">
        <Typography color="text.secondary">Loading photos...</Typography>
      </div>
    );
  }

  /* ── STEPPER MODE (Advanced Features enabled) ─────────────── */
  if (advanced) {
    const currentIndex =
      photoIndex !== undefined ? parseInt(photoIndex, 10) : 0;
    const safeIndex = Math.max(0, Math.min(currentIndex, photos.length - 1));
    const photo = photos[safeIndex];

    const goTo = (idx) => navigate(`/photos/${userId}/${idx}`);

    return (
      <div className="userphotos-stepper-wrapper">
        <div className="stepper-header">
          <Typography variant="caption" className="stepper-count">
            Photo {safeIndex + 1} of {photos.length}
          </Typography>
        </div>

        <PhotoCard photo={photo} />

        <div className="stepper-controls">
          <Button
            variant="outlined"
            onClick={() => goTo(safeIndex - 1)}
            disabled={safeIndex === 0}
            className="stepper-btn"
            id="stepper-prev-btn"
          >
            ← Previous
          </Button>

          <div className="stepper-dots">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`stepper-dot${i === safeIndex ? " stepper-dot--active" : ""}`}
                onClick={() => goTo(i)}
                title={`Photo ${i + 1}`}
                aria-label={`Go to photo ${i + 1}`}
                id={`stepper-dot-${i}`}
              />
            ))}
          </div>

          <Button
            variant="outlined"
            onClick={() => goTo(safeIndex + 1)}
            disabled={safeIndex === photos.length - 1}
            className="stepper-btn"
            id="stepper-next-btn"
          >
            Next →
          </Button>
        </div>
      </div>
    );
  }

  /* ── ALL-PHOTOS MODE (default) ────────────────────────────── */
  return (
    <div className="userphotos-container">
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} />
      ))}
    </div>
  );
}

export default UserPhotos;