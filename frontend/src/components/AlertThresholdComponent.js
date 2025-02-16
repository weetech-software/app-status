import React, { useState, useEffect } from "react";
import {
   DataGrid,
   GridToolbarQuickFilter,
   GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useNavigate, useParams } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";

import { routes } from "../core/config";

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
   { field: "id", headerName: "ID", width: 10, hideable: false },
   {
      field: "description",
      headerName: "Description",
      hideable: false,
      width: 350,
      flex: 1,
   },
   { field: "enable", headerName: "Enable", hideable: false },
   { field: "hostFile", headerName: "Host file" },
   { field: "script", headerName: "Script" },
   {
      field: "metrics",
      headerName: "Metrics",
      valueFormatter: ({ value }) => JSON.stringify(value),
   },
   {
      field: "exclude_hosts",
      headerName: "Exclude hosts",
      valueFormatter: ({ value }) => JSON.stringify(value),
   },
   { field: "value", headerName: "Value" },
   { field: "operator", headerName: "Operator" },
   { field: "threshold_operator", headerName: "Threshold operator" },
   { field: "alert_value", headerName: "Alert value" },
   {
      field: "alert_methods",
      headerName: "Alert methods",
      valueFormatter: ({ value }) => JSON.stringify(value),
   },
];

function CustomizedToolbar() {
   return (
      <Box
         sx={{
            p: 0.5,
            pb: 0,
         }}
      >
         <GridToolbarQuickFilter />
         <GridToolbarColumnsButton />
      </Box>
   );
}

const operators = [
   {
      value: "<",
      label: "<",
   },
   {
      value: "<=",
      label: "<=",
   },
   {
      value: "==",
      label: "==",
   },
   {
      value: "!=",
      label: "!=",
   },
   {
      value: ">=",
      label: ">=",
   },
   {
      value: ">",
      label: ">",
   },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AlertThresholdComponent = () => {
   const theme = useTheme();
   const matchesMD = useMediaQuery(theme.breakpoints.up("md"));

   const navigate = useNavigate();
   const parameters = useParams();
   var userDispatch = useUserDispatch();

   const [tableData, setTableData] = useState([]);
   const [isDataLoading, setIsDataLoading] = useState(false);

   const [frmId, setFrmId] = useState("");
   const [frmDescription, setFrmDescription] = useState("");
   const [frmEnable, setFrmEnable] = useState(false);
   const [frmHostFile, setFrmHostFile] = useState("");
   const [frmScript, setFrmScript] = useState("");
   const [frmMetrics, setFrmMetrics] = useState([]);
   const [frmExcludeHosts, setFrmExcludeHosts] = useState([]);
   const [frmValue, setFrmValue] = useState("");
   const [frmOperator, setFrmOperator] = useState("");
   const [frmThresholdOperator, setFrmThresholdOperator] = useState("");
   const [frmAlertValue, setFrmAlertValue] = useState("");
   const [frmAlertMethods, setFrmAlertMethods] = useState([]);

   const [alignment, setAlignment] = React.useState("");
   const [server, setServer] = React.useState("");

   const [serverList, setServerList] = React.useState([]);

   const [filterModel, setFilterModel] = React.useState({ items: [] });

   const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
      hostFile: false,
      script: false,
      metrics: false,
      exclude_hosts: false,
      value: false,
      operator: false,
      threshold_operator: false,
      alert_value: false,
      alert_methods: false,
   });

   const [alertMethods, setAlertMethods] = React.useState([]);

   const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
   const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
   const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

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

   const handleChange = (event, newAlignment) => {
      if (newAlignment !== null) {
         setAlignment(newAlignment);
      }
   };

   const handleServerChange = (event, newValue) => {
      setServer(newValue);
   };

   const handleMetricsChange = (event, newValue) => {
      setFrmMetrics(newValue);
   };

   const handleExcludeHostsChange = (event, newValue) => {
      setFrmExcludeHosts(newValue);
   };

   function FormDeleteDialog() {
      return (
         <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
            <DialogTitle>
               Are you sure you want to proceed to delete?
            </DialogTitle>
            <DialogContent>
               <DialogContentText>Remove {frmId}</DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button autoFocus onClick={handleDeleteConfirmClose}>
                  No
               </Button>
               <Button onClick={handleDelete}>Yes</Button>
            </DialogActions>
         </Dialog>
      );
   }

   const loadAlertThresholdConfigurations = () => {
      setIsDataLoading(true);
      fetch(
         `${process.env.REACT_APP_API_URL}/api/alert_threshold/?host-file-only=true`,
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
                     setOpenSnackbar((prevState) => ({
                        message: "not authorize",
                        open: true,
                     }));
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
         .then((data) => setTableData(data.configurations))
         .finally(() => setIsDataLoading(false));
   };

   useEffect(() => {
      loadAlertThresholdConfigurations();
      if (parameters.id && /\d+/.test(parameters.id)) {
         setFilterModel({
            items: [
               {
                  columnField: "id",
                  operatorValue: "equals",
                  value: parameters.id,
               },
            ],
            linkOperator: "and",
            quickFilterLogicOperator: "and",
            quickFilterValues: [parameters.id],
         });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (
         parameters.id &&
         /\d+/.test(parameters.id) &&
         tableData &&
         tableData.length > 0
      ) {
         const params = { id: parseInt(parameters.id) };
         loadATConfigFullDetails(params, null, null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [tableData, parameters.id]);

   useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/firewall/servers/list`, {
         headers: { "x-access-token": localStorage.getItem("bearerToken") },
      })
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
                     setOpenSnackbar((prevState) => ({
                        message: "not authorize",
                        open: true,
                     }));
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
         .then((data) => setServerList(data));

      fetch(`${process.env.REACT_APP_API_URL}/api/alert-method/`, {
         headers: { "x-access-token": localStorage.getItem("bearerToken") },
      })
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
                     setOpenSnackbar((prevState) => ({
                        message: "not authorize",
                        open: true,
                     }));
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
         .then((data) => setAlertMethods(data));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function getATConfig(row_id, configurations) {
      for (const config of configurations) {
         if (config.id === row_id) {
            return config;
         }
      }
      return null;
   }

   const loadATConfigFullDetails = (params, muiEvent, details) => {
      navigate(`${routes.alert_threshold.key}/${params.id}`);
      let atConfig = getATConfig(params.id, tableData);

      setFrmId(atConfig.id);
      setFrmDescription(atConfig.description);
      if (atConfig.enable === "True") {
         setFrmEnable(true);
      } else {
         setFrmEnable(false);
      }
      // have to set this to empty field so previou state is not
      // persists if user click on diff at config
      setFrmHostFile("");
      setServer("");
      if (atConfig.hostFile.startsWith("/")) {
         setFrmHostFile(atConfig.hostFile);
         setAlignment("hostFile");
      } else {
         setServer(atConfig.hostFile);
         setAlignment("host");
      }
      setFrmScript(atConfig.script);
      setFrmMetrics(atConfig.metrics);
      if (atConfig.exclude_hosts === "None") {
         setFrmExcludeHosts([]);
      } else {
         setFrmExcludeHosts(atConfig.exclude_hosts);
      }
      setFrmValue(atConfig.value);
      setFrmOperator(atConfig.operator);
      setFrmThresholdOperator(atConfig.threshold_operator);
      setFrmAlertValue(atConfig.alert_value);
      setFrmAlertMethods([]);
      for (const at of atConfig.alert_methods) {
         const foundKey = getKeyByConfig(alertMethods, at)
         if (foundKey != null) {
           const at_name = alertMethods[foundKey].name;
           setFrmAlertMethods(prev => ([...prev, at_name]));
         }
      }
   };

   const resetForm = () => {
      setFrmId("");
      setFrmDescription("");
      setFrmEnable(false);
      setFrmHostFile("");
      setFrmScript("");
      setFrmMetrics([]);
      setFrmExcludeHosts([]);
      setFrmValue("");
      setFrmOperator("");
      setFrmThresholdOperator("");
      setFrmAlertValue("");
      setFrmAlertMethods([]);

      setServer("");
      setAlignment("");
   };

   const handleNew = () => {
      console.log("handle new");
      resetForm();
   };

   const handleSave = () => {
      console.log("handle save");
      if (frmId === "") {
         console.log("add new");
         let hostType = "";
         if (alignment === "host") {
            hostType = server[0];
         } else {
            hostType = frmHostFile;
         }
         const alert_methods_conf = [];
         for (const am of frmAlertMethods) {
            const key = getKeyByName(alertMethods, am)
            alert_methods_conf.push(JSON.parse(alertMethods[key].configuration))
         }
         const data = {
            description: frmDescription,
            enable: frmEnable ? "True" : "False",
            hostFile: hostType,
            script: frmScript,
            metrics: JSON.stringify(frmMetrics),
            exclude_hosts:
               frmExcludeHosts.length > 0
                  ? JSON.stringify(frmExcludeHosts)
                  : "None",
            value: frmValue,
            operator: frmOperator,
            threshold_operator: frmThresholdOperator,
            alert_value: frmAlertValue,
            alert_methods: JSON.stringify(alert_methods_conf),
         };
         fetch(`${process.env.REACT_APP_API_URL}/api/alert_threshold/create`, {
            method: "POST",
            headers: {
               "x-access-token": localStorage.getItem("bearerToken"),
               "content-type": "application/json",
            },
            body: JSON.stringify(data),
         })
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
                        setOpenSnackbar((prevState) => ({
                           message: "not authorize",
                           open: true,
                        }));
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
            .then((res) => {
               //console.log("Request complete! response:", res);
               resetForm();
            })
            .then((res) => {
               loadAlertThresholdConfigurations();
            });
      } else {
         console.log("update " + frmId);
         let hostType = "";
         if (alignment === "host") {
            hostType = server;
         } else {
            hostType = frmHostFile;
         }
         const alert_methods_conf = [];
         for (const am of frmAlertMethods) {
            const key = getKeyByName(alertMethods, am)
            alert_methods_conf.push(JSON.parse(alertMethods[key].configuration))
         }
         const data = {
            description: frmDescription,
            enable: frmEnable ? "True" : "False",
            hostFile: hostType,
            script: frmScript,
            metrics: JSON.stringify(frmMetrics),
            exclude_hosts:
               frmExcludeHosts.length > 0
                  ? JSON.stringify(frmExcludeHosts)
                  : "None",
            value: frmValue,
            operator: frmOperator,
            threshold_operator: frmThresholdOperator,
            alert_value: frmAlertValue,
            alert_methods: JSON.stringify(alert_methods_conf),
         };
         fetch(
            `${process.env.REACT_APP_API_URL}/api/alert_threshold/${frmId}/update`,
            {
               method: "PUT",
               headers: {
                  "x-access-token": localStorage.getItem("bearerToken"),
                  "content-type": "application/json",
               },
               body: JSON.stringify(data),
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
                        setOpenSnackbar((prevState) => ({
                           message: "not authorize",
                           open: true,
                        }));
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
            .then((res) => {
               loadAlertThresholdConfigurations();
            });
      }
   };

   const handleDelete = () => {
      console.log("handle Delete");
      const deleteMethod = {
         method: "DELETE",
         headers: { "x-access-token": localStorage.getItem("bearerToken") },
      };
      fetch(
         `${process.env.REACT_APP_API_URL}/api/alert_threshold/${frmId}/delete`,
         deleteMethod
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
                     setOpenSnackbar((prevState) => ({
                        message: "not authorize",
                        open: true,
                     }));
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
         .then(() => setOpenDeleteConfirm(false))
         .then(() => {
            setFrmId("");
            resetForm();
            navigate(routes.alert_threshold.key);
         })
         .then(() => loadAlertThresholdConfigurations());
   };

   const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    setFrmAlertMethods(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
   };

   const getKeyByConfig = (object, config) => {
      return Object.keys(object).find(key => JSON.stringify(JSON.parse(object[key].configuration)) === JSON.stringify(config));
   }

   const getKeyByName = (object, name) => {
      return Object.keys(object).find(key => object[key].name === name);
   }

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
         <FormDeleteDialog />
         <Grid item xs={8}>
            <DataGrid
               rows={tableData}
               columns={columns}
               pageSize={15}
               sx={{ height: 674, width: "100%" }}
               components={{
                  LoadingOverlay: LinearProgress,
                  Toolbar: CustomizedToolbar,
               }}
               loading={isDataLoading}
               density="compact"
               columnVisibilityModel={columnVisibilityModel}
               onColumnVisibilityModelChange={(newModel) =>
                  setColumnVisibilityModel(newModel)
               }
               onRowClick={loadATConfigFullDetails}
               checkboxSelection={false}
               filterModel={filterModel}
               onFilterModelChange={(model, details) => {
                  if (model.quickFilterValues) {
                     if (model.quickFilterValues.length === 0) {
                        setFilterModel({ items: [] });
                        resetForm();
                        navigate(routes.alert_threshold.key);
                     } else {
                        setFilterModel(model);
                     }
                  }
               }}
            />
         </Grid>
         <Grid item xs={4}>
            <Stack
               sx={{ mb: 2 }}
               direction={{ xs: "column", md: "row" }}
               spacing={2}
            >
               <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  color="success"
                  onClick={handleNew}
               >
                  New
               </Button>
               <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  color="success"
                  disabled={frmId === undefined}
                  onClick={handleSave}
               >
                  Save
               </Button>
               <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="error"
                  disabled={frmId === undefined || frmId === ""}
                  onClick={handleDeleteConfirmOpen}
               >
                  Delete
               </Button>
            </Stack>
            <Box
               component="form"
               sx={{
                  "& .MuiTextField-root": { ml: 1, mb: 1, width: "100%" },
               }}
            >
               <FormControlLabel
                  control={
                     <Switch
                        required
                        id="enable"
                        name="enable"
                        label="Enable"
                        checked={frmEnable}
                        onChange={(e) => setFrmEnable(e.target.checked)}
                        color="success"
                     />
                  }
                  label="Enable"
                  sx={{ color: "rgba(0, 0, 0, 0.6)", mb: 1 }}
                  labelPlacement="start"
               />
               <TextField
                  required
                  id="id"
                  name="id"
                  label="ID"
                  value={frmId}
                  disabled={true}
                  onChange={(e) => setFrmId(e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="description"
                  name="description"
                  label="Description"
                  value={frmDescription}
                  multiline
                  minRows={2}
                  maxRows={2}
                  onChange={(e) => setFrmDescription(e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
               <ToggleButtonGroup
                  color="success"
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                  orientation={matchesMD ? "horizontal" : "vertical"}
                  sx={{ ml: 1, mb: 1 }}
               >
                  <ToggleButton value="host">Host</ToggleButton>
                  <ToggleButton value="hostFile">Host File</ToggleButton>
               </ToggleButtonGroup>
               {alignment === "host" && (
                  <Autocomplete
                     id="tags-filled"
                     options={serverList}
                     value={server}
                     onChange={handleServerChange}
                     freeSolo
                     renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                           <Chip
                              variant="outlined"
                              label={option}
                              {...getTagProps({ index })}
                           />
                        ))
                     }
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           label="Hostname"
                           placeholder="select a server, example api.weetech.ch"
                           InputLabelProps={{ shrink: true }}
                           required
                        />
                     )}
                  />
               )}
               {alignment === "hostFile" && (
                  <TextField
                     required
                     id="host"
                     name="host"
                     label="HostFile"
                     value={frmHostFile}
                     onChange={(e) => setFrmHostFile(e.target.value)}
                     InputLabelProps={{ shrink: true }}
                     placeholder="/app/monitoring/weetech/api/conf/list-nodes.conf"
                  />
               )}
               <TextField
                  required
                  id="script"
                  name="script"
                  label="Script"
                  value={frmScript}
                  onChange={(e) => setFrmScript(e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
               <Autocomplete
                  id="metrics"
                  name="metrics"
                  label="Metrics"
                  value={frmMetrics}
                  onChange={handleMetricsChange}
                  options={[]}
                  multiple
                  freeSolo
                  renderTags={(value, getTagProps) =>
                     value.map((option, index) => (
                        <Chip
                           variant="outlined"
                           label={option}
                           {...getTagProps({ index })}
                        />
                     ))
                  }
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        required
                        label="Metrics"
                        placeholder="enter /var and then hit enter"
                        InputLabelProps={{ shrink: true }}
                     />
                  )}
               />
               <Autocomplete
                  id="exclude_hosts"
                  name="exclude_hosts"
                  label="Exclude hosts"
                  value={frmExcludeHosts}
                  onChange={handleExcludeHostsChange}
                  options={[]}
                  multiple
                  freeSolo
                  renderTags={(value, getTagProps) =>
                     value.map((option, index) => (
                        <Chip
                           variant="outlined"
                           label={option}
                           {...getTagProps({ index })}
                        />
                     ))
                  }
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        required
                        label="Exclude hosts"
                        placeholder="enter abc.weetech.ch and then hit enter or leave it empty"
                        InputLabelProps={{ shrink: true }}
                     />
                  )}
               />
               <TextField
                  required
                  id="value"
                  name="value"
                  label="Value"
                  value={frmValue}
                  onChange={(e) => setFrmValue(e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="operator"
                  name="operator"
                  label="Operator"
                  value={frmOperator}
                  onChange={(e) => setFrmOperator(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  select
               >
                  {operators.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                        {option.label}
                     </MenuItem>
                  ))}
               </TextField>
               <TextField
                  required
                  id="threshold_operator"
                  name="threshold_operator"
                  label="Threshold operator"
                  value={frmThresholdOperator}
                  onChange={(e) => setFrmThresholdOperator(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  select
               >
                  {operators.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                        {option.label}
                     </MenuItem>
                  ))}
               </TextField>
               <TextField
                  required
                  id="alert_value"
                  name="alert_value"
                  label="Alert value"
                  value={frmAlertValue}
                  onChange={(e) => setFrmAlertValue(e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
               <FormControl sx={{ width: '100%', ml: '8px', mb: '8px'  }}>
               <InputLabel id="demo-multiple-checkbox-label">Alert Methods</InputLabel>
               <Select
                  labelId="demo-multiple-checkbox-label"
                  label="Alert Methods"
                  multiple
                  value={frmAlertMethods}
                  onChange={handleChange1}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
               >
                  {alertMethods.map((row) => (
                    <MenuItem key={row.id} value={row.name}>
                      <Checkbox checked={frmAlertMethods.indexOf(row.name) > -1} />
                      <ListItemText primary={row.name} />
                    </MenuItem>
                  ))}
               </Select>
               </FormControl>
            </Box>
         </Grid>
      </>
   );
};

export default AlertThresholdComponent;
