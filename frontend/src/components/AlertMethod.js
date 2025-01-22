import React, { useState, useEffect } from "react";
import {
   GridRowModes,
   DataGrid,
   GridToolbarContainer,
   GridActionsCellItem,
   GridRowEditStopReasons,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";
import { routes } from "../core/config";

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EditToolbar(props) {
   const { setTableData, setRowModesModel } = props;

   const handleClick = () => {
      const id = Date.now();
      setTableData((oldRows) => [
         ...oldRows,
         { id, name: "", configuration: "", isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
         ...oldModel,
         [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
   };

   return (
      <GridToolbarContainer>
         <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
            Add
         </Button>
      </GridToolbarContainer>
   );
}

const AlertMethodComponent = () => {
   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const [tableData, setTableData] = useState([]);
   const [isDataLoading, setIsDataLoading] = useState(false);

   const [rowModesModel, setRowModesModel] = React.useState({});

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

   const columns = [
      {
         field: "id",
         headerName: "ID",
         width: 10,
         hideable: false,
         editable: false,
      },
      { field: "name", headerName: "Name", width: 200, editable: true },
      {
         field: "configuration",
         headerName: "Configuration",
         //valueFormatter: ({ value }) => "***",
         editable: true,
         flex: 1,
      },
      {
         field: "actions",
         type: "actions",
         headerName: "Actions",
         width: 100,
         cellClassName: "actions",
         getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
               return [
                  <GridActionsCellItem
                     icon={<SaveIcon />}
                     label="Save"
                     sx={{
                        color: "primary.main",
                     }}
                     onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                     icon={<CancelIcon />}
                     label="Cancel"
                     className="textPrimary"
                     onClick={handleCancelClick(id)}
                     color="inherit"
                  />,
               ];
            }

            return [
               <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
               />,
               <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
               />,
            ];
         },
      },
   ];

   const handleRowEditStart = (params, event) => {
      event.defaultMuiPrevented = true;
   };

   const handleRowEditStop = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
         event.defaultMuiPrevented = true;
      }
   };

   const handleEditClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
   };

   const handleSaveClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
   };

   const handleDeleteClick = (id) => () => {
      fetch(`${process.env.REACT_APP_API_URL}/api/alert-method/${id}/delete`, {
         method: "DELETE",
         headers: {
            "x-access-token": localStorage.getItem("bearerToken"),
         },
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
         .finally(() => loadAllAlertMethods());
   };

   const handleCancelClick = (id) => () => {
      setRowModesModel({
         ...rowModesModel,
         [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = tableData.find((row) => row.id === id);
      if (editedRow.isNew) {
         setTableData(tableData.filter((row) => row.id !== id));
      }
   };

   const processRowUpdate = (newRow) => {
      if ("isNew" in newRow && newRow) {
         const { id, ...data } = newRow;
         fetch(`${process.env.REACT_APP_API_URL}/api/alert-method/`, {
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
            .then((data) => data.json())
            .finally(() => loadAllAlertMethods());
      } else {
         const { id, ...data } = newRow;
         fetch(
            `${process.env.REACT_APP_API_URL}/api/alert-method/${id}/update`,
            {
               method: "POST",
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
            .then((data) => data.json())
            .finally(() => loadAllAlertMethods());
      }
      const updatedRow = { ...newRow, isNew: false };
      //setTableData(tableData.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
   };

   const loadAllAlertMethods = () => {
      setIsDataLoading(true);
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
         .then((data) => setTableData(data))
         .finally(() => setIsDataLoading(false));
   };

   useEffect(() => {
      loadAllAlertMethods();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

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
               height: 500,
               width: "100%",
               "& .actions": {
                  color: "text.secondary",
               },
               "& .textPrimary": {
                  color: "text.primary",
               },
            }}
         >
            <DataGrid
               rows={tableData}
               columns={columns}
               editMode="row"
               rowModesModel={rowModesModel}
               onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
               onRowEditStart={handleRowEditStart}
               onRowEditStop={handleRowEditStop}
               processRowUpdate={processRowUpdate}
               components={{
                  LoadingOverlay: LinearProgress,
                  Toolbar: EditToolbar,
               }}
               componentsProps={{
                  toolbar: { setTableData, setRowModesModel },
               }}
               loading={isDataLoading}
               experimentalFeatures={{ newEditingApi: true }}
            />
         </Box>
      </>
   );
};

export default AlertMethodComponent;
