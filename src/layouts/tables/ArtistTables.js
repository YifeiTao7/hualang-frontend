import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useUser } from "../../context/UserContext";

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
import SubmissionForm from "./components/SubmissionForm";

function ArtistTables() {
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axiosInstance.get(`/artworks/artist/${user.id}`);
        console.log("Fetched artworks:", response.data); // 调试信息
        setArtworks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      }
    };

    if (user && user.id) {
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
        prevArtworks.filter((artwork) => artwork.id !== selectedArtworkId)
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
      accessor: "imageurl",
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <img src={value} alt="Artwork" width={50} />,
    },
    { Header: "标题", accessor: "title" },
    { Header: "预估价格", accessor: "estimatedprice" }, // 确保这里使用正确的小写字段名
    { Header: "描述", accessor: "description" },
    { Header: "创建日期", accessor: "creationdate" }, // 使用小写
    {
      Header: "售出状态",
      accessor: "issold",
      Cell: ({ value }) => (value ? "已售出" : "未售出"),
    },
    {
      Header: "操作",
      accessor: "id",
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
    estimatedprice: artwork.estimatedprice, // 使用小写字段名
    imageurl: artwork.imageurl,
    creationdate: artwork.creationdate
      ? new Date(artwork.creationdate).toLocaleString()
      : "无效日期",
    issold: artwork.issold, // 新增售出状态字段
    id: artwork.id,
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
                <SubmissionForm onUploadSuccess={handleArtworkUpload} />
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
