/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Select from "react-select";

function ExhibitionPage() {
  const { user } = useUser();
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [artistInfo, setArtistInfo] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [salePrice, setSalePrice] = useState("");
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axiosInstance.get(`/exhibitions/company/${user._id}`);
        setExhibitions(response.data);
      } catch (error) {
        console.error("获取展会安排失败:", error);
      }
    };

    if (user) {
      fetchExhibitions();
    }
  }, [user]);

  const handleExhibitionChange = async (selectedOption) => {
    const exhibitionId = selectedOption.value;
    setSelectedExhibition(exhibitionId);

    const exhibition = exhibitions.find((ex) => ex._id === exhibitionId);
    if (exhibition) {
      try {
        const artistResponse = await axiosInstance.get(`/artists/${exhibition.artistUserId}`);
        setArtistInfo(artistResponse.data);

        const artworksResponse = await axiosInstance.get(
          `/artworks/artist/${exhibition.artistUserId}`,
          {
            params: { isSold: false },
          }
        );
        setArtworks(artworksResponse.data);
      } catch (error) {
        console.error("获取画家信息或作品失败:", error);
      }
    }
  };

  const handleOpenDialog = (artwork) => {
    setSelectedArtwork(artwork);
    setSalePrice("");
  };

  const handleCloseDialog = () => {
    setSelectedArtwork(null);
  };

  const handleSellArtwork = async () => {
    try {
      const updatedArtwork = {
        ...selectedArtwork,
        isSold: true,
        salePrice: salePrice,
        saleDate: new Date(),
      };
      await axiosInstance.put(`/artworks/${selectedArtwork._id}`, updatedArtwork);
      setArtworks((prevArtworks) =>
        prevArtworks.map((artwork) =>
          artwork._id === selectedArtwork._id ? updatedArtwork : artwork
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error("出售作品失败:", error);
    }
  };

  const handleReturnArtwork = async (artwork) => {
    try {
      const updatedArtwork = {
        ...artwork,
        isSold: false,
        salePrice: null,
        saleDate: null,
      };
      await axiosInstance.put(`/artworks/${artwork._id}`, updatedArtwork);
      setArtworks((prevArtworks) =>
        prevArtworks.map((item) => (item._id === artwork._id ? updatedArtwork : item))
      );
    } catch (error) {
      console.error("退货作品失败:", error);
    }
  };

  const selectOptions = exhibitions.map((exhibition) => ({
    value: exhibition._id,
    label: `${exhibition.artistName} - ${new Date(exhibition.date).toLocaleDateString()}`,
  }));

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const paginatedArtworks = artworks.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
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
                  展会安排
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <Select
                  options={selectOptions}
                  onChange={handleExhibitionChange}
                  placeholder="选择展会"
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            {artistInfo && (
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h6">{artistInfo.name}</MDTypography>
                  <MDTypography variant="body2">{artistInfo.bio}</MDTypography>
                  <MDTypography variant="body2">{artistInfo.phone}</MDTypography>
                </MDBox>
              </Card>
            )}
          </Grid>
          <Grid item xs={12}>
            {artworks.length > 0 && (
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
                    本次展会作品
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{
                      columns: [
                        { Header: "编号", accessor: "serialNumber" },
                        {
                          Header: "图片",
                          accessor: "imageUrl",
                          Cell: ({ value }) => (
                            <img src={value} alt="Artwork" width={50} height={50} />
                          ),
                        },
                        { Header: "标题", accessor: "title" },
                        { Header: "描述", accessor: "description" },
                        { Header: "估计价格", accessor: "estimatedPrice" },
                        { Header: "尺寸", accessor: "size" },
                        {
                          Header: "操作",
                          accessor: "_id",
                          Cell: ({ value, row }) => (
                            <>
                              {!row.original.isSold ? (
                                <Button
                                  color="primary"
                                  onClick={() => handleOpenDialog(row.original)}
                                >
                                  售出
                                </Button>
                              ) : (
                                <Button
                                  color="secondary"
                                  onClick={() => handleReturnArtwork(row.original)}
                                >
                                  退货
                                </Button>
                              )}
                            </>
                          ),
                        },
                      ],
                      rows: paginatedArtworks.map((artwork) => ({
                        serialNumber: artwork.serialNumber,
                        imageUrl: artwork.imageUrl,
                        title: artwork.title,
                        description: artwork.description,
                        estimatedPrice: artwork.estimatedPrice,
                        size: artwork.size,
                        isSold: artwork.isSold,
                        _id: artwork._id,
                      })),
                    }}
                    isSorted={false}
                    entriesPerPage={10}
                    showTotalEntries={false}
                    noEndBorder
                    pagination={{
                      currentPage: page,
                      totalPages: Math.ceil(artworks.length / itemsPerPage),
                      onPageChange: handlePageChange,
                    }}
                  />
                </MDBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Dialog open={Boolean(selectedArtwork)} onClose={handleCloseDialog}>
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
      <Footer />
    </DashboardLayout>
  );
}

export default ExhibitionPage;
