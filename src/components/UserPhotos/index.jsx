import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, Button, Divider } from "@mui/material";
import axios from "axios";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../App";
import "./styles.css";

const API_BASE = "https://tf5pw3-8081.csb.app/api/photo";

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
    // Fallback to the server's images directory for newly uploaded photos
    return `https://tf5pw3-8081.csb.app/images/${fileName}`;
  }
}

/**
 * PhotoCard – renders a single photo with its date and comments.
 */
function PhotoCard({ photo, onAddComment }) {
  const imgSrc = getImageSrc(photo.file_name);
  const comments = photo.comments || [];

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) {
      setError("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError("");

    axios
      .post(
        `${API_BASE}/commentsOfPhoto/${photo._id}`,
        { comment: trimmed },
        { withCredentials: true }
      )
      .then(() => {
        setCommentText("");
        if (onAddComment) onAddComment();
      })
      .catch((err) => {
        const msg =
          err.response && err.response.data
            ? err.response.data
            : "Failed to add comment.";
        setError(msg);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

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
          {formatDate(photo.date_time)}
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

      {/* ── Add Comment Form ──────────────────────────────── */}
      <div className="add-comment-section">
        <Typography variant="subtitle2" className="add-comment-title">
          Add a Comment
        </Typography>
        <div className="add-comment-form">
          <textarea
            className="add-comment-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              if (error) setError("");
            }}
            rows={2}
            id={`add-comment-input-${photo._id}`}
          />
          {error && (
            <Typography
              variant="caption"
              className="add-comment-error"
            >
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmitComment}
            disabled={submitting}
            className="add-comment-btn"
            id={`add-comment-btn-${photo._id}`}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
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

  const loadPhotos = () => {
    fetchModel(`/photo/${userId}`).then((data) => {
      if (data) setPhotos(data);
    });
  };

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (photos.length === 0) {
    return (
      <div className="userphotos-loading">
        <Typography color="text.secondary">The user hasn't uploaded any photos yet.</Typography>
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

        <PhotoCard photo={photo} onAddComment={loadPhotos} />

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
        <PhotoCard key={photo._id} photo={photo} onAddComment={loadPhotos} />
      ))}
    </div>
  );
}

export default UserPhotos;