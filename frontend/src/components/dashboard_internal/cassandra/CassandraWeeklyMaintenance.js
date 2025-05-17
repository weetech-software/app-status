import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../../../context/UserContext";
import { routes } from "../../../core/config";
import { ChartScatter, ChartRadar } from "../Charts";

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialState = {
   filterServer: "all",
   filterPeriod: "last_week",
   servers: [],
   periods: [],
   dataCassandraWeeklyMaintenance: JSON.parse(
      '{ "xaxis": { "type": "category", "dataKey": "x", "name": "date", "unit": "" }, "yaxis": { "type": "number", "dataKey": "y", "name": "duration", "unit": "secs" }, "datas": []}'
   ),
   dataCassandraWeeklyMaintenanceStat: JSON.parse(
      '{ "dataKey": "metric", "data": [ { "metric": "calculation_duration", "A": 0 }, { "metric": "duration_mean", "A": 0}, { "metric": "duration_variance", "A": 0}, {"metric": "duration_std_dev", "A": 0}, {"metric": "duration_median", "A": 0 }], "metaData": [ { "name": "c01.weetech.ch", "dataKey": "A", "stroke": "#8884d8", "color": "#8884d8" } ]}'
   ),
};

const CassandraWeeklyMaintenanceComponent = () => {
   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const [state, setState] = useState(initialState);

   const [openSnackbar, setOpenSnackbar] = React.useState({
      open: false,
      message: "",
   });
   const handleSavedClose = (
      event?: React.SyntheticEvent | Event,
      reason?: string
   ) => {
      if (reason === "clickaway") {
         return;
      }

      setOpenSnackbar((prevState) => ({ ...prevState, open: false }));
   };

   const loadPeriods = () => {
      fetch(
         `${process.env.REACT_APP_API_URL}/api/cluster/cassandra/cassandra-weekly-maintenance/periods`,
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
         .then((data) => {
            setState((prev) => ({
               ...prev,
               periods: data.filter((n) => n !== "last_week"),
            }));
         });
   };

   const loadServers = () => {
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
         .then((data) => {
            for (let i = 0; i < data.length; i++) {
               let row = data[i];
               const cname = row.name;
               if (cname === "cassandra servers") {
                  //console.log(cname);
                  const servers = data[i].nodes.map((n) => n.name);
                  //console.log(monScripts);
                  //console.log(servers);
                  setState((prev) => ({
                     ...prev,
                     servers: servers,
                  }));
               }
            }
         });
   };

   const loadRadarChart = () => {
      fetch(
         `${process.env.REACT_APP_API_URL}/api/cluster/cassandra/cassandra-weekly-maintenance-stat?period=last_week`,
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
         .then((data) => {
            const metricData = [];
            let metricCalculationDuration = { metric: "calculation_duration" };
            let metricDurationMean = { metric: "duration_mean" };
            let metricDurationVariance = { metric: "duration_variance" };
            let metricDurationStdDev = { metric: "duration_std_dev" };
            let metricDurationMedian = { metric: "duration_median" };

            const metricMetaData = [];

            for (const row of data) {
               const shortHostname = row.host.replace(".weetech.ch", "");
               metricCalculationDuration = {
                  ...metricCalculationDuration,
                  [shortHostname]: row.calculation_duration,
               };
               metricDurationMean = {
                  ...metricDurationMean,
                  [shortHostname]: row.duration_mean,
               };
               metricDurationVariance = {
                  ...metricDurationVariance,
                  [shortHostname]: row.duration_variance,
               };
               metricDurationStdDev = {
                  ...metricDurationStdDev,
                  [shortHostname]: row.duration_std_dev,
               };
               metricDurationMedian = {
                  ...metricDurationMedian,
                  [shortHostname]: row.duration_median,
               };

               const color = `#${Math.floor(Math.random() * 16777215).toString(
                  16
               )}`;
               metricMetaData.push({
                  name: row.host,
                  dataKey: shortHostname,
                  stroke: color,
                  color: color,
               });
            }
            metricData.push(
               metricCalculationDuration,
               metricDurationMean,
               metricDurationVariance,
               metricDurationStdDev,
               metricDurationMedian
            );
            const radarChartData = {
               dataKey: "metric",
               data: metricData,
               metaData: metricMetaData,
            };
            setState((prevState) => ({
               ...prevState,
               dataCassandraWeeklyMaintenanceStat: radarChartData,
            }));
         });
   };

   useEffect(() => {
      loadPeriods();
      loadServers();
      loadRadarChart();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      fetch(
         `${process.env.REACT_APP_API_URL}/api/cluster/cassandra/cassandra-weekly-maintenance?server=${state.filterServer}&period=${state.filterPeriod}`,
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
         .then((data) => {
            if (state.filterServer === "all") {
               const dataByServer = [];
               for (const row of data) {
                  if (dataByServer[row.host]) {
                     dataByServer[row.host].push({
                        x: row.insert_time.replace(
                           / [0-9]{2}:[0-9]{2}:[0-9]{2}/,
                           ""
                        ),
                        y: row.duration,
                     });
                  } else {
                     dataByServer[row.host] = [
                        {
                           x: row.insert_time.replace(
                              / [0-9]{2}:[0-9]{2}:[0-9]{2}/,
                              ""
                           ),
                           y: row.duration,
                        },
                     ];
                  }
               }
               const allData = [];
               for (const key in dataByServer) {
                  const cData = {
                     name: key,
                     color: `#${Math.floor(Math.random() * 16777215).toString(
                        16
                     )}`,
                     data: dataByServer[key],
                  };
                  allData.push(cData);
               }
               setState((prevState) => ({
                  ...prevState,
                  dataCassandraWeeklyMaintenance: {
                     ...prevState.dataCassandraWeeklyMaintenance,
                     datas: allData,
                  },
               }));
            } else {
               const dataTransform = [];
               for (const row of data) {
                  dataTransform.push({ x: row.insert_time, y: row.duration });
               }
               const cData = {
                  name: state.filterServer,
                  color: "#8884d8",
                  data: dataTransform,
               };
               setState((prevState) => ({
                  ...prevState,
                  dataCassandraWeeklyMaintenance: {
                     ...prevState.dataCassandraWeeklyMaintenance,
                     datas: [cData],
                  },
               }));
            }
         });

      // eslint-disable-next-line
   }, [state.filterPeriod, state.filterServer]);

   const renderPeriod = () => {
      return (
         <Select
            value={state.filterPeriod}
            label="Filter period"
            onChange={(event) =>
               setState((prev) => ({
                  ...prev,
                  filterPeriod: event.target.value,
               }))
            }
         >
            <MenuItem key={0} value={"last_week"}>
               last week
            </MenuItem>
            {state.periods.map((period, index) => {
               const cIndex = index + 1;
               return (
                  <MenuItem key={cIndex} value={period}>
                     {period.replace(/_/g, " ")}
                  </MenuItem>
               );
            })}
         </Select>
      );
   };

   const renderServers = () => {
      return (
         <Select
            value={state.filterServer}
            label="Filter server"
            onChange={(event) =>
               setState((prev) => ({
                  ...prev,
                  filterServer: event.target.value,
               }))
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
      <>
         <Snackbar
            open={openSnackbar.open}
            autoHideDuration={6500}
            onClose={handleSavedClose}
         >
            <Alert
               onClose={handleSavedClose}
               severity="error"
               sx={{ width: "100%" }}
            >
               {openSnackbar.message}
            </Alert>
         </Snackbar>
         <Box
            sx={{
               height: "100%",
               width: "100%",
               "& .actions": {
                  color: "text.secondary",
               },
               "& .textPrimary": {
                  color: "text.primary",
               },
            }}
         >
            <Box marginTop={3} sx={{ display: "flex" }}>
               <Box width={{ xs: 250 }}>{renderPeriod()}</Box>
               <Box width={{ xs: 250 }}>{renderServers()}</Box>
            </Box>
            <ChartScatter chartData={state.dataCassandraWeeklyMaintenance} />
            <ChartRadar chartData={state.dataCassandraWeeklyMaintenanceStat} />
         </Box>
      </>
   );
};

export default CassandraWeeklyMaintenanceComponent;
