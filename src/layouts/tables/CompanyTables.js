/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axiosInstance from "api/axiosInstance";
import { useUser } from "context/UserContext";
import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function CompanyTables() {
  const { user } = useUser();
  const [projectsColumns, setProjectsColumns] = useState([]);
  const [projectsRows, setProjectsRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [salePrice, setSalePrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setProjectsColumns([
      {
        Header: "图片",
        accessor: "imageUrl",
        Cell: ({ value }) => (
          <img src={value || "/path/to/default/image.jpg"} alt="Artwork" width={50} height={50} />
        ),
      },
      { Header: "标题", accessor: "title" },
      { Header: "描述", accessor: "description" },
      { Header: "估计价格", accessor: "estimatedPrice" },
      { Header: "售出价格", accessor: "salePrice" },
      { Header: "作者", accessor: "artistName" },
      {
        Header: "状态",
        accessor: "isSold",
        Cell: ({ value }) => (value ? "已售出" : "未售出"),
      },
      {
        Header: "操作",
        accessor: "_id",
        Cell: ({ value, row }) => (
          <>
            {!row.original.isSold ? (
              <Button color="primary" onClick={() => handleOpenDialog(row.original)}>
                售出
              </Button>
            ) : (
              <Button color="secondary" onClick={() => handleReturnArtwork(row.original)}>
                退货
              </Button>
            )}
          </>
        ),
      },
    ]);
  }, []);

  const fetchArtworks = async (query) => {
    try {
      const response = await axiosInstance.get(`/artworks/search`, {
        params: { query, companyId: user._id },
      });
      const artworksData = response.data;

      const formattedRows = artworksData.map((artwork) => {
        const artistId = artwork.artist?.userId; // 获取 artist.userId
        console.log("Artwork artistId:", artistId); // 添加调试信息
        return {
          imageUrl: artwork.imageUrl,
          title: artwork.title,
          description: artwork.description,
          estimatedPrice: artwork.estimatedPrice,
          salePrice: artwork.salePrice || "",
          isSold: artwork.isSold,
          artistName: artwork.artistName,
          artistId: artistId, // 确保这里有 artistId 字段
          saleDate: artwork.saleDate,
          _id: artwork._id,
        };
      });
      setProjectsRows(formattedRows);
      setFilteredRows(formattedRows);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    }
  };

  const fetchArtworksWithDebounce = useCallback(
    debounce((query) => {
      fetchArtworks(query);
    }, 1000),
    []
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    fetchArtworksWithDebounce(e.target.value);
  };

  const handleOpenDialog = (artwork) => {
    setSelectedArtwork(artwork);
    setSalePrice("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedArtwork(null);
  };

  const handleSellArtwork = async () => {
    try {
      console.log("Selected artwork for selling:", selectedArtwork); // 添加调试信息
      if (!selectedArtwork.artistId) {
        throw new Error("Selected artwork does not have artistId");
      }

      const updatedArtwork = {
        ...selectedArtwork,
        isSold: true,
        salePrice: salePrice,
        saleDate: new Date(),
      };
      await axiosInstance.put(`/artworks/${selectedArtwork._id}`, updatedArtwork);
      setProjectsRows((prevRows) =>
        prevRows.map((row) => (row._id === selectedArtwork._id ? updatedArtwork : row))
      );
      setFilteredRows((prevRows) =>
        prevRows.map((row) => (row._id === selectedArtwork._id ? updatedArtwork : row))
      );

      console.log("Sending notification with receiverId:", selectedArtwork.artistId);

      // 发送通知给作品的作者
      await axiosInstance.post(`/notifications`, {
        senderId: user._id,
        receiverId: selectedArtwork.artistId, // 使用 artistId 字段作为 receiverId
        type: "alert",
        content: `您的作品 "${selectedArtwork.title}" 已被售出，售出价格为 ${salePrice}。`,
      });

      handleCloseDialog();
    } catch (error) {
      console.error("Failed to sell artwork:", error);
    }
  };

  const handleReturnArtwork = async (artwork) => {
    try {
      console.log("Selected artwork for return:", artwork); // 添加调试信息
      if (!artwork.artistId) {
        throw new Error("Artwork does not have artistId");
      }

      const updatedArtwork = {
        ...artwork,
        isSold: false,
        salePrice: null,
        saleDate: null,
      };
      await axiosInstance.put(`/artworks/${artwork._id}`, updatedArtwork);
      setProjectsRows((prevRows) =>
        prevRows.map((row) => (row._id === artwork._id ? updatedArtwork : row))
      );
      setFilteredRows((prevRows) =>
        prevRows.map((row) => (row._id === artwork._id ? updatedArtwork : row))
      );

      console.log("Sending notification with receiverId:", artwork.artistId);

      // 发送通知给作品的作者
      await axiosInstance.post(`/notifications`, {
        senderId: user._id,
        receiverId: artwork.artistId, // 使用 artistId 字段作为 receiverId
        type: "alert",
        content: `您的作品 "${artwork.title}" 已被退货。`,
      });
    } catch (error) {
      console.error("Failed to return artwork:", error);
    }
  };

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
                  作品库存
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <TextField
                  fullWidth
                  label="搜索作品"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  margin="dense"
                />
                <DataTable
                  table={{ columns: projectsColumns, rows: filteredRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>售出作品</DialogTitle>
        <DialogContent>
          <TextField
            label="售出价格"
            type="number"
            fullWidth
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            取消
          </Button>
          <Button onClick={handleSellArtwork} color="primary">
            售出
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default CompanyTables;
