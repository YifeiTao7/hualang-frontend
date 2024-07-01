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
} from "@mui/material";
import Icon from "@mui/material/Icon";

function CompanyNotificationList({ open, onClose, onArtistsUpdated = () => {} }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

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
      `http://localhost:5000/api/notifications/events?userId=${user._id}`
    );

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log("Received notification:", notification);
      setNotifications((prev) => [...prev, notification]);
      setSelectedNotification(notification); // 自动显示最新的通知
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

  const handleCloseNotification = async () => {
    setSelectedNotification(null);
    onArtistsUpdated(); // 更新项目数据
  };

  const handleDeleteNotification = async () => {
    try {
      if (selectedNotification) {
        await axiosInstance.delete(`/notifications/${selectedNotification._id}`);
        setNotifications((prev) => prev.filter((n) => n._id !== selectedNotification._id));
        setSelectedNotification(null);
        onArtistsUpdated(); // 更新项目数据
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          <Dialog open={Boolean(selectedNotification)} onClose={handleCloseNotification}>
            <DialogTitle>通知详情</DialogTitle>
            <DialogContent>
              <Typography>{selectedNotification.content}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteNotification} color="primary">
                删除
              </Button>
              <Button onClick={handleCloseNotification} color="primary">
                关闭
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CompanyNotificationList.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onArtistsUpdated: PropTypes.func.isRequired, // 新增的 prop
};

export default CompanyNotificationList;
