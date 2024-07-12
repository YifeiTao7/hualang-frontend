import React, { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/s591529137db2e.jpg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "api/axiosInstance";

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  const handleRequestReset = async (event) => {
    event.preventDefault();
    setMessage(""); // 清除之前的消息
    try {
      const response = await axiosInstance.post("/password-reset/request", { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "请求重置密码时出错，请稍后再试。";
      setMessage(errorMessage);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setMessage(""); // 清除之前的消息
    try {
      const response = await axiosInstance.post("/password-reset/verify-code", { email, code });
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "验证码验证失败，请检查后重试。";
      setMessage(errorMessage);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setMessage(""); // 清除之前的消息
    try {
      const response = await axiosInstance.post("/password-reset/reset", {
        email,
        code,
        newPassword,
      });
      setMessage(response.data.message);
      setStep(4);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "重置密码时出错，请稍后再试。";
      setMessage(errorMessage);
    }
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            重置密码
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            你将在60秒内收到一封电子邮件
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {step === 1 && (
            <form onSubmit={handleRequestReset}>
              <MDBox mb={4}>
                <MDInput
                  type="email"
                  label="邮箱"
                  variant="standard"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton type="submit" variant="gradient" color="info" fullWidth>
                  请求重置
                </MDButton>
              </MDBox>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <MDBox mb={4}>
                <MDInput
                  type="text"
                  label="验证码"
                  variant="standard"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton type="submit" variant="gradient" color="info" fullWidth>
                  验证
                </MDButton>
              </MDBox>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <MDBox mb={4}>
                <MDInput
                  type="password"
                  label="新密码"
                  variant="standard"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton type="submit" variant="gradient" color="info" fullWidth>
                  重置密码
                </MDButton>
              </MDBox>
            </form>
          )}
          {step === 4 && (
            <MDBox mt={2} mb={1} textAlign="center">
              <MDTypography variant="body2" color="success">
                {message}
              </MDTypography>
              <MDButton
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate("/login")}
              >
                登录
              </MDButton>
            </MDBox>
          )}
          {message && (
            <MDBox mt={2} mb={1} textAlign="center">
              <MDTypography variant="body2" color={step === 4 ? "success" : "error"}>
                {message}
              </MDTypography>
            </MDBox>
          )}
          <MDBox mt={2} mb={1}>
            <MDButton variant="outlined" color="secondary" fullWidth onClick={() => navigate(-1)}>
              回退
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default ResetPassword;
