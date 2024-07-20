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
        const response = await axiosInstance.get(`/exhibitions/company/${user.id}`);
        setExhibitions(response.data);
      } catch (error) {
        console.error("获取展会安排失败:", error);
      }
    };

    if (user) {
      fetchExhibitions();
    }
  }, [user]);

  const fetchArtworks = async (artistId) => {
    try {
      const response = await axiosInstance.get(`/artworks/artist/${artistId}`, {
        params: { isSold: false },
      });
      setArtworks(response.data);
    } catch (error) {
      console.error("获取作品失败:", error);
    }
  };

  const handleExhibitionChange = async (selectedOption) => {
    const exhibitionId = selectedOption.value;
    const exhibition = exhibitions.find((ex) => ex.id === exhibitionId);

    setSelectedExhibition({
      id: exhibitionId,
      artistuserid: exhibition.artistuserid,
    });

    if (exhibition) {
      try {
        const artistResponse = await axiosInstance.get(`/artists/${exhibition.artistuserid}`);
        setArtistInfo(artistResponse.data);
        await fetchArtworks(exhibition.artistuserid);
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
      const sizeMatch = selectedArtwork.size.match(/(\d+(\.\d+)?)\s*平方尺/);
      const sizeInSquareFeet = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
      const artistPayment = selectedArtwork.signPrice * sizeInSquareFeet;

      const updatedArtwork = {
        ...selectedArtwork,
        isSold: true,
        salePrice: salePrice,
        saleDate: new Date(),
      };
      await axiosInstance.put(`/artworks/${selectedArtwork.id}`, updatedArtwork);
      await fetchArtworks(selectedExhibition.artistuserid); // 更新作品列表

      await axiosInstance.post(`/notifications`, {
        senderid: user.id,
        receiverid: selectedArtwork.artistid,
        type: "alert",
        content: `您的作品 "${
          selectedArtwork.title
        }" 已被售出，您获得的金额为 ${artistPayment.toFixed(2)}。`,
      });

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
      await axiosInstance.put(`/artworks/${artwork.id}`, updatedArtwork);
      await fetchArtworks(selectedExhibition.artistuserid); // 更新作品列表

      await axiosInstance.post(`/notifications`, {
        senderid: user.id,
        receiverid: artwork.artistid,
        type: "alert",
        content: `您的作品 "${artwork.title}" 已被退货。`,
      });
    } catch (error) {
      console.error("退货作品失败:", error);
    }
  };

  const selectOptions = exhibitions.map((exhibition) => ({
    value: exhibition.id,
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
                  noOptionsMessage={() => "暂无"} // 自定义无选项消息
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
                        { Header: "编号", accessor: "serialnumber" },
                        {
                          Header: "图片",
                          accessor: "imageurl",
                          Cell: ({ value }) => (
                            <img src={value} alt="Artwork" width={50} height={50} />
                          ),
                        },
                        { Header: "标题", accessor: "title" },
                        { Header: "尺寸", accessor: "size" },
                        {
                          Header: "出版状态",
                          accessor: "ispublished",
                          Cell: ({ value }) => (value ? "已出版" : "未出版"),
                        },
                        {
                          Header: "奖项",
                          accessor: "awarddetails",
                          Cell: ({ value }) => (value ? value : "无"),
                        },
                        {
                          Header: "状态",
                          accessor: "issold",
                          Cell: ({ value }) => (value ? "已售出" : "未售出"),
                        },
                        {
                          Header: "操作",
                          accessor: "id",
                          Cell: ({ value, row }) => (
                            <>
                              {!row.original.issold ? (
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
                        serialnumber: artwork.serialnumber,
                        imageurl: artwork.imageurl,
                        title: artwork.title,
                        size: artwork.size,
                        ispublished: artwork.ispublished,
                        awarddetails: artwork.awarddetails,
                        issold: artwork.issold,
                        id: artwork.id,
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
