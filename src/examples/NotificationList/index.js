import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../api/axiosInstance";
import { useUser } from "../../context/UserContext";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import Icon from "@mui/material/Icon";

function NotificationList({ open, onClose }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [newExhibitionThreshold, setNewExhibitionThreshold] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(`/notifications/user/${user._id}/unread`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const eventSource = new EventSource(
      `${process.env.REACT_APP_API_URL}notifications/events?userId=${user._id}`
    );

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log("Received notification:", notification);
      setNotifications((prev) => [...prev, notification]);
      setSelectedNotification(notification); // 直接弹出通知对话框
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handleAccept = async () => {
    try {
      const response = await axiosInstance.post(
        `/notifications/${selectedNotification._id}/accept`
      );
      const newNotification = response.data;
      setNotifications((prev) => prev.filter((n) => n._id !== selectedNotification._id));
      setNotifications((prev) => [...prev, newNotification]);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to accept notification:", error);
    }
  };

  const handleDecline = async () => {
    try {
      const response = await axiosInstance.post(
        `/notifications/${selectedNotification._id}/reject`
      );
      const newNotification = response.data;
      setNotifications((prev) => prev.filter((n) => n._id !== selectedNotification._id));
      setNotifications((prev) => [...prev, newNotification]);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to decline notification:", error);
    }
  };

  const handleUpdateThreshold = async () => {
    if (!newExhibitionThreshold) return;
    try {
      await axiosInstance.put(`/artists/${selectedNotification.senderId}`, {
        exhibitionsHeld: newExhibitionThreshold,
      });
      setSelectedNotification(null);
      setNewExhibitionThreshold("");
      setNotifications((prev) => prev.filter((n) => n._id !== selectedNotification._id));
    } catch (error) {
      console.error("Failed to update exhibition threshold:", error);
    }
  };

  const handleCloseNotification = async () => {
    try {
      if (selectedNotification) {
        await axiosInstance.delete(`/notifications/${selectedNotification._id}`);
        setNotifications((prev) => prev.filter((n) => n._id !== selectedNotification._id));
        setSelectedNotification(null);
      }
      onClose();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <Dialog
      open={open || Boolean(selectedNotification)}
      onClose={handleCloseNotification}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>通知</DialogTitle>
      <DialogContent>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification._id}
              button
              onClick={() => handleNotificationClick(notification)}
            >
              <ListItemText primary={notification.content} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleNotificationClick(notification)}>
                  <Icon>chevron_right</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {selectedNotification && (
          <Dialog
            open={Boolean(selectedNotification)}
            onClose={() => setSelectedNotification(null)}
          >
            <DialogTitle>通知详情</DialogTitle>
            <DialogContent>
              <Typography>{selectedNotification.content}</Typography>
              {selectedNotification.type === "exhibition" && (
                <TextField
                  label="新的办展数量"
                  type="number"
                  value={newExhibitionThreshold}
                  onChange={(e) => setNewExhibitionThreshold(e.target.value)}
                  fullWidth
                />
              )}
            </DialogContent>
            <DialogActions>
              {selectedNotification.type === "invitation" ? (
                <>
                  <Button onClick={handleDecline} color="secondary">
                    拒绝
                  </Button>
                  <Button onClick={handleAccept} color="primary">
                    接受
                  </Button>
                </>
              ) : selectedNotification.type === "exhibition" ? (
                <>
                  <Button onClick={handleDecline} color="secondary">
                    暂缓
                  </Button>
                  <Button onClick={handleAccept} color="primary">
                    办展
                  </Button>
                  <Button onClick={handleUpdateThreshold} color="primary">
                    更新办展数量
                  </Button>
                </>
              ) : (
                <Button onClick={handleCloseNotification} color="primary">
                  关闭
                </Button>
              )}
            </DialogActions>
          </Dialog>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseNotification} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NotificationList.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationList;
