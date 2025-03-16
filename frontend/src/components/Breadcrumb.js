import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";

import { emphasize, styled } from "@mui/material/styles";


import DashboardIcon from "@mui/icons-material/Dashboard";

import { Link } from "react-router-dom";

import { routes } from "../core/config";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
   const backgroundColor =
      theme.palette.mode === "light"
         ? theme.palette.grey[300]
         : theme.palette.grey[800];
   return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      "&:hover, &:focus": {
         backgroundColor: emphasize(backgroundColor, 0.06),
      },
      "&:active": {
         boxShadow: theme.shadows[1],
         backgroundColor: emphasize(backgroundColor, 0.12),
      },
   };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function BreadCrumb({ path }) {
   function handleClick(event) {
      //event.preventDefault();
      //console.info('You clicked a breadcrumb.');
   }

   function renderCrumb() {
      //console.log(path);
      if (/^\/login\/dashboard\/?$/.test(path)) {
         // /login/dashboard/
         return (
            <StyledBreadcrumb
               label="Dashboard"
               icon={<DashboardIcon fontSize="small" />}
            />
         );
      } else if (/^\/login\/dashboard\/(?!server)[a-z-]+/.test(path)) {
         // /login/dashboard/api-servers
         let parts = path.split("/");
         return [
            <Link
               key="1"
               to={routes.dashboard_internal.key}
               style={{ textDecoration: "none" }}
            >
               <StyledBreadcrumb
                  label="Dashboard"
                  icon={<DashboardIcon fontSize="small" />}
                  sx={{ cursor: "pointer" }}
               />
            </Link>,
            <StyledBreadcrumb key="2" label={parts[3]} />,
         ];
      } else if (/^\/login\/dashboard\/server\/.+/.test(path)) {
         let parts = path.split("/");
         return [
            <Link
               key="1"
               to={routes.dashboard_internal.key}
               style={{ textDecoration: "none" }}
            >
               <StyledBreadcrumb
                  label="Dashboard"
                  icon={<DashboardIcon fontSize="small" />}
                  sx={{ cursor: "pointer" }}
               />
            </Link>,
            <StyledBreadcrumb key="2" label="server" />,
            <StyledBreadcrumb key="3" label={parts[4]} />,
         ];
      }
   }

   return (
      <div role="presentation" onClick={handleClick}>
         <Breadcrumbs aria-label="breadcrumb">{renderCrumb()}</Breadcrumbs>
      </div>
   );
}

export default BreadCrumb;
