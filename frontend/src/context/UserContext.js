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

