import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Select from "react-select";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import PieChart from "examples/Charts/PieChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import { useUser } from "context/UserContext";
import useFetchData from "hooks/useFetchData"; // 自定义 Hook
import dayjs from "dayjs"; // 引入 dayjs 库

const selectOptions = [
  { value: "week", label: "周数据" },
  { value: "month", label: "月数据" },
  { value: "year", label: "年数据" },
];

function Dashboard() {
  const { user } = useUser();
  const [timePeriod, setTimePeriod] = useState(selectOptions[0]);

  const {
    data: timeLabelsData,
    loading: loadingTimeLabels,
    error: errorTimeLabels,
    fetchData: fetchTimeLabels,
  } = useFetchData(`/companies/time/timelabels?period=${timePeriod.value}`, {
    timeLabels: [],
    dateLabels: [],
  });

  const { timeLabels, dateLabels } = timeLabelsData;

  const { data: artists = [], fetchData: fetchArtists } = useFetchData(
    `/artists/company/${user.id}`,
    []
  );
  const { data: exhibitions = [], fetchData: fetchExhibitions } = useFetchData(
    `/exhibitions/company/${user.id}`,
    []
  );

  const { data: hotThemesData, fetchData: fetchHotThemesData } = useFetchData(
    `/companies/${user.id}/hot-themes?period=${timePeriod.value}`,
    []
  );

  const { data: salesData, fetchData: fetchSalesData } = useFetchData(
    `/companies/${user.id}/sales-status?period=${timePeriod.value}`,
    []
  );

  const { data: hotSizesData, fetchData: fetchHotSizesData } = useFetchData(
    `/companies/${user.id}/hot-sizes?period=${timePeriod.value}`,
    []
  );

  const [signedArtistsCount, setSignedArtistsCount] = useState(0);
  const [tabValue, setTabValue] = useState(0); // 使用 tabValue 代替 currentChart

  useEffect(() => {
    if (user && user.id) {
      fetchArtists();
      fetchExhibitions();
      fetchHotThemesData();
      fetchSalesData();
      fetchHotSizesData();
      fetchTimeLabels(); // 确保初始数据加载
    }
  }, [
    user,
    user.id,
    fetchArtists,
    fetchExhibitions,
    fetchHotThemesData,
    fetchSalesData,
    fetchHotSizesData,
    fetchTimeLabels,
  ]);

  useEffect(() => {
    setSignedArtistsCount(artists.length || 0);
    console.log("Artists Data:", artists);
  }, [artists]);

  useEffect(() => {
    console.log("Time Period Changed:", timePeriod);
    fetchTimeLabels();
  }, [timePeriod, fetchTimeLabels]);

  useEffect(() => {
    console.log("Fetched Time Labels:", timeLabels);
    console.log("Fetched Date Labels:", dateLabels);
  }, [timeLabels, dateLabels]);

  // 确保 salesData 是数组
  const validSalesData = Array.isArray(salesData) ? salesData : [];

  // 添加日志打印接收到的 hotThemesData 数据
  useEffect(() => {
    console.log("Hot Themes Data:", hotThemesData);
  }, [hotThemesData]);

  // 添加日志打印接收到的 salesData 数据
  useEffect(() => {
    console.log("Sales Data:", salesData);
    console.log("Valid Sales Data:", validSalesData);
    validSalesData.forEach((item) => {
      console.log("Item:", item);
      console.log("Label:", item.label);
      console.log(
        "Total Sales (before conversion):",
        item.totalsales,
        "Type:",
        typeof item.totalsales
      );
      console.log(
        "Total Profit (before conversion):",
        item.totalprofit,
        "Type:",
        typeof item.totalprofit
      );
    });
  }, [salesData]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    console.log("Tab Value Changed:", newValue);
  };

  const handleTimePeriodChange = (selectedOption) => {
    setTimePeriod(selectedOption);
    console.log("Time Period Selected:", selectedOption);
  };

  const tasks = {
    labels: timeLabels,
    datasets: [
      {
        label: "销售额",
        data: dateLabels.map((dateLabel) => {
          const item = validSalesData.find((data) => {
            const dataLabel = timePeriod.value === "year" ? data.label.slice(0, 7) : data.label;
            return dataLabel === dateLabel;
          });
          const sales = item ? Number(item.totalsales) || 0 : null;
          console.log("Mapped Sales for", dateLabel, ":", sales);
          return sales;
        }),
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "利润",
        data: dateLabels.map((dateLabel) => {
          const item = validSalesData.find((data) => {
            const dataLabel = timePeriod.value === "year" ? data.label.slice(0, 7) : data.label;
            return dataLabel === dateLabel;
          });
          const profit = item ? Number(item.totalprofit) || 0 : null;
          console.log("Mapped Profit for", dateLabel, ":", profit);
          return profit;
        }),
        borderColor: "#5656e1",
        backgroundColor: "rgba(86, 86, 225, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // 添加日志打印 tasks 数据
  console.log("Tasks Data:", tasks);

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
            <Grid item xs={12} textAlign="center" position="relative" zIndex={9}>
              <MDBox pt={3} pb={3} px={2}>
                <Select
                  options={selectOptions}
                  value={timePeriod}
                  onChange={handleTimePeriodChange}
                  placeholder="选择时间维度"
                  noOptionsMessage={() => "暂无"}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minWidth: 240,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999, // 设置z-index为9999
                    }),
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6} position="relative">
              <MDBox mb={3} position="relative">
                <MDBox
                  position="absolute"
                  top="8px"
                  right="8px"
                  bgcolor="white"
                  borderRadius="4px"
                  boxShadow={3}
                  zIndex={1}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleSetTabValue}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{
                      minWidth: 200,
                      backgroundColor: "white",
                      borderRadius: "4px",
                      boxShadow: 3,
                    }}
                  >
                    <Tab
                      label="题材"
                      icon={
                        <Icon fontSize="small" sx={{ mt: -0.25 }}>
                          palette
                        </Icon>
                      }
                    />
                    <Tab
                      label="尺寸"
                      icon={
                        <Icon fontSize="small" sx={{ mt: -0.25 }}>
                          aspect_ratio
                        </Icon>
                      }
                    />
                  </Tabs>
                </MDBox>
                {tabValue === 0 ? (
                  <PieChart
                    icon={{ color: "info", component: "palette" }}
                    title="热销题材"
                    description="各题材的销售比例"
                    chart={{
                      labels: hotThemesData.map((item) => item.theme),
                      datasets: {
                        label: "题材销售数量",
                        data: hotThemesData.map((item) => {
                          const salesCount = Number(item.salescount) || 0;
                          console.log("Theme:", item.theme, "Sales Count:", salesCount);
                          return salesCount;
                        }),
                      },
                    }}
                  />
                ) : (
                  <PieChart
                    icon={{ color: "warning", component: "aspect_ratio" }}
                    title="画作尺寸热度"
                    description="各尺寸画作的销售比例"
                    chart={{
                      labels: hotSizesData.map((item) => item.size),
                      datasets: {
                        label: "尺寸销售数量",
                        data: hotSizesData.map((item) => {
                          const salesCount = Number(item.salescount) || 0;
                          console.log("Size:", item.size, "Sales Count:", salesCount);
                          return salesCount;
                        }),
                      },
                    }}
                  />
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3} mt={6}>
                <ReportsLineChart
                  color="dark"
                  title={`公司业绩 ${
                    timePeriod.value === "month"
                      ? dayjs().format("YYYY年MM月")
                      : timePeriod.value === "year"
                      ? dayjs().format("YYYY年")
                      : ""
                  }`}
                  description="销售额和利润"
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
