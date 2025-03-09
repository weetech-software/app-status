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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";
import { routes } from "../core/config";

const columns = [
   { field: "id", headerName: "ID", width: 10, hideable: false },
   { field: "name", headerName: "Name", width: 200 },

   {
      field: "email",
      headerName: "E-mail",
      hideable: false,
      width: 200,
   },
   {
      field: "password",
      headerName: "Password",
      valueFormatter: ({ value }) => "***",
   },
   { field: "role", headerName: "Role" },
];

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomizedToolbar() {
   return (
      <Box
         sx={{
            p: 1.5,
         }}
      >
         <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="baseline"
            spacing={0}
         >
            <GridToolbarColumnsButton />
            <GridToolbarQuickFilter
               sx={{
                  border: "1px solid #E7EBF0",
                  "& .MuiInput-underline:before": {
                     borderBottom: "none",
                  },
               }}
            />
         </Stack>
      </Box>
   );
}

const UsersComponent = () => {
   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const [tableData, setTableData] = useState([]);
   const [isDataLoading, setIsDataLoading] = useState(false);

   const [frmId, setFrmId] = useState();
   const [frmEmail, setFrmEmail] = useState();
   const [frmPassword, setFrmPassword] = useState();
   const [frmName, setFrmName] = useState();
   const [frmRole, setFrmRole] = useState();

   const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
      password: false,
      role: false,
   });

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

   const loadAllUsers = () => {
      setIsDataLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/api/users/`, {
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
                  }
               });
            }
         })
         .then((data) => data.json())
         .then((data) => setTableData(data))
         .finally(() => setIsDataLoading(false));
   };

   useEffect(() => {
      loadAllUsers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function getUser(row_id, configurations) {
      for (const config of configurations) {
         if (config.id === row_id) {
            return config;
         }
      }
      return null;
   }

   const loadUserProfile = (params, muiEvent, details) => {
      console.log("loading " + params.id);
      let user = getUser(params.id, tableData);

      setFrmId(user.id);
      setFrmEmail(user.email);
      setFrmPassword(user.password);
      setFrmName(user.name);
      setFrmRole(user.role);
   };

   const resetForm = () => {
      setFrmId("");
      setFrmEmail("");
      setFrmPassword("");
      setFrmName("");
      setFrmRole("");
   };

   const handleNew = () => {
      console.log("handle new");
      resetForm();
   };

   const handleSave = () => {
      console.log("handle save");
      if (frmId === "") {
         console.log("add new");
         const data = {
            email: frmEmail,
            password: frmPassword,
            name: frmName,
            role: frmRole,
         };
         fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
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
               resetForm();
            })
            .then((res) => {
               loadAllUsers();
            });
      } else {
         console.log("update " + frmId);
         const data = {
            email: frmEmail,
            password: frmPassword,
            name: frmName,
            role: frmRole,
         };
         fetch(`${process.env.REACT_APP_API_URL}/api/users/${frmId}/update`, {
            method: "PUT",
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
               loadAllUsers();
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
         `${process.env.REACT_APP_API_URL}/api/users/${frmId}/delete`,
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
         .then(() => setOpenDeleteConfirm(false))
         .then(() => resetForm())
         .then(() => loadAllUsers());
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
               rows={tableData}
               columns={columns}
               pageSize={15}
               sx={{
                  height: 674,
                  width: "100%",
                  "& .MuiDataGrid-columnSeparator": {
                     visibility: "hidden",
                  },
               }}
               components={{
                  LoadingOverlay: LinearProgress,
                  Toolbar: CustomizedToolbar,
               }}
               loading={isDataLoading}
               columnVisibilityModel={columnVisibilityModel}
               onColumnVisibilityModelChange={(newModel) =>
                  setColumnVisibilityModel(newModel)
               }
               onRowClick={loadUserProfile}
               checkboxSelection={false}
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
                  id="email"
                  name="email"
                  label="E-mail"
                  value={frmEmail}
                  onChange={(e) => setFrmEmail(e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={frmPassword}
                  onChange={(e) => setFrmPassword(e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  required
                  id="name"
                  name="name"
                  label="Name"
                  value={frmName}
                  onChange={(e) => setFrmName(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="user name"
               />
               <TextField
                  required
                  id="role"
                  name="role"
                  label="Role"
                  value={frmRole}
                  onChange={(e) => setFrmRole(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="user role"
               />
            </Box>
         </Grid>
      </>
   );
};

export default UsersComponent;
