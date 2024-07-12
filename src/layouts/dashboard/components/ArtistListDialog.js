import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useUser } from "context/UserContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import ViewArtistProfile from "layouts/ViewArtistProfile";

function ArtistListDialog({ open, onClose, onAdd, children }) {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user } = useUser();

  const handleSearchChange = async (e) => {
    const searchValue = e.target.value;
    console.log("Search value:", searchValue);
    setSearch(searchValue);

    if (searchValue) {
      try {
        const response = await axiosInstance.get(`/artists/search?name=${searchValue}`);
        console.log("Fetched artists:", response.data);
        setArtists(response.data);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      }
    } else {
      setArtists([]);
    }
  };

  const handleSendInvite = async (artist) => {
    console.log("User object:", user); // 打印 user 对象
    console.log("Artist object:", artist); // 打印 artist 对象

    if (!user || !user.id) {
      console.error("User ID is missing");
      return;
    }

    try {
      console.log("Sending invite to artist:", artist);
      const response = await axiosInstance.post("/notifications", {
        senderid: user.id,
        receiverid: artist.userid,
        type: "invitation",
        content: `您有一条新的邀请来自 ${user.name}`,
      });
      console.log("Invite response:", response.data);
      setSnackbarMessage(`已发送邀请给 ${artist.name}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  const handleViewProfile = (artistuserid) => {
    console.log("Navigating to artist profile with userid:", artistuserid);
    setSelectedArtistId(artistuserid);
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
    setSelectedArtistId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>添加新画师</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="搜索画家"
          value={search}
          onChange={handleSearchChange}
          margin="dense"
        />
        <List>
          {artists.map((artist) => (
            <ListItem key={artist.userid} style={{ display: "flex", alignItems: "center" }}>
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
              <Grid container justifyContent="flex-end" spacing={1}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleSendInvite(artist)}
                  >
                    添加
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleViewProfile(artist.userid)}
                  >
                    查看
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
      </DialogActions>
      {selectedArtistId && (
        <ViewArtistProfile
          open={profileDialogOpen}
          onClose={handleProfileDialogClose}
          userid={selectedArtistId} // 修改为小写 userid
        />
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

ArtistListDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ArtistListDialog;
