import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import NotificationList from "examples/NotificationList";
import axiosInstance from "api/axiosInstance";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { artistRoutes, companyRoutes } from "routes";
import { useUser } from "context/UserContext";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import MembershipModal from "./MembershipModal";

// 导入 Diamond 图标
import DiamondIcon from "@mui/icons-material/Diamond";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotificationList, setOpenNotificationList] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { pathname } = useLocation();
  const { user } = useUser();
  const [openMembershipModal, setOpenMembershipModal] = useState(false);
  const [membership, setMembership] = useState(null);

  const currentRoute = (user?.role === "artist" ? artistRoutes : companyRoutes).find((route) =>
    pathname.includes(route.route)
  ) || { name: "" };

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await axiosInstance.get(`/notifications/user/${user._id}/unread`);
        setUnreadNotifications(response.data.length);
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    if (user && user._id) {
      fetchUnreadNotifications();
    }
  }, [user]);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await axiosInstance.get(`/companies/${user._id}`);
        setMembership(response.data.membership);
      } catch (error) {
        console.error("Failed to fetch membership info:", error);
      }
    };

    if (user && user.role === "company") {
      fetchMembership();
    }
  }, [user]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleOpenNotificationList = () => setOpenNotificationList(true);
  const handleCloseNotificationList = async () => {
    setOpenNotificationList(false);
    try {
      const response = await axiosInstance.get(`/notifications/user/${user._id}/unread`);
      setUnreadNotifications(response.data.length);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  };

  const handleOpenMembershipModal = () => setOpenMembershipModal(true);
  const handleCloseMembershipModal = () => setOpenMembershipModal(false);

  const getMembershipColor = () => {
    console.log("Membership:", membership); // 添加日志输出以便调试
    switch (membership) {
      case "trial":
        return "red"; // 红色
      case "monthly":
        return "green"; // 绿色
      case "yearly":
        return "#FFD700"; // 金色
      default:
        return "inherit";
    }
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="查看新消息" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="管理播客会话" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="支付成功完成" />
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  return (
    <>
      <AppBar
        position={absolute ? "absolute" : navbarType}
        color="inherit"
        sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      >
        <Toolbar sx={(theme) => navbarContainer(theme)}>
          <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
            <Breadcrumbs
              icon="home"
              title={currentRoute.name}
              route={pathname.split("/").slice(1)}
              light={light}
            />
          </MDBox>
          {isMini ? null : (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              <MDBox color={light ? "white" : "inherit"}>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleConfiguratorOpen}
                >
                  <Icon sx={iconsStyle}>settings</Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  variant="contained"
                  onClick={handleOpenNotificationList}
                >
                  <Badge
                    badgeContent={unreadNotifications > 0 ? unreadNotifications : null}
                    color="error"
                  >
                    <Icon sx={iconsStyle}>notifications</Icon>
                  </Badge>
                </IconButton>
                {user?.role === "company" && (
                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarIconButton}
                    onClick={handleOpenMembershipModal}
                  >
                    <DiamondIcon sx={{ color: getMembershipColor() }} /> {/* 使用 Diamond 图标 */}
                  </IconButton>
                )}
                {renderMenu()}
              </MDBox>
            </MDBox>
          )}
        </Toolbar>
      </AppBar>
      <NotificationList open={openNotificationList} onClose={handleCloseNotificationList} />
      <MembershipModal open={openMembershipModal} onClose={handleCloseMembershipModal} />
    </>
  );
}

// 为 DashboardNavbar 设置默认值
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// 为 DashboardNavbar 进行类型检查
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
