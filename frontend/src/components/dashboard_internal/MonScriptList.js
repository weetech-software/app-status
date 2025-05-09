import * as React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import CircularProgress from "@mui/material/CircularProgress";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../../context/UserContext";
import { routes } from "../../core/config";

const MonScriptList = ({
   serverHostname,
   selectedMonScript,
   setSelectedMonScript,
   setOpenSnackbar,
}) => {
   const [monScriptList, setMonScriptList] = React.useState([]);
   const [isDataLoading, setIsDataLoading] = React.useState(false);
   const [selectedIdx, setSelectedIdx] = React.useState(-1);

   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const handleListItemClick = (event, idx) => {
      console.log(event.target.outerText);
      setSelectedMonScript(event.target.outerText);

      setSelectedIdx(idx);
   };

   const getServerMonList = () => {
      setIsDataLoading(true);
      fetch(
         `${process.env.REACT_APP_API_URL}/api/dashboard-internal/get-server-mon-list?host=${serverHostname}`,
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
         //.then((json) => console.log(json));
         .then((data) => setMonScriptList(data))
         .finally(() => setIsDataLoading(false));
   };

   React.useEffect(() => {
      getServerMonList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // when monscript list populated and selected mon script is loaded from param
   React.useEffect(() => {
      if (selectedMonScript && monScriptList) {
         //console.log(monScriptList);
         //console.log("selectedMonScript="+selectedMonScript );
         const idx = monScriptList.indexOf(selectedMonScript);
         setSelectedIdx(idx);
      }
   }, [selectedMonScript, monScriptList]);

   return (
      <>
         {isDataLoading ? (
            <CircularProgress />
         ) : (
            <List>
               {monScriptList.map((monScript, idx) => (
                  <ListItem key={idx} disablePadding>
                     <ListItemButton
                        onClick={(event) => handleListItemClick(event, idx)}
                        selected={selectedIdx === idx}
                     >
                        <ListItemText
                           primary={monScript}
                           sx={{ overflow: "hidden" }}
                        />
                     </ListItemButton>
                  </ListItem>
               ))}
            </List>
         )}
      </>
   );
};

export default MonScriptList;
