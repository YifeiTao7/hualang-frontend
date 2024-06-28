import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useUser } from "context/UserContext";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert"; // 导入 MDAlert 组件

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/qianli.jpg";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // 定义 rememberMe 状态变量
  const [error, setError] = useState(""); // 定义 error 状态变量
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = response.data; // 假设后端返回完整的用户数据

      // 保存token
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // 保存用户信息
      login(user);

      // 根据角色进行重定向
      if (user.role === "artist") {
        navigate("/profile");
      } else if (user.role === "company") {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("登录失败，请检查邮箱和密码是否正确。");
      console.error("Login failed:", error);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            画廊
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="邮箱"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputProps={{ style: { fontSize: 14 } }} // 调小输入框的字体大小
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="密码"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{ style: { fontSize: 14 } }} // 调小输入框的字体大小
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="caption"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;记住我
              </MDTypography>
            </MDBox>
            {error && (
              <MDBox mt={2} mb={2}>
                <MDAlert color="error" sx={{ fontSize: 14 }}>
                  {error}
                </MDAlert>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                登录
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="caption" color="text">
                没有账户?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="caption"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  注册
                </MDTypography>
              </MDTypography>
              <MDTypography variant="caption" color="text">
                忘记密码?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/reset-password"
                  variant="caption"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  重置密码
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;
