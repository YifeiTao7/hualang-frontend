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
import UnbindArtistDialog from "../UnbindArtistDialog.js";
import { useUser } from "context/UserContext"; // 引入用户上下文

function Projects({ title, initialArtists, onArtistsUpdated }) {
  const [menu, setMenu] = useState(null);
  const [rows, setRows] = useState([]);
  const [artists, setArtists] = useState(initialArtists || []);
  const [editedArtist, setEditedArtist] = useState(null);
  const [newExhibitionsHeld, setNewExhibitionsHeld] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isUnbindDialogOpen, setUnbindDialogOpen] = useState(false);
  const { user } = useUser(); // 获取当前用户

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

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUnbindDialogClose = () => {
    setUnbindDialogOpen(false);
  };

  const handleArtistAdd = (artist) => {
    setDialogOpen(false);
    onArtistsUpdated();
  };

  const handleArtistUnbind = async (userId) => {
    setUnbindDialogOpen(false);
    try {
      await axiosInstance.delete(`/companies/unbind-artist/${user._id}/${userId}`);
      onArtistsUpdated();
    } catch (error) {
      console.error("Failed to unbind artist:", error);
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
    setNewExhibitionsHeld(e.target.value);
  };

  const handleEditExhibitionsHeld = (artist) => {
    setEditedArtist(artist);
    setNewExhibitionsHeld(artist.exhibitionsHeld.toString());
  };

  const handleSaveExhibitionsHeld = async () => {
    if (editedArtist) {
      try {
        await axiosInstance.put(`/artists/${editedArtist.userId}`, {
          exhibitionsHeld: newExhibitionsHeld,
        });
        onArtistsUpdated();
      } catch (error) {
        console.error("Failed to update exhibitions held:", error);
      } finally {
        setEditedArtist(null);
        setNewExhibitionsHeld("");
      }
    }
  };

  const processArtists = (artists) => {
    if (!artists) return [];
    return artists.map((artist) => {
      const artworksCount = artist.artworks.length;
      const completion = ((artworksCount / artist.exhibitionsHeld) * 100).toFixed(2);
      return {
        avatar: artist.avatar,
        name: artist.name,
        artworksCount,
        exhibitionsHeld: (
          <MDBox display="flex" alignItems="center">
            {editedArtist && editedArtist.userId === artist.userId ? (
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
                <MDTypography variant="body2">{artist.exhibitionsHeld}</MDTypography>
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
        completion,
      };
    });
  };

  useEffect(() => {
    setRows(processArtists(artists));
  }, [artists, editedArtist, newExhibitionsHeld]);

  useEffect(() => {
    setArtists(initialArtists);
    setRows(processArtists(initialArtists));
  }, [initialArtists]);

  const columns = [
    { Header: "头像", accessor: "avatar", Cell: ({ value }) => <Avatar src={value} /> },
    { Header: "名字", accessor: "name" },
    { Header: "作品数量", accessor: "artworksCount" },
    { Header: "办展数", accessor: "exhibitionsHeld" },
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
      artworks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        })
      ).isRequired,
      exhibitionsHeld: PropTypes.number.isRequired,
      userId: PropTypes.string.isRequired,
    })
  ).isRequired,
  onArtistsUpdated: PropTypes.func.isRequired,
};

export default Projects;
