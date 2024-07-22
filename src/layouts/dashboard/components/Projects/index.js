/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Avatar from "@mui/material/Avatar";
import MDProgress from "components/MDProgress";
import TextField from "@mui/material/TextField";
import axiosInstance from "api/axiosInstance";
import ArtistListDialog from "../ArtistListDialog";
import UnbindArtistDialog from "../UnbindArtistDialog";
import { useUser } from "context/UserContext";

function Projects({ title, initialArtists, onArtistsUpdated }) {
  const [menu, setMenu] = useState(null);
  const [rows, setRows] = useState([]);
  const [artists, setArtists] = useState(initialArtists || []);
  const [editedArtist, setEditedArtist] = useState(null);
  const [newExhibitionsHeld, setNewExhibitionsHeld] = useState("");
  const [newSignPrice, setNewSignPrice] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isUnbindDialogOpen, setUnbindDialogOpen] = useState(false);
  const { user } = useUser();

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    closeMenu();
  };

  const handleOpenUnbindDialog = () => {
    setUnbindDialogOpen(true);
    closeMenu();
  };

  const handleDialogClose = () => setDialogOpen(false);
  const handleUnbindDialogClose = () => setUnbindDialogOpen(false);

  const handleArtistAdd = () => {
    setDialogOpen(false);
    onArtistsUpdated();
  };

  const handleArtistUnbind = async (artistId) => {
    setUnbindDialogOpen(false);
    try {
      await axiosInstance.delete(`/companies/unbind-artist/${user.id}/${artistId}`);
      onArtistsUpdated();
    } catch (error) {
      // 错误处理逻辑
    }
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={handleOpenDialog}>添加新画家</MenuItem>
      <MenuItem onClick={handleOpenUnbindDialog}>解约画家</MenuItem>
    </Menu>
  );

  const handleExhibitionsHeldChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNewExhibitionsHeld(Number.isNaN(value) ? "" : value);
  };

  const handleEditExhibitionsHeld = (artist) => {
    setEditedArtist({ ...artist, field: "exhibitionsHeld" });
    setNewExhibitionsHeld(artist.exhibitionsheld || 0);
  };

  const handleSaveExhibitionsHeld = async () => {
    if (editedArtist) {
      try {
        await axiosInstance.put(`/artists/${editedArtist.userid}`, {
          ...editedArtist,
          exhibitionsHeld: newExhibitionsHeld || editedArtist.exhibitionsheld,
        });
        onArtistsUpdated();
      } catch (error) {
        // 错误处理逻辑
      } finally {
        setEditedArtist(null);
        setNewExhibitionsHeld("");
      }
    }
  };

  const handleSignPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setNewSignPrice(Number.isNaN(value) ? "" : value);
  };

  const handleEditSignPrice = (artist) => {
    setEditedArtist({ ...artist, field: "signPrice" });
    setNewSignPrice(artist.signprice || 0);
  };

  const handleSaveSignPrice = async () => {
    if (editedArtist) {
      try {
        await axiosInstance.put(`/artists/${editedArtist.userid}`, {
          ...editedArtist,
          signPrice: newSignPrice || editedArtist.signprice,
        });
        onArtistsUpdated();
      } catch (error) {
        // 错误处理逻辑
      } finally {
        setEditedArtist(null);
        setNewSignPrice("");
      }
    }
  };

  const processArtists = (artists) => {
    if (!artists) return [];
    return artists.map((artist) => {
      const artworksCount = parseInt(artist.artworkscount, 10) || 0;
      const exhibitionsHeld = parseInt(artist.exhibitionsheld, 10) || 0;
      const signPrice = artist.signprice !== null ? artist.signprice : 0;
      let completion =
        exhibitionsHeld > 0 ? ((artworksCount / exhibitionsHeld) * 100).toFixed(2) : 0;
      if (completion > 100) {
        completion = 100;
      }
      return {
        avatar: artist.avatar,
        name: artist.name || "Unknown Artist",
        artworksCount,
        exhibitionsHeld: (
          <MDBox display="flex" alignItems="center">
            {editedArtist &&
            editedArtist.userid === artist.userid &&
            editedArtist.field === "exhibitionsHeld" ? (
              <TextField
                value={newExhibitionsHeld}
                onChange={handleExhibitionsHeldChange}
                onBlur={handleSaveExhibitionsHeld}
                type="number"
                sx={{ width: "60px", mr: 1 }}
                autoFocus
              />
            ) : (
              <>
                <MDTypography variant="body2">{artist.exhibitionsheld}</MDTypography>
                <Icon
                  sx={{ cursor: "pointer", fontSize: "20px", ml: 1 }}
                  onClick={() => handleEditExhibitionsHeld(artist)}
                >
                  edit
                </Icon>
              </>
            )}
          </MDBox>
        ),
        signPrice: (
          <MDBox display="flex" alignItems="center">
            {editedArtist &&
            editedArtist.userid === artist.userid &&
            editedArtist.field === "signPrice" ? (
              <TextField
                value={newSignPrice}
                onChange={handleSignPriceChange}
                onBlur={handleSaveSignPrice}
                type="number"
                sx={{ width: "100px", mr: 1 }}
                autoFocus
                InputProps={{
                  endAdornment: <span>元/平尺</span>,
                }}
              />
            ) : (
              <>
                <MDTypography variant="body2">
                  {artist.signprice ? `${artist.signprice} 元/平尺` : "暂无"}
                </MDTypography>
                <Icon
                  sx={{ cursor: "pointer", fontSize: "20px", ml: 1 }}
                  onClick={() => handleEditSignPrice(artist)}
                >
                  edit
                </Icon>
              </>
            )}
          </MDBox>
        ),
        completion,
      };
    });
  };

  useEffect(() => {
    setRows(processArtists(artists));
  }, [artists, editedArtist, newExhibitionsHeld, newSignPrice]);

  useEffect(() => {
    setArtists(initialArtists);
    setRows(processArtists(initialArtists));
  }, [initialArtists]);

  const columns = [
    { Header: "头像", accessor: "avatar", Cell: ({ value }) => <Avatar src={value} /> },
    { Header: "名字", accessor: "name" },
    { Header: "作品数量", accessor: "artworksCount" },
    { Header: "办展数", accessor: "exhibitionsHeld" },
    { Header: "签约价格", accessor: "signPrice" },
    {
      Header: "完成度",
      accessor: "completion",
      Cell: ({ value }) => {
        const parsedValue = parseFloat(value);
        return (
          <MDBox display="flex" alignItems="center" width="100%">
            <MDBox sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <MDProgress
                variant="gradient"
                value={parsedValue}
                color="info"
                sx={{ flexGrow: 1, minWidth: "50px", height: "10px" }}
              />
            </MDBox>
            <MDTypography variant="caption" color="text" sx={{ ml: 1 }}>
              {value}%
            </MDTypography>
          </MDBox>
        );
      },
    },
  ];

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {title}
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>本月已完成30项</strong>
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
      <ArtistListDialog open={isDialogOpen} onClose={handleDialogClose} onAdd={handleArtistAdd} />
      <UnbindArtistDialog
        open={isUnbindDialogOpen}
        onClose={handleUnbindDialogClose}
        onUnbind={handleArtistUnbind}
        artists={artists}
      />
    </Card>
  );
}

Projects.propTypes = {
  title: PropTypes.string.isRequired,
  initialArtists: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      artworkscount: PropTypes.number.isRequired,
      exhibitionsheld: PropTypes.number.isRequired,
      signprice: PropTypes.number,
      userid: PropTypes.number.isRequired,
    })
  ).isRequired,
  onArtistsUpdated: PropTypes.func.isRequired,
};

export default Projects;
