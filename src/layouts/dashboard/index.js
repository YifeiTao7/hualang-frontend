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
import { useUser } from "context/UserContext";
import useFetchData from "hooks/useFetchData"; // 自定义 Hook

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const { user } = useUser();
  const { data: artists = [], fetchData: fetchArtists } = useFetchData(
    `/artists/company/${user.id}`,
    []
  );
  const { data: exhibitions = [], fetchData: fetchExhibitions } = useFetchData(
    `/exhibitions/company/${user.id}`,
    []
  );

  const [signedArtistsCount, setSignedArtistsCount] = useState(0);

  useEffect(() => {
    if (user && user.id) {
      fetchArtists();
      fetchExhibitions();
    }
  }, [user, user.id, fetchArtists, fetchExhibitions]);

  useEffect(() => {
    setSignedArtistsCount(artists.length || 0);
  }, [artists]);

  return (
    <DashboardLayout>
      <DashboardNavbar onArtistsUpdated={fetchArtists} />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="event"
                title="展会"
                count={exhibitions.length || 0}
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
                count={`${signedArtistsCount}名`}
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
              <OrdersOverview title="画师订单概览" companyId={user.id} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
