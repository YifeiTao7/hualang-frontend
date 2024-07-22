import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "context/UserContext";
import useSubmitData from "hooks/useSubmitData";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/qianli.jpg";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return [values, handleChange];
};

const SignIn = () => {
  const [formValues, handleFormChange] = useForm({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const { loading, error, success, submitData } = useSubmitData("/auth/login");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await submitData(formValues);

    if (response) {
      const { token, user } = response;

      // 保存token
      rememberMe ? localStorage.setItem("token", token) : sessionStorage.setItem("token", token);

      // 保存用户信息
      login(user);

      // 根据角色进行重定向
      navigate(user.role === "artist" ? "/profile" : "/dashboard");
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
                name="email"
                value={formValues.email}
                onChange={handleFormChange}
                inputProps={{ style: { fontSize: 14 } }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="密码"
                fullWidth
                name="password"
                value={formValues.password}
                onChange={handleFormChange}
                inputProps={{ style: { fontSize: 14 } }}
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
            {success && (
              <MDBox mt={2} mb={2}>
                <MDAlert color="success" sx={{ fontSize: 14 }}>
                  登录成功！
                </MDAlert>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={loading}>
                {loading ? "登录中..." : "登录"}
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
};

export default SignIn;
