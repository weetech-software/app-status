import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AccessTime } from "@mui/icons-material";
//import Rating from "@mui/material/Rating";
import { createTheme, ThemeProvider } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { routes } from "../core/config";

const theme = createTheme({
   components: {
      MuiTypography: {
         variants: [
            {
               props: {
                  variant: "body2",
               },
               style: {
                  fontSize: 11,
               },
            },
            {
               props: {
                  variant: "body3",
               },
               style: {
                  fontSize: 9,
               },
            },
         ],
      },
   },
});

const ServerCard = ({ node }) => {
   return (
      <Grid item xs={3}>
         <ThemeProvider theme={theme}>
            <Link
               to={`${routes.dashboard_internal.key}/server/${node.name}`}
               style={{ textDecoration: "none" }}
            >
               <Paper elevation={3}>
                  {/* <img className="img" src={node.image} alt=""/> */}
                  <Box paddingX={1}>
                     <Typography
                        variant="subtitle1"
                        components="h2"
                        noWrap={true}
                     >
                        {node.name}
                     </Typography>
                     <Box
                        sx={{
                           display: "flex",
                           alignItems: "center",
                        }}
                     >
                        <AccessTime sx={{ width: 12.5 }} />
                        <Typography
                           variant="body2"
                           components="p"
                           marginLeft={0.5}
                        >
                           {node.duration} hours
                        </Typography>
                     </Box>
                     <Box
                        sx={{
                           display: "flex",
                           alignItems: "center",
                        }}
                        marginTop={3}
                     >
                        {/* <Rating name="read-only" value={node.rating} precision={0.5} readOnly size="small" /> 
	    <Typography variant="body2" components="p" marginLeft={0.5}>
               {node.rating}
            </Typography>
	    <Typography variant="body3" components="p" marginLeft={1.5}>
	      ({node.numberOfReviews} reviews)
            </Typography> */}
                     </Box>
                     <Box marginTop={1}>
                        <Alert severity="success" sx={{ overflow: "hidden" }}>
                           {node.status}
                        </Alert>
                     </Box>
                  </Box>
               </Paper>
            </Link>
         </ThemeProvider>
      </Grid>
   );
};

export default ServerCard;
