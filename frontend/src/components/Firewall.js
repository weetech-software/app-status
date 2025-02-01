import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";

import Stack from "@mui/material/Stack";
import TextareaAutosize from "@mui/base/TextareaAutosize";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//import Modal from "@mui/material/Modal";
//import InputLabel from "@mui/material/InputLabel";
//import Input from "@mui/material/Input";
//import FormControl from "@mui/material/FormControl";
//import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";

import { useFirewallService } from "../service/FirewallService";
import { routes } from "../core/config";

const columns = [
   { field: "id", headerName: "ID", minWidth: 20, flex: 1 },
   { field: "filename", headerName: "Filename", minWidth: 130, flex: 1 },
];

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

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FirewallComponent = () => {
   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const [selectedIDS, setSelectedIDS] = React.useState([]);
   const [currentID, setCurrentID] = React.useState([]);

   const [fwFiles, setFwFiles] = useState([]);

   const [fwOldContent, setFwOldContent] = useState("");
   const [fwContent, setFwContent] = useState("");

   const [open, setOpen] = useState(false);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   const [openDouble, setOpenDouble] = useState(false);
   const handleOpenDouble = () => setOpenDouble(true);
   const handleCloseDouble = () => setOpenDouble(false);

   const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
   const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
   const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

   const [isLoading, setIsLoading] = useState(false);
   const [isFwFilesLoading, setIsFwFilesLoading] = useState(false);

   const firewallService = useFirewallService();

   const [searchParams] = useSearchParams();

   let fwID = searchParams.get("id");

   /*
   const [isSaved, setIsSaved] = React.useState(false);

   const handleSavedClose = (
      event?: React.SyntheticEvent | Event,
      reason?: string
   ) => {
      if (reason === "clickaway") {
         return;
      }

      setIsSaved(false);
   };
   */

   // severity : error, warning, info, success
   const [openSnackbar, setOpenSnackbar] = React.useState({
      open: false,
      message: "",
      severity: "info",
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

   const handleError = (err) => {
      // if session timeout, need to redirect to login page
      console.log(err.state.message);
      if (err.state.message === "session expired") {
         const navigateState = {
            state: { message: "session expired" },
         };
         signOut(userDispatch, navigate, routes.login.key, navigateState);
      } else if (err.state.message === "not authorize to access") {
         setOpenSnackbar((prevState) => ({
            message: "not authorize",
            open: true,
            severity: "error",
         }));
      } else {
         const navigateState = {
            state: { message: err.state.message },
         };
         signOut(userDispatch, navigate, routes.login.key, navigateState);
      }
   };

   const loadFireWallFiles = () => {
      if (firewallService !== undefined) {
         setIsFwFilesLoading(true);
         firewallService
            .getAll()
            .then((result) => {
               setFwFiles(result);
            })
            .catch((err) => {
               handleError(err);
               setFwFiles([]);
            })
            .finally(() => setIsFwFilesLoading(false));
      } else {
         console.log("undefined firewallservice");
      }
   };

   useEffect(() => {
      loadFireWallFiles();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   React.useEffect(() => {
      if (fwID) {
         const params = { id: fwID };
         loadFirewallConfigFile(params, null, null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fwID]);

   const loadFirewallConfigFile = (params, muiEvent, details) => {
      if (firewallService !== undefined) {
         setIsLoading(true);
         console.log("loading " + params.id);
         setCurrentID(params.id);
         firewallService
            .get(params.id)
            .then((json) => {
               setFwContent(json.content);
               setFwOldContent(json.content);
               navigate(
                  `${routes.defense_firewall.key}?id=${encodeURIComponent(params.id)}`
               );
            })
            .catch((err) => {
               handleError(err);
               setFwContent("");
               setFwOldContent("");
            })
            .finally(() => setIsLoading(false));
      } else {
         console.log("undefined firewallservice");
      }
   };

   const handleDelete = () => {
      if (firewallService !== undefined) {
         console.log("click delete");
         firewallService
            .delete(selectedIDS)
            .then(() => setOpenDeleteConfirm(false))
            .then(() => loadFireWallFiles())
            .catch((err) => {
               handleError(err);
            });
         console.log(selectedIDS);
      } else {
         console.log("undefined firewallservice");
      }
   };

   const handleSave = () => {
      if (firewallService !== undefined) {
         console.log("click save " + currentID);
         console.log("saving " + fwContent);

         firewallService
            .update(currentID, fwContent)
            .then(() => {
               setOpenSnackbar((prevState) => ({
                  message: "Saved!",
                  open: true,
                  severity: "success",
               }));
               setFwContent("");
               setFwFiles([]);
            })
            .then((res) => {
               loadFireWallFiles();
            })
            .catch((err) => {
               handleError(err);
            });
      } else {
         console.log("undefined firewallservice");
      }
   };

   function FormDeleteDialog() {
      return (
         <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
            <DialogTitle>
               Are you sure you want to proceed to delete?
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Remove {selectedIDS.join(", ")}
               </DialogContentText>
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

   function SingleForm() {
      const [filename, setFilename] = useState("");
      const [content, setContent] = useState("");

      const handleAddNew = () => {
         if (firewallService !== undefined) {
            console.log("click add new");
            const data = { filename: filename, content: content };
            firewallService
               .create(data)
               .then((res) => {
                  setOpen(false);
               })
               .then((res) => {
                  loadFireWallFiles();
               })
               .catch((err) => {
                  handleError(err);
               });
         } else {
            console.log("undefined firewallservice");
         }
      };

      return (
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add new firewall config file</DialogTitle>
            <DialogContent>
               <TextField
                  autoFocus
                  id="filename"
                  name="filename"
                  label="Filename"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  fullWidth
                  variant="standard"
               />
               <TextField
                  id="content"
                  name="content"
                  label="Content"
                  multiline
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxRows={10}
                  fullWidth
                  variant="standard"
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button
                  disabled={filename.length === 0 || content.length === 0}
                  onClick={handleAddNew}
               >
                  Save
               </Button>
            </DialogActions>
         </Dialog>
      );
   }

   function DoubleForm() {
      const [filename1, setFilename1] = useState("");
      const [content1, setContent1] = useState("");
      const [filename2, setFilename2] = useState("");
      const [content2, setContent2] = useState("");

      const handleAddNew = () => {
         if (firewallService !== undefined) {
            console.log("click add new double");
            const data = {
               filename: filename1,
               content: content1,
               filename1: filename2,
               content1: content2,
            };
            firewallService
               .create(data)
               .then((res) => {
                  setOpenDouble(false);
               })
               .then((res) => {
                  loadFireWallFiles();
               })
               .catch((err) => {
                  handleError(err);
               });
         } else {
            console.log("undefined firewallservice");
         }
      };

      return (
         <Dialog open={openDouble} onClose={handleCloseDouble}>
            <DialogTitle>Add double firewall config file</DialogTitle>
            <DialogContent>
               <Grid container spacing={1}>
                  <Grid item xs={4}>
                     <TextField
                        autoFocus
                        id="filename1"
                        name="filename1"
                        label="Filename1"
                        value={filename1}
                        onChange={(e) => setFilename1(e.target.value)}
                        fullWidth
                        variant="standard"
                     />
                     <TextField
                        id="content1"
                        name="content1"
                        label="Content1"
                        multiline
                        value={content1}
                        onChange={(e) => setContent1(e.target.value)}
                        maxRows={10}
                        fullWidth
                        variant="standard"
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <TextField
                        autoFocus
                        id="filename2"
                        name="filename2"
                        label="Filename2"
                        value={filename2}
                        onChange={(e) => setFilename2(e.target.value)}
                        fullWidth
                        variant="standard"
                     />
                     <TextField
                        id="content2"
                        name="content2"
                        label="Content2"
                        multiline
                        value={content2}
                        onChange={(e) => setContent2(e.target.value)}
                        maxRows={10}
                        fullWidth
                        variant="standard"
                     />
                  </Grid>
               </Grid>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCloseDouble}>Cancel</Button>
               <Button
                  disabled={
                     filename1.length === 0 ||
                     content1.length === 0 ||
                     filename2.length === 0 ||
                     content2.length === 0
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

   function QuickSearchToolbar() {
      return (
         <Box
            sx={{
               p: 0.5,
               pb: 0,
            }}
         >
            <GridToolbarQuickFilter />
         </Box>
      );
   }
   /*
         <Snackbar
            open={isSaved}
            autoHideDuration={2500}
            onClose={handleSavedClose}
            message="Saved!"
         ></Snackbar>
*/
   return (
      <>
         <Snackbar
            open={openSnackbar.open}
            autoHideDuration={
               openSnackbar.severity === "error" ||
               openSnackbar.severity === "warning"
                  ? 6500
                  : 2500
            }
            onClose={handleSavedClose}
         >
            <Alert
               onClose={handleSavedClose}
               severity={openSnackbar.severity}
               sx={{ width: "100%" }}
            >
               {openSnackbar.message}
            </Alert>
         </Snackbar>
         <FormDeleteDialog />
         <SingleForm />
         <DoubleForm />
         <Grid item xs={4}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
               <Button
                  variant="contained"
                  startIcon={<KeyboardArrowRightIcon />}
                  color="success"
                  onClick={handleOpen}
               >
                  One
               </Button>
               <Button
                  variant="contained"
                  startIcon={<KeyboardDoubleArrowRightIcon />}
                  color="success"
                  onClick={handleOpenDouble}
               >
                  Two
               </Button>
               <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="error"
                  disabled={selectedIDS.length === 0}
                  onClick={handleDeleteConfirmOpen}
               >
                  Delete
               </Button>
            </Stack>
            <div style={{ height: 700, width: "100%", marginTop: 5 }}>
               <DataGrid
                  rows={fwFiles}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                  onRowClick={loadFirewallConfigFile}
                  onSelectionModelChange={getRowsID}
                  components={{ Toolbar: QuickSearchToolbar }}
                  loading={isFwFilesLoading}
               />
            </div>
         </Grid>
         <Grid item xs={8}>
            <Stack direction="row" spacing={1}>
               <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  color="success"
                  onClick={handleSave}
                  disabled={
                     currentID.length === 0 ||
                     isLoading ||
                     fwOldContent === fwContent
                  }
               >
                  Save
               </Button>
               {isLoading ? (
                  <CircularProgress size={30} />
               ) : currentID.length !== 0 ? (
                  <Typography
                     variant="body2"
                     sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                     loaded {currentID}
                  </Typography>
               ) : (
                  ""
               )}
            </Stack>
            <TextareaAutosize
               minRows={10}
               aria-label="click on the left row"
               placeholder="click on the left row"
               value={fwContent}
               onChange={(e) => setFwContent(e.target.value)}
               style={{ width: "100%", marginTop: 5, height: 700 }}
            />
         </Grid>
      </>
   );
};

export default FirewallComponent;
