import React, { useState, useEffect, useMemo, useCallback } from "react";
import Grid from "@mui/material/Grid";
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
import useFetchData from "hooks/useFetchData";
import dayjs from "dayjs";
import configs from "examples/Charts/LineCharts/ReportsLineChart/configs";

const selectOptions = [
  { value: "week", label: "周数据" },
  { value: "month", label: "月数据" },
  { value: "year", label: "年数据" },
];

function Dashboard() {
  const { user } = useUser();
  const [timePeriod, setTimePeriod] = useState(selectOptions[0]);
  const [tabValue, setTabValue] = useState(0);

  const { data: allData, fetchData: fetchAllData } = useFetchData(`/companies/alldata/${user.id}`, {
    company: {},
    artists: [],
    exhibitions: [],
    weekHotThemes: [],
    monthHotThemes: [],
    yearHotThemes: [],
    weekSales: [],
    monthSales: [],
    yearSales: [],
    weekHotSizes: [],
    monthHotSizes: [],
    yearHotSizes: [],
    timeLabels: { week: [], month: [], year: [] },
    dateLabels: { week: [], month: [], year: [] },
  });

  const { timeLabels, dateLabels } = allData;

  useEffect(() => {
    if (user && user.id) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  const handleTimePeriodChange = useCallback((selectedOption) => {
    setTimePeriod(selectedOption);
  }, []);

  const handleSetTabValue = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const tasks = useMemo(() => {
    const dateLabelsForPeriod = dateLabels[timePeriod.value];
    const salesDataForPeriod = allData[`${timePeriod.value}Sales`];

    const sales = dateLabelsForPeriod.map((dateLabel) => {
      const item = salesDataForPeriod.find((data) => data.label === dateLabel);
      return item ? Number(item.totalsales) || 0 : 0;
    });

    const profit = dateLabelsForPeriod.map((dateLabel) => {
      const item = salesDataForPeriod.find((data) => data.label === dateLabel);
      return item ? Number(item.totalprofit) || 0 : 0;
    });

    return configs(timeLabels[timePeriod.value], [
      {
        label: "销售额",
        data: sales,
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "利润",
        data: profit,
        borderColor: "#5656e1",
        backgroundColor: "rgba(86, 86, 225, 0.2)",
      },
    ]);
  }, [timeLabels, dateLabels, allData, timePeriod]);

  const pieChartDataThemes = useMemo(() => {
    const themesDataForPeriod = allData[`${timePeriod.value}HotThemes`];
    return {
      labels: themesDataForPeriod.map((item) => item.theme),
      datasets: {
        label: "题材销售数量",
        data: themesDataForPeriod.map((item) => Number(item.salescount) || 0),
      },
    };
  }, [allData, timePeriod]);

  const pieChartDataSizes = useMemo(() => {
    const sizesDataForPeriod = allData[`${timePeriod.value}HotSizes`];
    return {
      labels: sizesDataForPeriod.map((item) => item.size),
      datasets: {
        label: "尺寸销售数量",
        data: sizesDataForPeriod.map((item) => Number(item.salescount) || 0),
      },
    };
  }, [allData, timePeriod]);

  const PieChartMemoized = useMemo(() => {
    if (tabValue === 0) {
      return (
        <PieChart
          icon={{ color: "info", component: "palette" }}
          title="热销题材"
          description="各题材的销售比例"
          chart={pieChartDataThemes}
        />
      );
    }
    return (
      <PieChart
        icon={{ color: "warning", component: "aspect_ratio" }}
        title="画作尺寸热度"
        description="各尺寸画作的销售比例"
        chart={pieChartDataSizes}
      />
    );
  }, [tabValue, pieChartDataThemes, pieChartDataSizes]);

  return (
    <DashboardLayout>
      <DashboardNavbar onArtistsUpdated={fetchAllData} />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="event"
                title="展会"
                count={allData.exhibitions.length || 0}
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
                count={`${allData.artists.length}名`}
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
                      zIndex: 9999,
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
                {PieChartMemoized}
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
                  chart={tasks.data}
                  options={tasks.options}
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
                initialArtists={allData.artists}
                onArtistsUpdated={fetchAllData}
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
