/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import Button from "@mui/material/Button";
import axiosInstance from "api/axiosInstance";

function ExhibitionSchedule({ companyId }) {
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axiosInstance.get(`/exhibitions/company/${companyId}`);
        setExhibitions(response.data);
      } catch (error) {
        console.error("Failed to fetch exhibitions:", error);
      }
    };

    fetchExhibitions();
  }, [companyId]);

  const handleComplete = async (exhibitionId) => {
    try {
      await axiosInstance.delete(`/exhibitions/${exhibitionId}`);
      setExhibitions((prevExhibitions) =>
        prevExhibitions.filter((exhibition) => exhibition._id !== exhibitionId)
      );
    } catch (error) {
      console.error("Failed to complete exhibition:", error);
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          展会安排
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            本月
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {exhibitions.map((exhibition) => (
          <MDBox
            key={exhibition._id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <MDBox display="flex" alignItems="center" width="100%">
              <TimelineItem
                color="info"
                icon="event"
                title={`${exhibition.artistName}的作品数量达到${exhibition.artworkCount}，可以举办展会`}
                dateTime={new Date(exhibition.date).toLocaleString()}
              />
              <Button
                variant="contained"
                color="success"
                onClick={() => handleComplete(exhibition._id)}
                sx={{ ml: 2, mt: -6 }}
              >
                完成
              </Button>
            </MDBox>
          </MDBox>
        ))}
      </MDBox>
    </Card>
  );
}

export default ExhibitionSchedule;
