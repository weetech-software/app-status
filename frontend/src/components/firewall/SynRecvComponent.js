import React, { useState, useEffect } from "react";
import {
   DataGrid,
   GridToolbarQuickFilter,
   GridToolbarColumnsButton,
   GridToolbarContainer,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

//import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

/*
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
*/
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

/*
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useParams } from "react-router-dom";
*/
import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../../context/UserContext";

import { routes } from "../../core/config";

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
   { field: "ip", headerName: "IP", width: 300 },
   { field: "count", headerName: "Count", type: "number", width: 110 },
   { field: "is_ban", headerName: "Is ban", type: "boolean", width: 110 },
   {
      field: "initial_date_detected",
      headerName: "Initial Date Detected",
      width: 180,
      type: "dateTime",
   },
   {
      field: "last_update",
      headerName: "Last Update",
      width: 180,
      type: "dateTime",
   },
   /*
   {
      field: "description",
      headerName: "Description",
      hideable: false,
      width: 350,
      flex: 1,
   },
   {
      field: "metrics",
      headerName: "Metrics",
      valueFormatter: ({ value }) => JSON.stringify(value),
   },
   */
];

/*
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
*/

/*
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
*/

const SynRecvComponent = () => {
   /*
   const theme = useTheme();
   const matchesMD = useMediaQuery(theme.breakpoints.up("md"));
   */

   const navigate = useNavigate();
   //const parameters = useParams();
   var userDispatch = useUserDispatch();

   const [isDataLoading, setIsDataLoading] = useState(false);

   /*
   const [alignment, setAlignment] = React.useState("");
   const [server, setServer] = React.useState("");
   const [serverList, setServerList] = React.useState([]);
   const [filterModel, setFilterModel] = React.useState({ items: [] });
   const [alertMethods, setAlertMethods] = React.useState([]);
   */

   const initialPaginationModelState = {
      page: 0,
      pageSize: 20,
      sortField: "count",
      sortSort: "desc",
      filterColumnField: "",
      filterOperatorValue: "",
      filterValue: "",
      filterQuickFilterLogicOperator: "",
      filterQuickFilterValues: [],
      addressType: "all",
   };

   const initialDataModelState = {
      rows: [],
      rowCount: 0,
   };

   const initialFormState = {
      ip: "",
      count: 0,
      is_ban: false,
      initial_date_detected: "",
      last_update: "",
   };

   const [pageModel, setPageModel] = React.useState(
      initialPaginationModelState
   );
   const [dataModel, setDataModel] = React.useState(initialDataModelState);
   const [formModel, setFormModel] = React.useState(initialFormState);

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

   /*
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
   */

   function FormDeleteDialog() {
      return (
         <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
            <DialogTitle>
               Are you sure you want to proceed to delete?
            </DialogTitle>
            <DialogContent>
               <DialogContentText>Remove {formModel.ip}</DialogContentText>
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

   const loadSynRecv = () => {
      // mui is 0 indexed, api is 1 index, so conversion here.
      let apiPage = pageModel.page + 1;
      console.log(
         `pageSize=${pageModel.pageSize} page=${pageModel.page} ` +
            `apiPage=${apiPage} sortField=${pageModel.sortField} ` +
            `sortSort=${pageModel.sortSort} filterColumnField=${pageModel.filterColumnField} ` +
            `filterOperatorValue=${pageModel.filterOperatorValue} filterValue=${pageModel.filterValue} ` +
            `addressType=${pageModel.addressType} filterQuickFilterLogicOperator=${pageModel.filterQuickFilterLogicOperator} ` +
            `filterQuickFilterValues="${pageModel.filterQuickFilterValues.join(
               " "
            )}"`
      );
      setIsDataLoading(true);
      fetch(
         `${
            process.env.REACT_APP_API_URL
         }/api/firewall/syn-recv/read?addressType=${encodeURIComponent(
            pageModel.addressType
         )}&page=${encodeURIComponent(apiPage)}&limit=${encodeURIComponent(
            pageModel.pageSize
         )}&sortField=${encodeURIComponent(
            pageModel.sortField
         )}&sortSort=${encodeURIComponent(
            pageModel.sortSort
         )}&filterColumnField=${encodeURIComponent(
            pageModel.filterColumnField
         )}&filterOperatorValue=${encodeURIComponent(
            pageModel.filterOperatorValue
         )}&filterValue=${encodeURIComponent(
            pageModel.filterValue
         )}&filterQuickFilterLogicOperator=${encodeURIComponent(
            pageModel.filterQuickFilterLogicOperator
         )}&filterQuickFilterValues=${encodeURIComponent(
            pageModel.filterQuickFilterValues.join(" ")
         )}`,
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
         .then((data) => {
            setDataModel({ rows: data.result, rowCount: data.total });
         })
         .finally(() => setIsDataLoading(false));
   };

   useEffect(() => {
      loadSynRecv();
      /*
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
      */
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pageModel]);

   /*
   useEffect(() => {
      if (
         parameters.id &&
         /\d+/.test(parameters.id) &&
         tableData &&
         tableData.length > 0
      ) {
         const params = { id: parseInt(parameters.id) };
         loadSynRecvFullDetails(params, null, null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [tableData, parameters.id]);
   */

   /*
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
   */

   function getSynRecvConfig(row_id, rows) {
      for (const row of rows) {
         if (row.ip === row_id) {
            return row;
         }
      }
      return null;
   }

   const loadSynRecvFullDetails = (params, muiEvent, details) => {
      navigate(`${routes.defense_syn_recv.key}/${params.id}`);
      let srConfig = getSynRecvConfig(params.id, dataModel.rows);
      setFormModel(srConfig);
   };

   const resetForm = () => {
      setFormModel(initialFormState);
   };

   /*
   const handleNew = () => {
      resetForm();
   };
   */

   const handleSave = () => {
      if (formModel.ip === "") {
         console.log("handle save");
         /*
         console.log("add new");
         let hostType = "";
         if (alignment === "host") {
            hostType = server[0];
         } else {
            hostType = frmHostFile;
         }
         const alert_methods_conf = [];
         for (const am of frmAlertMethods) {
            const key = getKeyByName(alertMethods, am);
            alert_methods_conf.push(
               JSON.parse(alertMethods[key].configuration)
            );
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
               loadSynRecv();
            });
         */
      } else {
         console.log("update " + formModel.ip);
         const body = { ...formModel, is_ban: formModel.is_ban === "true" };
         fetch(
            `${process.env.REACT_APP_API_URL}/api/firewall/syn-recv/update`,
            {
               method: "POST",
               headers: {
                  "x-access-token": localStorage.getItem("bearerToken"),
                  "content-type": "application/json",
               },
               body: JSON.stringify(body),
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
               loadSynRecv();
            });
      }
   };

   const handleDelete = () => {
      console.log("handle Delete");
      const deleteMethod = {
         method: "DELETE",
         headers: {
            "x-access-token": localStorage.getItem("bearerToken"),
            "content-type": "application/json",
         },
         body: JSON.stringify({ ip: formModel.ip }),
      };
      fetch(
         `${process.env.REACT_APP_API_URL}/api/firewall/syn-recv/delete`,
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
            resetForm();
            navigate(routes.defense_syn_recv.key);
         })
         .then(() => loadSynRecv());
   };

   /*
   const getKeyByName = (object, name) => {
      return Object.keys(object).find((key) => object[key].name === name);
   };
   */

   const onSortChange = React.useCallback((sortModel) => {
      //console.log(sortModel);
      if (sortModel.length > 0) {
         const { field, sort } = sortModel[0];
         setPageModel((prev) => ({
            ...prev,
            sortField: field,
            sortSort: sort,
         }));
      } else {
         setPageModel((prev) => ({
            ...prev,
            sortField: initialPaginationModelState.sortField,
            sortSort: initialPaginationModelState.sortSort,
         }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const onFilterChange = React.useCallback((filterModel) => {
      //console.log(filterModel)

      if (filterModel.items?.length > 0) {
         const { columnField, operatorValue, value } = filterModel.items[0];
         setPageModel((prev) => ({
            ...prev,
            filterColumnField: columnField || "",
            filterOperatorValue: operatorValue || "",
            filterValue: value || "",
         }));
      } else {
         // set empty
         setPageModel((prev) => ({
            ...prev,
            filterColumnField: initialPaginationModelState.filterColumnField,
            filterOperatorValue:
               initialPaginationModelState.filterOperatorValue,
            filterValue: initialPaginationModelState.filterValue,
         }));
      }

      if (filterModel.quickFilterValues?.length > 0) {
         setPageModel((prev) => ({
            ...prev,
            filterQuickFilterLogicOperator:
               filterModel.quickFilterLogicOperator,
            filterQuickFilterValues: filterModel.quickFilterValues,
         }));
      } else {
         setPageModel((prev) => ({
            ...prev,
            filterQuickFilterLogicOperator:
               initialPaginationModelState.filterQuickFilterLogicOperator,
            filterQuickFilterValues:
               initialPaginationModelState.filterQuickFilterValues,
         }));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const CustomizedToolbar = () => {
      const handleChange = (ev) => {
         setPageModel((prev) => ({ ...prev, addressType: ev.target.value }));
      };

      return (
         <Box
            sx={{
               p: 1,
               pb: 0,
            }}
         >
            <GridToolbarContainer>
               <GridToolbarQuickFilter />
               <GridToolbarColumnsButton />
               <Select
                  variant="standard"
                  value={pageModel.addressType}
                  label="Address Type"
                  onChange={handleChange}
               >
                  <MenuItem value={"all"}>all</MenuItem>
                  <MenuItem value={"ipv4"}>ipv4</MenuItem>
                  <MenuItem value={"ipv6"}>ipv6</MenuItem>
               </Select>
            </GridToolbarContainer>
         </Box>
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
         <FormDeleteDialog />
         <Grid item xs={8}>
            <DataGrid
               rows={dataModel.rows}
               columns={columns}
               autoHeight
               components={{
                  LoadingOverlay: LinearProgress,
                  Toolbar: CustomizedToolbar,
               }}
               loading={isDataLoading}
               density="compact"
               checkboxSelection={false}
               paginationMode="server"
               rowCount={dataModel.rowCount}
               pagination
               page={pageModel.page}
               pageSize={pageModel.pageSize}
               rowsPerPageOptions={[10, 20, 40]}
               onPageChange={(newPage) =>
                  setPageModel((prev) => ({ ...prev, page: newPage }))
               }
               onPageSizeChange={(newPageSize) =>
                  setPageModel((prev) => ({ ...prev, pageSize: newPageSize }))
               }
               initialState={{
                  pagination: {
                     pageSize: initialPaginationModelState.pageSize,
                  },
                  sortModel: {
                     field: initialPaginationModelState.sortField,
                     sort: initialPaginationModelState.sortSort,
                  },
               }}
               sortingMode="server"
               onSortModelChange={onSortChange}
               filterMode="server"
               onFilterModelChange={onFilterChange}
               onRowClick={loadSynRecvFullDetails}
               //sx={{ height: 674, width: "100%" }}
               /*
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
               */
               getRowId={(row) => row.ip}
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
                  startIcon={<SaveIcon />}
                  color="success"
                  disabled={formModel.ip === undefined || formModel.ip === ""}
                  onClick={handleSave}
               >
                  Save
               </Button>
               <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="error"
                  disabled={formModel.ip === undefined || formModel.ip === ""}
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
               <TextField
                  required
                  id="ip"
                  name="ip"
                  label="IP"
                  value={formModel.ip}
                  disabled={true}
                  onChange={(e) =>
                     setFormModel((prev) => ({ ...prev, ip: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="count"
                  name="count"
                  label="Count"
                  value={formModel.count}
                  onChange={(e) =>
                     setFormModel((prev) => ({
                        ...prev,
                        count: e.target.value,
                     }))
                  }
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="is_ban"
                  name="is_ban"
                  label="Is ban"
                  value={formModel.is_ban}
                  onChange={(e) =>
                     setFormModel((prev) => ({
                        ...prev,
                        is_ban: e.target.value,
                     }))
                  }
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="initial_date_detected"
                  name="initial_date_detected"
                  label="Initial Date Detected"
                  value={formModel.initial_date_detected}
                  onChange={(e) =>
                     setFormModel((prev) => ({
                        ...prev,
                        initial_date_detected: e.target.value,
                     }))
                  }
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="last_update"
                  name="last_update"
                  label="Last update"
                  value={formModel.last_update}
                  onChange={(e) =>
                     setFormModel((prev) => ({
                        ...prev,
                        last_update: e.target.value,
                     }))
                  }
                  InputLabelProps={{ shrink: true }}
               />
            </Box>
         </Grid>
      </>
   );
};

export default SynRecvComponent;
