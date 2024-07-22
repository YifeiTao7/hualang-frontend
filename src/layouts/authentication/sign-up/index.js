import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/system";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/s591529137db2e.jpg";
import useSubmitData from "hooks/useSubmitData";

const CustomSelect = styled(Select)(({ theme }) => ({
  zIndex: 1,
  height: "auto",
  padding: "0",
  fontSize: "inherit",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    height: "auto",
    padding: "0",
    fontSize: "inherit",
  },
}));

const CustomButton = styled(MDButton)(({ theme }) => ({
  zIndex: 1,
  height: "auto",
  padding: "0",
  fontSize: "inherit",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    height: "auto",
    padding: "0",
    fontSize: "inherit",
  },
}));

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const { loading, error, success, submitData } = useSubmitData("/auth/register");

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const response = await submitData({ name, email, password, role });

    if (response) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 3000); // 3秒后跳转到登录页面
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card sx={{ maxWidth: "400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            注册
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleRegister}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="姓名"
                variant="standard"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="邮箱"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="密码"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <CustomSelect
                value={role}
                onChange={handleRoleChange}
                displayEmpty
                fullWidth
                variant="standard"
              >
                <MenuItem value="" disabled>
                  选择你的角色
                </MenuItem>
                <MenuItem value="artist">画家</MenuItem>
                <MenuItem value="company">公司</MenuItem>
              </CustomSelect>
            </MDBox>
            {error && (
              <MDBox mt={2} mb={2}>
                <MDAlert color="error" sx={{ fontSize: 14, zIndex: 1, position: "relative" }}>
                  {error}
                </MDAlert>
              </MDBox>
            )}
            {showSuccessMessage && (
              <MDBox mt={2} mb={2}>
                <MDAlert color="success" sx={{ fontSize: 14, zIndex: 1, position: "relative" }}>
                  恭喜您注册成功！3秒后将跳转到登录页面。
                </MDAlert>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <CustomButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={loading}
              >
                {loading ? "注册中..." : "注册"}
              </CustomButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                已有账户?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  登录
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default SignUp;
