import React from "react";

import axios from "axios";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
   switch (action.type) {
      case "LOGIN_SUCCESS":
         return { ...state, isAuthenticated: true };
      case "SIGN_OUT_SUCCESS":
         return { ...state, isAuthenticated: false };
      default: {
         throw new Error(`Unhandled action type: ${action.type}`);
      }
   }
}

function UserProvider({ children }) {
   var [state, dispatch] = React.useReducer(userReducer, {
      isAuthenticated:
         !!localStorage.getItem("id_token") &&
         !!localStorage.getItem("bearerToken"),
   });

   return (
      <UserStateContext.Provider value={state}>
         <UserDispatchContext.Provider value={dispatch}>
            {children}
         </UserDispatchContext.Provider>
      </UserStateContext.Provider>
   );
}

