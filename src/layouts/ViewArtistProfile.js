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

function ViewArtistProfile({ open, onClose, userId }) {
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
    const fetchArtworksByIds = async (artworkIds) => {
      try {
        console.log("Fetching artworks with IDs:", artworkIds);
        const artworkPromises = artworkIds.map((id) => axiosInstance.get(`/artworks/${id}`));
        const artworkResponses = await Promise.all(artworkPromises);
        const fetchedArtworks = artworkResponses.map((response) => response.data);
        console.log("Fetched artworks:", fetchedArtworks);
        setArtworks(fetchedArtworks);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      }
    };

    const fetchCompanyName = async (companyId) => {
      try {
        const response = await axiosInstance.get(`/companies/${companyId}`);
        return response.data.name;
      } catch (error) {
        console.error("Failed to fetch company name:", error);
        return "";
      }
    };

    const fetchArtistInfo = async () => {
      try {
        console.log("Fetching artist info for userId:", userId);
        const response = await axiosInstance.get(`/artists/${userId}`);
        console.log("Fetched artist info:", response.data);
        const artistData = response.data;

        if (artistData.company) {
          const companyName = await fetchCompanyName(artistData.company);
          artistData.companyName = companyName;
          setCompanyName(companyName);
        }

        setArtistInfo(artistData);

        if (artistData.artworks) {
          fetchArtworksByIds(artistData.artworks);
        }
      } catch (error) {
        console.error("Failed to fetch artist info:", error);
      }
    };

    if (userId) {
      fetchArtistInfo();
    }
  }, [userId]);

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
                <Grid item xs={12} md={6} xl={3} key={artwork._id}>
                  <DefaultProjectCard
                    image={artwork.imageUrl}
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
  userId: PropTypes.string.isRequired,
};

export default ViewArtistProfile;
