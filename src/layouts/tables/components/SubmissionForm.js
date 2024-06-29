/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../../api/axiosInstance"; // 更新路径以匹配您的项目结构
import { useUser } from "../../../context/UserContext"; // 使用useUser钩子

// @mui material components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const sizeOptions = [
  { label: "小品 33*33cm 1平方尺", value: "小品 33*33cm 1平方尺" },
  { label: "小品 45*33cm 1.4平方尺", value: "小品 45*33cm 1.4平方尺" },
  { label: "四尺三开 68*45cm 2.8平方尺", value: "四尺三开 68*45cm 2.8平方尺" },
  { label: "四尺对开斗方 68*68cm 4平方尺", value: "四尺对开斗方 68*68cm 4平方尺" },
  { label: "四尺对开长条 34*136cm 4平方尺", value: "四尺对开长条 34*136cm 4平方尺" },
  { label: "四尺整纸 68*136cm 8平方尺", value: "四尺整纸 68*136cm 8平方尺" },
  { label: "五尺整纸 81*155cm 11.5平方尺", value: "五尺整纸 81*155cm 11.5平方尺" },
  { label: "六尺整纸 96*178cm 15.6平方尺", value: "六尺整纸 96*178cm 15.6平方尺" },
  { label: "八尺整纸 122*244cm 27平方尺", value: "八尺整纸 122*244cm 27平方尺" },
  { label: "丈二整纸 144*366cm 48平方尺", value: "丈二整纸 144*366cm 48平方尺" },
  { label: "丈六整纸 200*498cm 92平方尺", value: "丈六整纸 200*498cm 92平方尺" },
];

function SubmissionForm({ onUploadSuccess }) {
  const { user } = useUser(); // 获取当前用户信息
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [size, setSize] = useState(""); // 新增尺寸状态
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // 图片预览
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFilePreview(URL.createObjectURL(file)); // 设置图片预览
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("estimatedPrice", estimatedPrice);
    formData.append("size", size); // 确保尺寸被传递
    formData.append("file", file);
    formData.append("artistId", user ? user._id : ""); // 使用当前用户的ID
    formData.append("artistName", user ? user.name : ""); // 添加 artistName

    try {
      const response = await axiosInstance.post("/upload/artwork", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        const newArtwork = response.data.artwork;
        onUploadSuccess(newArtwork); // 调用回调函数
        setSnackbarMessage("上传成功！");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        // 清空表单
        setTitle("");
        setDescription("");
        setEstimatedPrice("");
        setSize(""); // 重置尺寸状态
        setFile(null);
        setFilePreview(null); // 清除图片预览
      }
    } catch (error) {
      console.error("上传失败：", error);
      setSnackbarMessage("上传失败，请重试。");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Grid container spacing={2} sx={{ maxWidth: 800 }}>
        <Grid item xs={4} container direction="column" alignItems="center" justifyContent="center">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file" style={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                border: "2px dashed grey",
                borderRadius: 2,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                p: 2,
                color: "text.primary", // 设置颜色
              }}
            >
              {filePreview ? (
                <Box
                  component="img"
                  src={filePreview}
                  alt="Preview"
                  sx={{ width: "100%", height: "auto", borderRadius: 2 }}
                />
              ) : (
                <>
                  <IconButton color="inherit" aria-label="upload picture" component="span">
                    <PhotoCamera sx={{ fontSize: 32 }} />
                  </IconButton>
                  <Typography variant="body1" sx={{ fontSize: "1.25rem", textAlign: "center" }}>
                    {file ? file.name : "选择图片"}
                  </Typography>
                </>
              )}
            </Box>
          </label>
        </Grid>
        <Grid item xs={8}>
          <TextField
            required
            fullWidth
            id="title"
            label="标题"
            name="title"
            autoComplete="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            required
            fullWidth
            id="description"
            label="描述"
            name="description"
            autoComplete="description"
            multiline
            rows={2} // 调整描述输入框高度
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            required
            fullWidth
            id="estimatedPrice"
            label="预估价格"
            name="estimatedPrice"
            autoComplete="estimatedPrice"
            value={estimatedPrice}
            onChange={(e) => setEstimatedPrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 1 }}>
            {" "}
            {/* 调整字体大小 */}
            画作尺寸
          </Typography>
          <FormControl fullWidth required>
            <Select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              sx={{ mb: 2, height: "auto", minHeight: 30 }} // 调整尺寸选择框的高度
            >
              {sizeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          width: "50%",
          fontSize: "1.25rem",
          backgroundColor: "text.primary",
          color: "background.paper",
        }}
      >
        上传
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

SubmissionForm.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default SubmissionForm;
