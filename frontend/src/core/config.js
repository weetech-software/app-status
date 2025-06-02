import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Server from "../pages/Server";
import Servers from "../pages/Servers";
import Users from "../pages/Users";
import Login from "../pages/Login";
import DashboardInternal from "../pages/DashboardInternal";
import AlertThreshold from "../pages/AlertThreshold";
import DiskInventory from "../pages/DiskInventory";
import FirewallPage from "../pages/firewall/FirewallPage";
import Board from "../pages/Board";
import AlertMethod from "../pages/AlertMethod";
import CassandraWeeklyMaintenance from "../pages/cassandra/CassandraWeeklyMaintenance";
import SynRecv from "../pages/firewall/SynRecv";

import { useUserState } from "../context/UserContext";

// https://github.com/jasonwee/MyReactJS/blob/main/react-admin-master/src/routes/config.ts
export const menus: {} = {
   menu_monitoring: [
      { key: "/", title: "Dashboard", icon: "Public", element: "Dashboard" },
      {
         key: "/login/dashboard",
         title: "Dashboard Internal",
         icon: "Lock",
         element: "DashboardInternal",
         subs: [
            {
               key: "/login/dashboard/cassandra/cassandra-weekly-maintenance",
               title: "cassandra weekly maintenance",
               icon: "GroupWork",
               element: "Cassandra",
            },
         ],
      },
      {
         key: "/login/alert_threshold",
         title: "Alert Threshold",
         icon: "DataThresholding",
         element: "AlertThreshold",
      },
      {
         key: "/login/firewall",
         title: "Defense",
         icon: "Security",
         element: "FirewallPage",
         subs: [
            {
               key: "/login/firewall",
               title: "Advanced Policy Firewall",
               icon: "Security",
               element: "FirewallPage",
            },
            {
               key: "/login/firewall/syn-recv",
               title: "Syn recv",
               icon: "CallReceived",
               element: "SynRecv",
            },
         ],
      },
      {
         key: "/login/disk_inventory",
         title: "Disk Inventory",
         icon: "Storage",
         element: "DiskInventory",
      },
      {
         key: "/login/board",
         title: "Board",
         icon: "AssignmentTurnedIn",
         element: "Board",
      },
   ],
   menu_management: [
      {
         key: "/login/users",
         title: "Users",
         icon: "ManageAccounts",
         element: "Users",
      },
      {
         key: "/login/alert_method",
         title: "Alert Method",
         icon: "AddAlert",
         element: "AlertMethod",
      },
   ],
};

export const routes = {
   root: { key: "/", element: "Dashboard" },
   login: { key: "/ot-login", element: "Login" },
   dashboard_internal: {
      key: "/login/dashboard",
      element: "DashboardInternal",
   },
   dashboard_internal_cassandra: {
      key: "/login/dashboard/cassandra/cassandra-weekly-maintenance",
      element: "Cassandra",
   },
   alert_threshold: {
      key: "/login/alert_threshold",
      element: "AlertThreshold",
   },
   defense_firewall: { key: "/login/firewall", element: "FirewallPage" },
   defense_syn_recv: { key: "/login/firewall/syn-recv", element: "SynRecv" },
   disk_inventory: { key: "/login/disk_inventory", element: "DiskInventory" },
   board: { key: "/login/board", element: "Board" },
   users: { key: "/login/users", element: "Users" },
   alert_method: { key: "/login/alert_method", element: "AlertMethod" },
};

export const isRegisterRoute = (path, routes) => {
   for (const key in routes) {
      if (routes[key].key.startsWith(path)) return true;
   }
   return false;
};

export const AppRoutes = () => {
   var { isAuthenticated } = useUserState();

   const NoMatch = () => {
      return <p>There's nothing here: 404!</p>;
   };

   const PrivateRoute = () => {
      // If authorized, return an outlet that will render child elements
      // If not, return element that will navigate to landing/public page
      if (isAuthenticated) {
         return <Outlet />;
      } else {
         /* dont know why useLocation hook cannot use here
            it cause infinite loop when the url path has like path 3 parts 
            or query string
          */
         const fromUrl = window.location.search
            ? window.location.pathname + window.location.search
            : window.location.pathname;
         return (
            <Navigate
               to={routes.login.key}
               replace={true}
               state={{ from: fromUrl }}
            />
         );
      }
   };

   return (
      <>
         <Routes>
            <Route path="/">
               <Route index element={<Dashboard />} />
               <Route path="ot-login" element={<Login />} />
            </Route>
            <Route path="/login" element={<PrivateRoute />}>
               <Route path="dashboard" element={<DashboardInternal />} />
               <Route
                  path="dashboard/cassandra/cassandra-weekly-maintenance"
                  element={<CassandraWeeklyMaintenance />}
               />
               <Route path="dashboard/:servers" element={<Servers />} />
               <Route
                  path="dashboard/server/:server_hostname"
                  element={<Server />}
               />
               <Route path="alert_threshold/">
                  <Route path="" element={<AlertThreshold />} />
                  <Route path=":id" element={<AlertThreshold />} />
               </Route>
               <Route path="disk_inventory" element={<DiskInventory />} />
               <Route path="firewall" element={<FirewallPage />} />
               <Route path="firewall/syn-recv/">
                  <Route path="" element={<SynRecv />} />
                  <Route path=":id" element={<SynRecv />} />
               </Route>
               <Route path="board" element={<Board />} />
               <Route path="users" element={<Users />} />
               <Route path="alert_method" element={<AlertMethod />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
         </Routes>
      </>
   );
};
