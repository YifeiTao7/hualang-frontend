import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

function UnbindArtistDialog({ open, onClose, onUnbind, artists }) {
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUnbind = () => {
    if (selectedArtistId) {
      onUnbind(selectedArtistId);
      setSnackbarMessage(
        `已解约画家 ${artists.find((artist) => artist.userid === selectedArtistId).name}`
      );
      setSnackbarOpen(true);
      setSelectedArtistId(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>解约画家</DialogTitle>
      <DialogContent>
        <List>
          {artists.map((artist) => (
            <ListItem
              key={artist.userid}
              button
              onClick={() => setSelectedArtistId(artist.userid)}
              selected={selectedArtistId === artist.userid}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ListItemAvatar>
                <Avatar src={artist.avatar || "/path/to/default/avatar.jpg"} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography style={{ flex: 1, whiteSpace: "nowrap", overflow: "visible" }}>
                    {artist.name}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={handleUnbind} color="secondary">
          解约
        </Button>
      </DialogActions>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

UnbindArtistDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUnbind: PropTypes.func.isRequired,
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      userid: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UnbindArtistDialog;
