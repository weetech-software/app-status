import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextareaAutosize from "@mui/base/TextareaAutosize";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";
import { routes } from "../core/config";

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BoardComponent = () => {
   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const [isEdit, setIsEdit] = useState(true);
   const [content, setContent] = useState("");

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

   const loadBoard = () => {
      fetch(`${process.env.REACT_APP_API_URL}/api/board/`, {
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
         // data[0] because only 1 clipboard as a simple beginning
         .then((data) => setContent(data[0].content));
   };

   useEffect(() => {
      loadBoard();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleSave = () => {
      const data = {
         content: content,
      };
      // just 1 clip board for now, simple beginning
      fetch(`${process.env.REACT_APP_API_URL}/api/board/1/update`, {
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
            setIsEdit(true);
         })
         .then((res) => {
            loadBoard();
         });
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
         <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
               {isEdit ? (
                  <Button
                     variant="outlined"
                     startIcon={<EditIcon />}
                     color="success"
                     onClick={() => setIsEdit(false)}
                  >
                     Edit
                  </Button>
               ) : (
                  <Button
                     variant="contained"
                     startIcon={<SaveIcon />}
                     color="success"
                     onClick={() => handleSave()}
                  >
                     Save
                  </Button>
               )}
            </Stack>
         </Grid>
         <Grid item xs={12}>
            <TextareaAutosize
               maxRows={10}
               minRows={30}
               disabled={isEdit ? true : undefined}
               aria-label="click on the left row"
               placeholder="click on the left row"
               value={content}
               onChange={(e) => setContent(e.target.value)}
               style={{
                  width: "100%",
                  marginTop: 20,
                  marginBottom: 20,
                  height: 510,
                  resize: "none",
               }}
            />
         </Grid>
      </>
   );
};

export default BoardComponent;
