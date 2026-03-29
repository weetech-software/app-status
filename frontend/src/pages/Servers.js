import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import BasicModal from "../components/Modal";
import Breadcrumb from "../components/Breadcrumb";
import { ChartLine } from "../components/dashboard_internal/Charts";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";
import { routes } from "../core/config";

const initialState = {
   period: "hourly",
   filter: "all",
   monScripts: [
      {
         monscript: "",
         description: "",
      },
   ],
   servers: [],
};

export default function Servers() {
   let params = useParams();

   const location = useLocation();

   const [state, setState] = React.useState(initialState);
   const [allOrSingle, setAllOrSingle] = React.useState([]);

   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   React.useEffect(() => {
     fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-internal/get-all-servers`,
      {
        headers: {"x-access-token": localStorage.getItem("bearerToken")},
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
         .then((data) => {
            for (let i = 0; i < data.length; i++) {
               let row = data[i];
               const cname = row.name.replace(" ", "-");
               if (cname === params.servers) {
                  //console.log(cname);
                  const monScripts = data[i].board.map((n) => {
                     return {
                        monscript: n.monscript,
                        description: n.description || "default",
                     };
                  });
                  const servers = data[i].nodes.map((n) => n.name);
                  //console.log(monScripts);
                  //console.log(servers);
                  setState((prev) => ({
                     ...prev,
                     monScripts: monScripts,
                     servers: servers,
                  }));
               }
            }
         });
      // eslint-disable-next-line
   }, [])

   const renderPeriod = () => {
      return (
         <Select
            value={state.period}
            label="Period"
            onChange={(event) =>
               setState((prev) => ({ ...prev, period: event.target.value }))
            }
         >
            <MenuItem value={"hourly"}>Hourly</MenuItem>
            <MenuItem value={"daily"}>Daily</MenuItem>
         </Select>
      );
   };

   const renderServers = () => {
      return (
         <Select
            value={state.filter}
            label="Filter server"
            onChange={(event) =>
               setState((prev) => ({ ...prev, filter: event.target.value }))
            }
         >
            <MenuItem key={0} value={"all"}>
               all
            </MenuItem>
            {state.servers.map((node, index) => {
               const cIndex = index + 1;
               return (
                  <MenuItem key={cIndex} value={node}>
                     {node}
                  </MenuItem>
               );
            })}
         </Select>
      );
   };

   return (

   )

}
