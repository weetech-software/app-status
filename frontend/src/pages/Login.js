import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useUserDispatch, loginUser } from "../context/UserContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import { routes, isRegisterRoute } from "../core/config";

function Copyright(props) {
   return (
      /*
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.weetech.ch/">
        weetech.ch
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
    */
      <></>
   );
}

const theme = createTheme();

export default function Login() {
   var userDispatch = useUserDispatch();

   var [isLoading, setIsLoading] = React.useState(false);
   var [error, setError] = React.useState(null);
   const navigate = useNavigate();
   const location = useLocation();
   const [searchParams] = useSearchParams();

   const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
         email: data.get("email"),
         password: data.get("password"),
      });

      let redirectTo = routes.root.key;
      // first try from url
      let redirectPath = searchParams.get("redirect");
      if (isRegisterRoute(redirectPath, routes)) {
         redirectTo = redirectPath;
      }
      // second try from state
      if (location.state?.from) {
         redirectTo = location.state.from;
         if (isRegisterRoute(redirectPath, routes)) {
            redirectTo = redirectPath;
         }
      }

      loginUser(
         userDispatch,
         data.get("email"),
         data.get("password"),
         navigate,
         setIsLoading,
         setError,
         redirectTo
      );
   };

   return (
      <ThemeProvider theme={theme}>
         <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
               sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
               }}
            >
               <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
               </Avatar>
               <Typography component="h1" variant="h5">
                  Sign in
               </Typography>
               {location.state?.message && (
                  <Alert severity="info">{location.state.message}</Alert>
               )}
               <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
               >
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     id="email"
                     label="Email Address"
                     name="email"
                     autoComplete="email"
                     autoFocus
                  />
                  <TextField
                     margin="normal"
                     required
                     fullWidth
                     name="password"
                     label="Password"
                     type="password"
                     id="password"
                     autoComplete="current-password"
                  />
                  <FormControlLabel
                     control={<Checkbox value="remember" color="primary" />}
                     label="Remember me"
                  />
                  <Box>
                     {error ? error : ""}
                     {isLoading ? (
                        <CircularProgress />
                     ) : (
                        <Button
                           type="submit"
                           fullWidth
                           variant="contained"
                           sx={{ mt: 3, mb: 2 }}
                        >
                           Sign In
                        </Button>
                     )}
                  </Box>
                  {/*
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            */}
               </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
         </Container>
      </ThemeProvider>
   );
}
