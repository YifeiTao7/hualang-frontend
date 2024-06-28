import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useUser } from "context/UserContext";
import axiosInstance from "api/axiosInstance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function MembershipModal({ open, onClose }) {
  const { user, setUser } = useUser();

  const handleMembershipChange = async (type) => {
    try {
      const response = await axiosInstance.post(`/companies/membership/${user._id}/subscribe`, {
        type,
      });
      setUser({
        ...user,
        membership: response.data.membership,
        membershipStartDate: response.data.membershipStartDate,
        membershipEndDate: response.data.membershipEndDate,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update membership:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          选择会员类型
        </Typography>
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={() => handleMembershipChange("trial")}
          >
            7天免费会员
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => handleMembershipChange("monthly")}
          >
            月度会员
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={() => handleMembershipChange("yearly")}
          >
            年度会员
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

MembershipModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MembershipModal;
