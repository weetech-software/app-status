import * as React from "react";
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Collapse from "@mui/material/Collapse";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import CallReceivedIcon from "@mui/icons-material/CallReceived";

import { useUserState, useUserDispatch, signOut } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { menus } from "../core/config";
import { blue } from "@mui/material/colors";

const Search = styled("div")(({ theme }) => ({
   position: "relative",
   borderRadius: theme.shape.borderRadius,
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
   },
   marginLeft: 0,
   width: "100%",
   [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
   },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: "100%",
   position: "absolute",
   pointerEvents: "none",
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: "inherit",
   "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
         width: "12ch",
         "&:focus": {
            width: "20ch",
         },
      },
   },
}));

// still have to register to prevent remote bad dynamic injection
const Components = {
   Public: PublicIcon,
   Lock: LockIcon,
   DataThresholding: DataThresholdingIcon,
   Security: SecurityIcon,
   Storage: StorageIcon,
   AssignmentTurnedIn: AssignmentTurnedInIcon,
   ManageAccounts: ManageAccountsIcon,
   AddAlert: AddAlertIcon,
   GroupWork: GroupWorkIcon,
   CallReceived: CallReceivedIcon,
};

export default function SearchAppBar() {
   var userDispatch = useUserDispatch();
   var { isAuthenticated } = useUserState();
   const navigate = useNavigate();

   const [anchorEl, setAnchorEl] = React.useState(null);
   const isMenuOpen = Boolean(anchorEl);
   const [openDrawer, setOpenDrawer] = React.useState(false);

   const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const [openSubMenu, setSubMenu] = React.useState({});

   const handleSubMenu = (ev, to) => {
      // prevent bubble up to prevent click on the link, just expand is sufficient
      ev.preventDefault();
      setSubMenu({ ...openSubMenu, [to]: !openSubMenu[to] });
   };

   const menuId = "primary-search-account-menu";
   const renderMenu = (
      <Menu
         anchorEl={anchorEl}
         anchorOrigin={{
            vertical: "top",
            horizontal: "right",
         }}
         id={menuId}
         keepMounted
         transformOrigin={{
            vertical: "top",
            horizontal: "right",
         }}
         open={isMenuOpen}
         onClose={handleMenuClose}
      >
         <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
         <MenuItem onClick={handleMenuClose}>My account</MenuItem>
         <MenuItem
            onClick={() => {
               handleMenuClose();
               signOut(userDispatch, navigate, "/", null);
            }}
         >
            Sign out
         </MenuItem>
      </Menu>
   );

   // https://legacy.reactjs.org/docs/typechecking-with-proptypes.html
   ListItemLink.propTypes = {
      icon: PropTypes.element,
      primary: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      subs: PropTypes.array,
   };

   function ListItemLink(props) {
      const { icon, primary, to, subs } = props;

      const renderSubExpand = () => {
         return (
            <div onClick={(ev) => handleSubMenu(ev, to)}>
               {openSubMenu[to] ? <ExpandLess /> : <ExpandMore />}
            </div>
         );
      };

      const renderSubItem = (subItem, idx) => {
         return (
            <ListItem
               key={subItem.key}
               button
               component={Link}
               to={subItem.key}
               sx={{ pl: 4 }}
            >
               {icon ? <ListItemIcon>{getIcon(subItem)}</ListItemIcon> : null}
               <ListItemText
                  primary={subItem.title}
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
               />
            </ListItem>
         );
      };

      const renderSub = () => {
         return (
            <Collapse in={openSubMenu[to]} timeout="auto" unmountOnExit>
               <List component="div" disablePadding>
                  {subs.map((subItem, idx) => renderSubItem(subItem, idx))}
               </List>
            </Collapse>
         );
      };

      return (
         <li key={to}>
            <ListItem button component={Link} to={to}>
               {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
               <ListItemText
                  primary={primary}
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
               />
               {subs ? renderSubExpand() : null}
            </ListItem>
            {subs ? renderSub() : null}
         </li>
      );
   }

   const getIcon = (r) => {
      var IconComponent = Components[r.icon];
      return <IconComponent sx={{ color: blue[500] }} />;
   };

   // https://github.com/jasonwee/MyReactJS/blob/main/react-admin-master/src/routes/index.tsx#L37
   const createMenu = (r, idx) => {
      return (
         <ListItemLink
            key={idx}
            to={r.key}
            primary={r.title}
            icon={getIcon(r)}
            subs={r.subs}
         />
      );
   };

   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static">
            <Toolbar>
               {isAuthenticated && (
                  <IconButton
                     size="large"
                     edge="start"
                     color="inherit"
                     aria-label="open drawer"
                     sx={{ mr: 2 }}
                     onClick={() => setOpenDrawer(true)}
                  >
                     <MenuIcon />
                  </IconButton>
               )}
               <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                  <Divider textAlign="left" sx={{ mt: 1 }}>
                     MONITORING
                  </Divider>
                  <List>
                     {menus["menu_monitoring"].map((key, idx) =>
                        createMenu(key, idx)
                     )}
                  </List>
                  <Divider textAlign="left">MANAGEMENT</Divider>
                  <List>
                     {menus["menu_management"].map((key, idx) =>
                        createMenu(key, idx)
                     )}
                  </List>
               </Drawer>
               <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
               >
                  Weetech Servers Status
               </Typography>
               <Search>
                  <SearchIconWrapper>
                     <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                     placeholder="Search…"
                     inputProps={{ "aria-label": "search" }}
                  />
               </Search>
               {isAuthenticated && (
                  <IconButton
                     size="large"
                     edge="end"
                     aria-label="account of current user"
                     aria-controls={menuId}
                     aria-haspopup="true"
                     onClick={handleProfileMenuOpen}
                     color="inherit"
                  >
                     <AccountCircle />
                  </IconButton>
               )}
            </Toolbar>
         </AppBar>
         {isAuthenticated && renderMenu}
      </Box>
   );
}
