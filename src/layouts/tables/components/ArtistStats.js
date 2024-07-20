import React, { useState, useEffect } from "react";
import axiosInstance from "api/axiosInstance";
import { useUser } from "context/UserContext";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

function ArtistStats() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [newSettledAmount, setNewSettledAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get(`/artists/${user.id}/stats`);
        setStats({
          ...response.data,
          signPrice: parseFloat(response.data.signPrice),
          totalSalesVolume: parseInt(response.data.totalSalesVolume, 10),
          totalArtistPayment: parseFloat(response.data.totalArtistPayment),
          settledAmount: parseFloat(response.data.settledAmount),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchStats();
    }
  }, [user]);

  const handleSettledAmountChange = (e) => {
    setNewSettledAmount(e.target.value);
  };

  const handleUpdateSettledAmount = async () => {
    try {
      const response = await axiosInstance.put(`/artists/${user.id}/settled-amount`, {
        settledAmount: newSettledAmount,
      });
      setStats((prevStats) => ({
        ...prevStats,
        settledAmount: parseFloat(response.data.settledAmount),
      }));
      setNewSettledAmount("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to update settled amount:", error);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const formatNumber = (number) => {
    return !isNaN(parseFloat(number)) && isFinite(number) ? parseFloat(number).toFixed(2) : "0.00";
  };

  if (loading) {
    return (
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
            画家统计信息
          </MDTypography>
        </MDBox>
        <MDBox pt={3} px={2} pb={2} display="flex" justifyContent="center">
          <CircularProgress />
        </MDBox>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
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
          画家统计信息
        </MDTypography>
      </MDBox>
      <MDBox pt={3} px={2} pb={2}>
        <MDTypography variant="body1" color="text">
          成交量: {stats.totalSalesVolume}
        </MDTypography>
        <MDTypography variant="body1" color="text">
          成交价格: ¥{formatNumber(stats.signPrice)} 每平方尺
        </MDTypography>
        <MDTypography variant="body1" color="text">
          总收入金额: ¥{formatNumber(stats.totalArtistPayment)}
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="body1" color="text">
            已结算金额: ¥{formatNumber(stats.settledAmount)}
          </MDTypography>
          <Button onClick={handleDialogOpen} color="primary" sx={{ ml: 2 }}>
            添加
          </Button>
        </MDBox>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>添加已结算金额</DialogTitle>
          <DialogContent>
            <TextField
              label="添加金额"
              value={newSettledAmount}
              onChange={handleSettledAmountChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              取消
            </Button>
            <Button onClick={handleUpdateSettledAmount} color="primary">
              添加
            </Button>
          </DialogActions>
        </Dialog>
      </MDBox>
    </Card>
  );
}

export default ArtistStats;
