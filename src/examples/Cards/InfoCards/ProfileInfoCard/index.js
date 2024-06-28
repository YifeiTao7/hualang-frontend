// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ProfileInfoCard({ title, description, info, action, shadow, onEdit }) {
  console.log("ProfileInfoCard rendered with onEdit:", onEdit);

  const labels = {
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    address: "地址",
    weChat: "微信",
    qq: "QQ",
    company: "公司",
  };

  // Render the card info items
  const renderItems = Object.keys(info).map((key) => {
    if (labels[key]) {
      return (
        <MDBox key={key} display="flex" py={1} pr={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            {labels[key]}: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" color="text">
            &nbsp;{info[key] || "无"}
          </MDTypography>
        </MDBox>
      );
    }
    return null;
  });

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        <Tooltip title={action.tooltip} placement="top">
          <Icon
            onClick={() => {
              console.log("Edit icon clicked");
              onEdit();
            }}
            style={{ cursor: "pointer" }}
          >
            edit
          </Icon>
        </Tooltip>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>{renderItems}</MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
  onEdit: () => {
    console.log("Default onEdit function called");
  },
  action: {
    tooltip: "无操作",
  },
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default ProfileInfoCard;
