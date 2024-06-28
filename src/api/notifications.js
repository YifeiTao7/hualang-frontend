import axiosInstance from "./axiosInstance";

// Fetch unread notifications
export const fetchUnreadNotifications = async (userId) => {
  try {
    const response = await axiosInstance.get(`/notifications/user/${userId}/unread`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.put(`/notifications/${notificationId}`, {
      status: "read",
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};
