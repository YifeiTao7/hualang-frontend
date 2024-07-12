import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import axiosInstance from "../api/axiosInstance";

function ViewArtistProfile({ open, onClose, userid }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artistInfo, setArtistInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    weChat: "",
    qq: "",
    company: "",
    avatar: "",
    bio: "",
  });
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axiosInstance.get(`/artists/${userid}`);
        const artistData = profileResponse.data;
        setArtistInfo(artistData);

        if (artistData.company) {
          const companyResponse = await axiosInstance.get(`/companies/${artistData.company}`);
          setCompanyName(companyResponse.data.name);
        }

        const artworksResponse = await axiosInstance.get(`/artworks/artist/${userid}`);
        setArtworks(artworksResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch artist info and artworks:", error);
        setLoading(false);
      }
    };

    if (userid) {
      fetchProfileData();
    }
  }, [userid]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>画家资料</DialogTitle>
      <DialogContent>
        <MDBox mt={3} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <ProfileInfoCard
                title="个人信息"
                info={{ ...artistInfo, company: companyName }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            个人简介
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="body1" color="text">
              {artistInfo.bio || "暂无个人简介"}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            作品
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              画家设计作品
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ViewArtistProfile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userid: PropTypes.number.isRequired,
};

export default ViewArtistProfile;
