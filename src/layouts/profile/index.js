import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useUser } from "../../context/UserContext";

// @mui material 组件
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// 画廊管理系统组件
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// 画廊管理系统示例组件
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// 概览页面组件
import Header from "layouts/profile/components/Header";

function Profile() {
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const artworkResponse = await axiosInstance.get(`/artworks/artist/${user.id}`);
        setArtworks(artworkResponse.data);

        const profileResponse = await axiosInstance.get(`/artists/${user.id}`);
        setBio(profileResponse.data.bio);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    if (user && user.id) {
      fetchProfileData();
    }
  }, [user]);

  const handleEditBio = () => {
    setEditBio(bio);
    setEditBioOpen(true);
  };

  const handleSaveBio = async () => {
    try {
      const response = await axiosInstance.put(`/artists/${user.id}`, { bio: editBio });
      setBio(response.data.bio);
      setEditBioOpen(false);
    } catch (error) {
      console.error("Failed to save bio:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header />
      <MDBox pt={2} px={2} lineHeight={1.25}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MDBox maxWidth="100%" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
              <MDTypography variant="h6" fontWeight="medium">
                个人简介
                <Button onClick={handleEditBio} style={{ marginLeft: "1rem" }}>
                  编辑
                </Button>
              </MDTypography>
              <MDBox mb={1} maxWidth="100%">
                <MDTypography variant="body1" color="text">
                  {bio || "暂无简介"}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox pt={2} px={2} lineHeight={1.25}>
        <MDTypography variant="h6" fontWeight="medium">
          作品
        </MDTypography>
        <MDBox mb={1}>
          <MDTypography variant="button" color="text">
            画家作品
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {loading ? (
          <MDTypography variant="body1" color="text">
            加载中...
          </MDTypography>
        ) : (
          <Grid container spacing={6}>
            {artworks.slice(0, 4).map((artwork) => (
              <Grid item xs={12} md={6} xl={3} key={artwork.id}>
                <DefaultProjectCard
                  image={artwork.imageurl}
                  label="作品"
                  title={artwork.title}
                  description={artwork.description}
                  imageStyles={{
                    objectFit: "contain",
                    objectPosition: "center center",
                    height: "100%",
                    width: "100%",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>
      <Footer />
      <Dialog open={editBioOpen} onClose={() => setEditBioOpen(false)}>
        <DialogTitle>编辑个人简介</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="bio"
            label="个人简介"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditBioOpen(false)} color="primary">
            取消
          </Button>
          <Button onClick={handleSaveBio} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Profile;
