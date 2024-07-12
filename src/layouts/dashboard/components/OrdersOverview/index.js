import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import Button from "@mui/material/Button";
import axiosInstance from "api/axiosInstance";
import MDAlert from "components/MDAlert";

function ExhibitionSchedule({ companyId }) {
  const [exhibitions, setExhibitions] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, exhibitionId: null });

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

  const handleComplete = (exhibitionId) => {
    setConfirmDelete({ open: true, exhibitionId });
  };

  const confirmComplete = async () => {
    try {
      await axiosInstance.delete(`/exhibitions/${confirmDelete.exhibitionId}`);
      setExhibitions((prevExhibitions) =>
        prevExhibitions.filter((exhibition) => exhibition.id !== confirmDelete.exhibitionId)
      );
      setConfirmDelete({ open: false, exhibitionId: null });
    } catch (error) {
      console.error("Failed to complete exhibition:", error);
    }
  };

  const cancelComplete = () => {
    setConfirmDelete({ open: false, exhibitionId: null });
  };

  return (
    <>
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
              key={exhibition.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <MDBox display="flex" alignItems="center" width="100%">
                <TimelineItem
                  color="info"
                  icon="event"
                  title={exhibition.content}
                  dateTime={new Date(exhibition.date).toLocaleString()}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleComplete(exhibition.id)}
                  sx={{ ml: 2, mt: -6 }}
                >
                  完成
                </Button>
              </MDBox>
            </MDBox>
          ))}
        </MDBox>
      </Card>

      {confirmDelete.open && (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={1300}
          sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <MDBox p={2} sx={{ backgroundColor: "white", borderRadius: 2 }}>
            <MDAlert color="success" dismissible onClose={cancelComplete}>
              确认展会已经圆满完成了吗？
            </MDAlert>
            <MDBox mt={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="success" onClick={confirmComplete} sx={{ mr: 1 }}>
                确认
              </Button>
              <Button variant="outlined" color="secondary" onClick={cancelComplete}>
                取消
              </Button>
            </MDBox>
          </MDBox>
        </MDBox>
      )}
    </>
  );
}

ExhibitionSchedule.propTypes = {
  companyId: PropTypes.number.isRequired, // 修改 PropTypes 验证为数字
};

export default ExhibitionSchedule;
