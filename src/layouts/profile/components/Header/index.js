import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import { useUser } from "../../../../context/UserContext";

// @mui material 组件
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// 画廊管理系统组件
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// 图片
import backgroundImage from "assets/images/s591529137db2e.jpg";
import defaultAvatar from "assets/images/default_avatar.jpg";

function Header() {
  const { user } = useUser();
  const [artistInfo, setArtistInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    weChat: "",
    qq: "",
    company: "", // 初始化为字符串以避免初始渲染错误
    avatar: "", // 添加 avatar 属性
  });
  const [companyName, setCompanyName] = useState(""); // 添加公司名字状态
  const [editOpen, setEditOpen] = useState(false);
  const [editAvatarOpen, setEditAvatarOpen] = useState(false); // 添加状态来控制头像编辑对话框
  const [editValues, setEditValues] = useState({
    phone: "",
    address: "",
    weChat: "",
    qq: "",
  });
  const [newAvatar, setNewAvatar] = useState(null); // 添加状态来保存新头像

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const response = await axiosInstance.get(`/artists/${user.id}`);
        setArtistInfo(response.data);
        if (response.data.companyId) {
          fetchCompanyName(response.data.companyId);
        }
      } catch (error) {
        console.error("Failed to fetch artist info:", error);
      }
    };

    const fetchCompanyName = async (companyId) => {
      try {
        const response = await axiosInstance.get(`/companies/${companyId}`);
        setCompanyName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch company name:", error);
      }
    };

    if (user && user.id) {
      fetchArtistInfo();
    }
  }, [user]);

  const handleEditProfile = () => {
    setEditValues({
      phone: artistInfo.phone,
      address: artistInfo.address,
      weChat: artistInfo.weChat,
      qq: artistInfo.qq,
    });
    setEditOpen(true);
  };

  const handleEditAvatar = () => {
    setEditAvatarOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const handleCloseAvatarEdit = () => {
    setEditAvatarOpen(false);
  };

  const handleChange = (e) => {
    setEditValues({
      ...editValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(`/artists/${user.id}`, editValues);
      setArtistInfo(response.data);
      setEditOpen(false);
    } catch (error) {
      console.error("Failed to save artist info:", error);
    }
  };

  const handleSaveAvatar = async () => {
    if (newAvatar) {
      const formData = new FormData();
      formData.append("avatar", newAvatar);

      try {
        const response = await axiosInstance.put(`/artists/${user.id}/avatar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setArtistInfo({
          ...artistInfo,
          avatar: `${response.data.avatar}?t=${new Date().getTime()}`, // 添加随机参数
        });
        setEditAvatarOpen(false);
      } catch (error) {
        console.error("Failed to upload avatar:", error);
      }
    }
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <MDAvatar
              src={artistInfo.avatar || defaultAvatar} // 使用默认头像
              alt="profile-image"
              size="xl"
              shadow="sm"
              sx={{ marginRight: 2, cursor: "pointer" }}
              onClick={handleEditAvatar} // 添加点击事件来编辑头像
            />
          </Grid>
          <Grid item>
            <MDTypography variant="h4" fontWeight="medium">
              {artistInfo.name || "无名"}
            </MDTypography>
          </Grid>
          <Grid item xs>
            <MDBox height="100%" lineHeight={1} sx={{ textAlign: "center" }}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <MDTypography variant="h6" color="text" fontWeight="regular">
                    邮箱: {artistInfo.email || "无"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDTypography variant="h6" color="text" fontWeight="regular">
                    电话: {artistInfo.phone || "无"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDTypography variant="h6" color="text" fontWeight="regular">
                    地址: {artistInfo.address || "无"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDTypography variant="h6" color="text" fontWeight="regular">
                    微信: {artistInfo.weChat || "无"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDTypography variant="h6" color="text" fontWeight="regular">
                    QQ: {artistInfo.qq || "无"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MDTypography variant="h6" color="text" fontWeight="regular">
                    公司: {companyName || "无"}
                  </MDTypography>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
          <Grid item>
            <Tooltip title="编辑资料" placement="top">
              <Icon
                onClick={handleEditProfile}
                style={{ cursor: "pointer" }}
                fontSize="small"
                color="text"
              >
                edit
              </Icon>
            </Tooltip>
          </Grid>
        </Grid>
      </Card>
      <Dialog open={editOpen} onClose={handleCloseEdit}>
        <DialogTitle>编辑个人资料</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="phone"
            label="电话"
            type="text"
            fullWidth
            value={editValues.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="地址"
            type="text"
            fullWidth
            value={editValues.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="weChat"
            label="微信"
            type="text"
            fullWidth
            value={editValues.weChat}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="qq"
            label="QQ"
            type="text"
            fullWidth
            value={editValues.qq}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            取消
          </Button>
          <Button onClick={handleSave} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editAvatarOpen} onClose={handleCloseAvatarEdit}>
        <DialogTitle>上传头像</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAvatarEdit} color="primary">
            取消
          </Button>
          <Button onClick={handleSaveAvatar} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default Header;
