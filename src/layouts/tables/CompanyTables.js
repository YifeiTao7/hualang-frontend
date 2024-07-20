/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
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
        accessor: "imageurl",
        Cell: ({ value }) => (
          <img src={value || "/path/to/default/image.jpg"} alt="Artwork" width={50} height={50} />
        ),
      },
      { Header: "标题", accessor: "title" },
      { Header: "题材", accessor: "theme" },
      {
        Header: "售出价格",
        accessor: "saleprice",
        Cell: ({ value }) => {
          if (value === null || value === undefined || isNaN(value)) {
            return "暂无";
          }
          return parseFloat(value).toFixed(2);
        },
      },
      { Header: "作者", accessor: "artistname" },
      { Header: "画家ID", accessor: "artistid" },
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
        params: { query, companyId: user.id },
      });
      const artworksData = response.data;

      if (!artworksData || !Array.isArray(artworksData)) {
        throw new Error("Invalid artworks data");
      }

      const formattedRows = artworksData.map((artwork) => {
        return {
          imageurl: artwork.imageurl,
          title: artwork.title,
          theme: artwork.theme,
          saleprice: artwork.issold
            ? artwork.saleprice !== null
              ? artwork.saleprice
              : "暂无"
            : "0",
          issold: artwork.issold,
          artistname: artwork.artistname,
          artistid: artwork.artistid,
          saledate: artwork.saledate,
          id: artwork.id,
          size: artwork.size,
          signPrice: artwork.signprice,
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
      const updatedArtwork = {
        isSold: true,
        salePrice: salePrice || 0,
      };

      const response = await axiosInstance.put(`/artworks/${selectedArtwork.id}`, updatedArtwork);
      const artistPayment = response.data.artistPayment;
      fetchArtworks(searchQuery);

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
      console.error("Failed to sell artwork:", error);
    }
  };

  const handleReturnArtwork = async (artwork) => {
    try {
      const updatedArtwork = {
        isSold: false,
        salePrice: null,
      };

      await axiosInstance.put(`/artworks/${artwork.id}`, updatedArtwork);
      fetchArtworks(searchQuery);

      await axiosInstance.post(`/notifications`, {
        senderid: user.id,
        receiverid: artwork.artistid,
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

CompanyTables.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  projectsColumns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func,
    })
  ),
  projectsRows: PropTypes.arrayOf(
    PropTypes.shape({
      imageurl: PropTypes.string,
      title: PropTypes.string,
      theme: PropTypes.string,
      saleprice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      issold: PropTypes.bool,
      artistname: PropTypes.string,
      artistid: PropTypes.number,
      saledate: PropTypes.string,
      id: PropTypes.number.isRequired,
      size: PropTypes.string,
      signPrice: PropTypes.number,
    })
  ),
};

export default CompanyTables;
