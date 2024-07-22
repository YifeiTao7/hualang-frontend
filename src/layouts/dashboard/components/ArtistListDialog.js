import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import axiosInstance from "api/axiosInstance";
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
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // 防抖动函数
  const debounceSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue) {
        try {
          const response = await axiosInstance.get(`/artists/search?name=${searchValue}`);
          setArtists(response.data);
        } catch (error) {
          // 错误处理逻辑
        }
      } else {
        setArtists([]);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    debounceSearch(searchValue);
  };

  const handleSendInvite = async (artist) => {
    if (!user || !user.id) {
      return;
    }

    try {
      await axiosInstance.post("/notifications", {
        senderid: user.id,
        receiverid: artist.userid,
        type: "invitation",
        content: `您有一条新的邀请来自 ${user.name}`,
      });
      setSnackbarMessage(`已发送邀请给 ${artist.name}`);
      setSnackbarOpen(true);
    } catch (error) {
      // 错误处理逻辑
    }
  };

  const handleViewProfile = (artistuserid) => {
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen}>
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
                    {artist.name} (ID: {artist.userid})
                  </Typography>
                }
              />
              <Grid container justifyContent="flex-end" spacing={1} wrap="nowrap">
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleSendInvite(artist)}
                  >
                    添加
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
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
          userid={selectedArtistId}
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
