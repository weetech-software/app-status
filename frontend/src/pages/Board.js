import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import BoardComponent from "../components/Board";

const Board = () => {
   return (
     <Paper elevation={6} sx={{m:2, p:1}}>
         <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
               <Typography variant="h3" gutterBottom component="div">
                  Board
               </Typography>
            </Grid>
            <Grid item xs={12}>
               <BoardComponent />
            </Grid>
         </Grid>
     </Paper>
   );
};

export default Board;

