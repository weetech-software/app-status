import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import BasicModal from "../components/Modal";
import Breadcrumb from "../components/Breadcrumb";
import { ChartLine } from "../components/dashboard_internal/Charts";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../context/UserContext";
import { routes } from "../core/config";

const initialState = {
   period: "hourly",
   filter: "all",
   monScripts: [
      {
         monscript: "",
         description: "",
      },
   ],
   servers: [],
};

export default function Servers() {


}
