import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
   DataGrid,
   //   GridToolbar,
   GridToolbarContainer,
   GridToolbarFilterButton,
} from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

import Stack from "@mui/material/Stack";
import TextareaAutosize from "@mui/base/TextareaAutosize";

//import Box from "@mui/material/Box";
//import Typography from "@mui/material/Typography";
//import Modal from "@mui/material/Modal";
//import InputLabel from "@mui/material/InputLabel";
//import Input from "@mui/material/Input";
//import FormControl from "@mui/material/FormControl";
//import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
//import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";
import { routes } from "../core/config";

const columns = [
   { field: "id", headerName: "ID", width: 5 },
   { field: "dateCreated", headerName: "Date", minWidth: 20, flex: 1 },
   { field: "server", headerName: "Server", minWidth: 130, flex: 1 },
   {
      field: "diskSerialNumber",
      headerName: "Disk Serial Number",
      minWidth: 130,
      flex: 1,
   },
];

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/*
const style = {
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 400,
   bgcolor: "background.paper",
   border: "2px solid #000",
   boxShadow: 24,
   p: 4,
};
*/

const DiskInventoryComponent = () => {
   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const [selectedIDS, setSelectedIDS] = React.useState([]);
   const [currentID, setCurrentID] = React.useState([]);

   const [rows, setRows] = useState([]);
   const [isDataLoading, setIsDataLoading] = useState(false);

   const [diskInventoryFullDetail, setDiskInventoryFullDetail] = useState("");
   const [dateCreated, setDateCreated] = useState("");
   const [jira, setJira] = useState("");
   const [server, setServer] = useState("");
   const [diskSerialNumber, setDiskSerialNumber] = useState("");

   const [searchParams] = useSearchParams();

   let incidentID = searchParams.get("id");

   const [open, setOpen] = useState(false);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

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

   const loadDiskInventory = () => {
      setIsDataLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/api/disk-inventory/`, {
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
         .then((data) => setRows(data))
         .finally(() => setIsDataLoading(false));
   };

   useEffect(() => {
      loadDiskInventory();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   React.useEffect(() => {
      if (incidentID && /\d+/.test(incidentID)) {
         const params = { id: incidentID };
         loadDiskInventoryFullDetails(params, null, null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [incidentID]);

   const loadDiskInventoryFullDetails = (params, muiEvent, details) => {
      console.log("loading " + params.id);
      setCurrentID(params.id);
      fetch(
         `${process.env.REACT_APP_API_URL}/api/disk-inventory/${params.id}/`,
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
                  }
               });
            }
         })
         .then((data) => data.json())
         .then((json) => {
            setDiskInventoryFullDetail(json.smartctl);
            setDateCreated(json.dateCreated);
            setJira(json.jira);
            setServer(json.server);
            setDiskSerialNumber(json.diskSerialNumber);
            navigate(
               `${routes.disk_inventory.key}?id=${encodeURIComponent(
                  params.id
               )}`
            );
         });
   };

   const handleDelete = () => {
      console.log("click delete");
      const deleteMethod = {
         method: "DELETE",
         headers: { "x-access-token": localStorage.getItem("bearerToken") },
      };
      fetch(
         `${process.env.REACT_APP_API_URL}/api/disk-inventory/${selectedIDS}/delete`,
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
                  }
               });
            }
         })
         .then(() => loadDiskInventory());

      console.log(selectedIDS);
   };

   const handleSave = () => {
      console.log("click save " + currentID);
      console.log("saving " + diskInventoryFullDetail);

      const data = {
         id: currentID,
         dateCreated: dateCreated,
         jira: jira,
         server: server,
         diskSerialNumber: diskSerialNumber,
         smartctl: diskInventoryFullDetail,
      };
      fetch(
         `${process.env.REACT_APP_API_URL}/api/disk-inventory/${currentID}/update`,
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
                  }
               });
            }
         })
         .then((res) => {
            loadDiskInventory();
         });
   };

   function PopUpForm() {
      let aDate = new Date();
      const [dateCreated, setDateCreated] = useState(aDate.toISOString());
      const [jira, setJira] = useState("");
      const [server, setServer] = useState("");
      const [diskSerialNumber, setDiskSerialNumber] = useState("");
      const [smartctl, setSmartctl] = useState("");

      const handleAddNew = () => {
         console.log("click add new");
         // workaround, textfield of type datetime-local does not have masking, so have to do this workaround
         let newDate = dateCreated + ":00.000Z";
         const data = {
            dateCreated: newDate,
            jira: jira,
            server: server,
            diskSerialNumber: diskSerialNumber,
            smartctl: smartctl,
         };
         fetch(`${process.env.REACT_APP_API_URL}/api/disk-inventory/`, {
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
                     }
                  });
               }
            })
            .then((res) => {
               //console.log("Request complete! response:", res);
               setOpen(false);
            })
            .then((res) => {
               loadDiskInventory();
            });
      };

      return (
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add new incident</DialogTitle>
            <DialogContent>
               <TextField
                  autoFocus
                  id="dateCreated"
                  name="dateCreated"
                  label="Date"
                  type="datetime-local"
                  value={dateCreated}
                  fullWidth
                  onChange={(e) => setDateCreated(e.target.value)}
                  variant="standard"
                  InputLabelProps={{
                     shrink: true,
                  }}
               />
               <TextField
                  id="jira"
                  name="jira"
                  label="Jira"
                  value={jira}
                  onChange={(e) => setJira(e.target.value)}
                  fullWidth
                  variant="standard"
               />
               <TextField
                  id="server"
                  name="server"
                  label="Server"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  fullWidth
                  variant="standard"
               />
               <TextField
                  id="diskSerialNumber"
                  name="diskSerialNumber"
                  label="Disk Serial Number"
                  value={diskSerialNumber}
                  onChange={(e) => setDiskSerialNumber(e.target.value)}
                  fullWidth
                  variant="standard"
               />
               <TextField
                  id="smarctl"
                  name="smartctl"
                  label="Smartctl"
                  multiline
                  value={smartctl}
                  onChange={(e) => setSmartctl(e.target.value)}
                  maxRows={10}
                  fullWidth
                  variant="standard"
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button
                  disabled={
                     dateCreated.length === 0 ||
                     jira.length === 0 ||
                     server.length === 0 ||
                     diskSerialNumber.length === 0 ||
                     smartctl.length === 0
                  }
                  onClick={handleAddNew}
               >
                  Save
               </Button>
            </DialogActions>
         </Dialog>
      );
   }

   const getRowsID = (selectionModel, details) => {
      //console.log(selectionModel);
      //console.log(details);
      setSelectedIDS(selectionModel);
   };

   function CustomToolbar(props) {
      return (
         <GridToolbarContainer>
            <GridToolbarFilterButton />
         </GridToolbarContainer>
      );
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
         <PopUpForm />
         <Grid item xs={4}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
               <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  color="success"
                  onClick={handleOpen}
               >
                  New
               </Button>
               <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="error"
                  disabled={selectedIDS.length === 0}
                  onClick={handleDelete}
               >
                  Delete
               </Button>
            </Stack>
            <div style={{ height: 700, width: "100%", marginTop: 5 }}>
               <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  onRowClick={loadDiskInventoryFullDetails}
                  onSelectionModelChange={getRowsID}
                  components={{
                     Toolbar: CustomToolbar,
                     LoadingOverlay: LinearProgress,
                  }}
                  loading={isDataLoading}
               />
            </div>
         </Grid>
         <Grid item xs={8}>
            <Stack direction="row" spacing={2}>
               <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  color="success"
                  onClick={handleSave}
                  disabled={currentID.length === 0}
               >
                  Save
               </Button>
            </Stack>
            <TextField
               autoFocus
               id="dateCreated"
               name="dateCreated"
               label="Date"
               placeholder="example value : 2022-07-26 13:25:34"
               value={dateCreated}
               onChange={(e) => setDateCreated(e.target.value)}
               fullWidth
               variant="standard"
            />
            <TextField
               id="jira"
               name="jira"
               label="Jira"
               value={jira}
               onChange={(e) => setJira(e.target.value)}
               fullWidth
               variant="standard"
            />
            <TextField
               id="server"
               name="server"
               label="Server"
               value={server}
               onChange={(e) => setServer(e.target.value)}
               fullWidth
               variant="standard"
            />
            <TextField
               id="diskSerialNumber"
               name="diskSerialNumber"
               label="Disk Serial Number"
               value={diskSerialNumber}
               onChange={(e) => setDiskSerialNumber(e.target.value)}
               fullWidth
               variant="standard"
            />
            <TextareaAutosize
               maxRows={10}
               minRows={30}
               aria-label="click on the left row"
               placeholder="click on the left row"
               value={diskInventoryFullDetail}
               onChange={(e) => setDiskInventoryFullDetail(e.target.value)}
               style={{ width: "100%", marginTop: 5, height: 510 }}
            />
         </Grid>
      </>
   );
};

export default DiskInventoryComponent;
