import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; // 确保路径正确
import { useUser } from "../../context/UserContext"; // 使用useUser钩子

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import SubmissionForm from "./components/SubmissionForm"; // 创建提交作品部分组件

function ArtistTables() {
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axiosInstance.get(`/artworks/artist/${user._id}`);
        setArtworks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      }
    };

    if (user && user._id) {
      fetchArtworks();
    }
  }, [user]);

  const handleArtworkUpload = (newArtwork) => {
    setArtworks((prevArtworks) => [newArtwork, ...prevArtworks]);
  };

  const handleDeleteArtwork = async () => {
    try {
      await axiosInstance.delete(`/artworks/${selectedArtworkId}`);
      setArtworks((prevArtworks) =>
        prevArtworks.filter((artwork) => artwork._id !== selectedArtworkId)
      );
      setOpenDialog(false);
      setSelectedArtworkId(null);
    } catch (error) {
      console.error("Failed to delete artwork:", error);
    }
  };

  const handleOpenDialog = (artworkId) => {
    setSelectedArtworkId(artworkId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedArtworkId(null);
  };

  const columns = [
    {
      Header: "图片",
      accessor: "imageUrl",
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <img src={value} alt="Artwork" width={50} />,
    },
    { Header: "标题", accessor: "title" },
    { Header: "预估价格", accessor: "estimatedPrice" },
    { Header: "描述", accessor: "description" },
    { Header: "创建日期", accessor: "creationDate" },
    {
      Header: "操作",
      accessor: "_id",
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <IconButton color="error" onClick={() => handleOpenDialog(value)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const rows = artworks.map((artwork) => ({
    title: artwork.title,
    description: artwork.description,
    estimatedPrice: artwork.estimatedPrice,
    imageUrl: artwork.imageUrl,
    creationDate: new Date(artwork.creationDate).toLocaleString(),
    _id: artwork._id,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  提交作品
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <SubmissionForm onUploadSuccess={handleArtworkUpload} /> {/* 这里是提交作品部分 */}
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  作品库
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <MDTypography variant="body1" color="text">
                    加载中...
                  </MDTypography>
                ) : (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>你确定要删除这个作品吗？此操作无法撤销。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteArtwork} color="error">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default ArtistTables;
