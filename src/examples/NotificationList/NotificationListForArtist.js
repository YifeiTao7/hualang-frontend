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

function NotificationListForArtist({ open, onClose }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(`/notifications/user/${user.id}/unread`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const eventSource = new EventSource(
      `${process.env.REACT_APP_API_URL}notifications/events?userid=${user.id}`
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

  const handleAccept = async () => {
    try {
      console.log(`Accepting notification with ID: ${selectedNotification.id}`);
      const response = await axiosInstance.post(`/notifications/${selectedNotification.id}/accept`);
      console.log("Accept response:", response.data);

      await axiosInstance.post(`/notifications`, {
        senderid: user.id,
        receiverid: selectedNotification.senderid,
        type: "alert",
        content: `${user.name} 已接受您的邀请。`,
      });

      setNotifications((prev) => prev.filter((n) => n.id !== selectedNotification.id));
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to accept notification:", error);
    }
  };

  const handleDecline = async () => {
    try {
      // 拒绝邀请的请求
      await axiosInstance.post(`/notifications/${selectedNotification.id}/reject`);

      // 将拒绝邀请的通知发送给公司
      await axiosInstance.post(`/notifications`, {
        senderid: user.id,
        receiverid: selectedNotification.senderid,
        type: "alert",
        content: `${user.name} 已拒绝您的邀请。`,
      });

      setNotifications((prev) => prev.filter((n) => n.id !== selectedNotification.id));
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to decline notification:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // 删除通知的请求
      await axiosInstance.delete(`/notifications/${selectedNotification.id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== selectedNotification.id));
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleCloseNotification = () => {
    setSelectedNotification(null);
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
              key={notification.id}
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
              {selectedNotification.type === "invitation" ? (
                <>
                  <Button onClick={handleDecline} color="secondary">
                    拒绝
                  </Button>
                  <Button onClick={handleAccept} color="primary">
                    接受
                  </Button>
                </>
              ) : (
                <Button onClick={handleDelete} color="primary">
                  删除
                </Button>
              )}
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

NotificationListForArtist.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationListForArtist;
