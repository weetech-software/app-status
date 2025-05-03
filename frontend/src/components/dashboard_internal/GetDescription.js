import * as React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import CircularProgress from "@mui/material/CircularProgress";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../../context/UserContext";
import { routes } from "../../core/config";

const GetDescription = ({
   serverHostname,
   selectedMonScript,
   selectedMonScriptDescription,
   setSelectedMonScriptDescription,
}) => {
   const [monScriptDescriptions, setMonScriptDescriptions] = React.useState([]);
   const [isDataLoading, setIsDataLoading] = React.useState(false);
   const [selectedIdx, setSelectedIdx] = React.useState(-1);

   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const handleListItemClick = (event, idx) => {
      //console.log(event.target.outerText);
      setSelectedMonScriptDescription(event.target.outerText);

      setSelectedIdx(idx);
   };

   const getServerMonList = () => {
      if (selectedMonScript) {
         setSelectedIdx(-1);
         setIsDataLoading(true);
         fetch(
            `${process.env.REACT_APP_API_URL}/api/dashboard-internal/get-mon-script-description?host=${serverHostname}&rra=daily&file=${selectedMonScript}`,
            {
               headers: {
                  "x-access-token": localStorage.getItem("bearerToken"),
               },
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
            .then((rows) => {
               let descriptions = [];
               for (const row of rows) {
                  descriptions.push(row.description);
               }
               setMonScriptDescriptions(descriptions);
            })
            .finally(() => setIsDataLoading(false));
      }
   };

   React.useEffect(() => {
      getServerMonList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedMonScript]);

   // when monScriptDescriptions populated and selcted description is loaded from param
   React.useEffect(() => {
      if (selectedMonScriptDescription && monScriptDescriptions) {
         //console.log(selectedMonScriptDescription);
         //console.log("selectedMonScriptDescription="+monScriptDescriptions);
         const idx = monScriptDescriptions.indexOf(
            selectedMonScriptDescription
         );
         setSelectedIdx(idx);
      }
   }, [selectedMonScriptDescription, monScriptDescriptions]);

   return (
      <>
         {isDataLoading ? (
            <CircularProgress />
         ) : (
            <List>
               {monScriptDescriptions.map((monScriptDescription, idx) => (
                  <ListItem key={idx} disablePadding>
                     <ListItemButton
                        onClick={(event) => handleListItemClick(event, idx)}
                        selected={selectedIdx === idx}
                     >
                        <ListItemText primary={monScriptDescription} />
                     </ListItemButton>
                  </ListItem>
               ))}
            </List>
         )}
      </>
   );
};

export default GetDescription;
