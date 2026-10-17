import * as React from "react";

import ServerCard from "../components/ServerCard";
import Breadcrumb from "../components/Breadcrumb";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import CircularProgress from "@mui/material/CircularProgress";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";

import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

import { routes } from "../core/config";

export default function Dashboard() {

  const [servers, setServers] = React.useState([]);
  const [loadingServerList, setLoadingServerList] = React.useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  var userDispatch = useUserDisptach();

  React.useEffect(() => {
     setLoadingServerList(true);
     fetch(
        `${process.env.REACT_APP_API_URL}/api/dashboard-internal/get-all-servers`,
        {
           headers: { "x-access-token": localStorage.getItem("bearerToken") },
        }
     )
     .then(function (response) {
        if (response.ok) {
           return response;
        } else {
           response.json().then((json) => {
              if (json.message === "Token is expired") {
                 const navigateState = {
                    state: { message: "session expired" },
                 };
                 signOut(
                    userDispatch,
                    navigate,
                    routes.login.key,
                    navigateState
                 );
              } else if (json.message === "not authorize to access") {
                 const navigateState = {
                    state: { message: "not authorize to access" },
                 };
                 signOut(
                    userDispatch,
                    navigate,
                    routes.login.key,
                    navigateState
                 );
              } else {
                 const navigateState = {
                    state: { message: "unauth" },
                 };
                 signOut(
                    userDispatch,
                    navigate,
                    routes.login.key,
                    navigateState
                 );
              }
           });
        }
     })
     .then((data) => data.json())
     .then((data) => setServers(data))
     .finally(() => setLoadingServerList(false));
     // eslint-disable-next-line
  }, []);

}
