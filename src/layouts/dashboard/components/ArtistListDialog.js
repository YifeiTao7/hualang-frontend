import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useUser } from "context/UserContext"; // 导入 useUser 钩子
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
import ViewArtistProfile from "layouts/ViewArtistProfile"; // 引入 ViewArtistProfile 组件

function ArtistListDialog({ open, onClose, onAdd, children }) {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user } = useUser(); // 使用 useUser 钩子获取当前用户信息

  const handleSearchChange = async (e) => {
    const searchValue = e.target.value;
    console.log("Search value:", searchValue); // 调试日志
    setSearch(searchValue);

    if (searchValue) {
      try {
        const response = await axiosInstance.get(`/artists/search?name=${searchValue}`);
        console.log("Fetched artists:", response.data); // 调试日志
        setArtists(response.data);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      }
    } else {
      setArtists([]);
    }
  };

  const handleSendInvite = async (artist) => {
    try {
      console.log("Sending invite to artist:", artist); // 调试日志
      await axiosInstance.post(`/notifications`, {
        senderId: user._id, // 发起邀请的用户ID
        receiverId: artist.userId, // 接收邀请的画家用户ID
        type: "invitation",
        content: `您有一条新的邀请来自 ${user.name}`,
      });
      setSnackbarMessage(`已发送邀请给 ${artist.name}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  const handleViewProfile = (artistUserId) => {
    console.log("Navigating to artist profile with userId:", artistUserId); // 调试日志
    setSelectedArtistId(artistUserId);
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
            <ListItem key={artist.userId} style={{ display: "flex", alignItems: "center" }}>
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
                    onClick={() => handleViewProfile(artist.userId)}
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
          userId={selectedArtistId}
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
  children: PropTypes.node, // children不再是必需的
};

export default ArtistListDialog;
