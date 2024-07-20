import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../../api/axiosInstance";
import { useUser } from "../../../context/UserContext";

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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

const themes = ["花鸟", "山水", "人物", "书法"];
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
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [size, setSize] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isAwardWinning, setIsAwardWinning] = useState(false);
  const [awardDetails, setAwardDetails] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // 新增的加载状态

  useEffect(() => {
    if (!user) {
      console.error("User is not available");
    } else {
      console.log("User ID:", user.id);
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !user.id) {
      console.error("User ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("theme", theme);
    formData.append("size", size);
    formData.append("file", file);
    formData.append("isAwardWinning", isAwardWinning);
    formData.append("awardDetails", isAwardWinning ? awardDetails : "");
    formData.append("isPublished", isPublished);
    formData.append("artistId", user.id);

    setLoading(true); // 开始上传时设置加载状态

    try {
      const response = await axiosInstance.post("/upload/artwork", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        const newArtwork = response.data.artwork;
        onUploadSuccess(newArtwork);
        setSnackbarMessage("上传成功！");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTitle("");
        setTheme("");
        setSize("");
        setFile(null);
        setFilePreview(null);
        setIsAwardWinning(false);
        setAwardDetails("");
        setIsPublished(false);
      }
    } catch (error) {
      console.error("上传失败：", error);
      setSnackbarMessage("上传失败，请重试。");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // 上传完成后取消加载状态
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
                color: "text.primary",
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
          <Typography variant="body2" sx={{ mb: 1 }}>
            画作题材
          </Typography>
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                选择题材
              </MenuItem>
              {themes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ mb: 1 }}>
            画作尺寸
          </Typography>
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <Select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                选择尺寸
              </MenuItem>
              {sizeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAwardWinning}
                onChange={(e) => setIsAwardWinning(e.target.checked)}
              />
            }
            label="是否获奖"
          />
          {isAwardWinning && (
            <TextField
              fullWidth
              label="奖项详情"
              value={awardDetails}
              onChange={(e) => setAwardDetails(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            }
            label="是否出版"
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        disabled={loading} // 上传时禁用按钮
        sx={{
          mt: 3,
          mb: 2,
          width: "50%",
          fontSize: "1rem",
          bgcolor: "#2196f3",
          color: "#fff",
          "&:hover": {
            bgcolor: "#1e88e5",
          },
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "上传"}
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
