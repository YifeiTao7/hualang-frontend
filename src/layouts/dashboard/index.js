import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import axiosInstance from "api/axiosInstance";
import { useUser } from "context/UserContext";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [artists, setArtists] = useState([]);
  const [exhibitions, setExhibitions] = useState([]); // 新增状态
  const [signedArtistsCount, setSignedArtistsCount] = useState(0);
  const { user } = useUser();

  const fetchArtists = async () => {
    try {
      if (user && user._id) {
        const response = await axiosInstance.get(`/artists/company/${user._id}`);
        const updatedArtists = response.data.map((artist) => ({
          ...artist,
          artworks: artist.artworks.map((artwork) => ({
            id: artwork,
            title: `Artwork ${artwork}`,
          })),
        }));
        setArtists(updatedArtists);
        setSignedArtistsCount(updatedArtists.length);
      }
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    }
  };

  const fetchExhibitions = async () => {
    try {
      if (user && user._id) {
        const response = await axiosInstance.get(`/exhibitions/company/${user._id}`);
        setExhibitions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch exhibitions:", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchArtists();
      fetchExhibitions();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <DashboardNavbar onArtistsUpdated={fetchArtists} /> {/* 传递 onArtistsUpdated */}
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="event"
                title="展会"
                count={exhibitions.length} // 使用动态数据
                percentage={{
                  color: "success",
                  amount: "+10%",
                  label: "相比上周",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="brush"
                title="画师进度"
                count="5个项目"
                percentage={{
                  color: "success",
                  amount: "+20%",
                  label: "相比上个月",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="person"
                title="签约画师"
                count={`${signedArtistsCount}名`} // 使用动态数据
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "相比昨天",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="添加新画师"
                count="+2名"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "刚刚更新",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="展会参与度"
                  description="上次展会表现"
                  date="展会在2天前结束"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="画师项目进度"
                  description={
                    <>
                      (<strong>+15%</strong>) 进度提升.
                    </>
                  }
                  date="4分钟前更新"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="签约画师情况"
                  description="最新签约数据"
                  date="刚刚更新"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects
                title="签约画师项目"
                initialArtists={artists}
                onArtistsUpdated={fetchArtists}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview title="画师订单概览" companyId={user._id} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
