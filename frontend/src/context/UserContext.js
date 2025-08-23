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

function loginUser(
   dispatch,
   login,
   password,
   navigate,
   setIsLoading,
   setError,
   redirectTo
) {
   setError(false);
   setIsLoading(true);

   if (!!login && !!password) {
      setTimeout(() => {
         /*
         const user = JSON.stringify({
            email: login,
            password: password,
         });
         */
         var bodyFormData = new FormData();
         bodyFormData.append("email", login);
         bodyFormData.append("password", password);

         /*
         const config = {
            headers: {
               "Content-Type": "application/json",
            },
         };
         */
         const config = {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         };
         //console.log(user)

         axios
            .post(
               `${process.env.REACT_APP_API_URL}/login`,
               bodyFormData,
               config
            )
            .then((res) => {
               console.log(res.data);
               localStorage.setItem("id_token", res.data.token);
               localStorage.setItem("bearerToken", res.data.token);
               dispatch({ type: "LOGIN_SUCCESS" });
               setError(null);
               setIsLoading(false);
               console.log(res);

               navigate(redirectTo);
            })
            .catch((err) => {
               setError(true);
               setIsLoading(false);
            });
      }, 2000);
   } else {
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
   }
}

function signOut(dispatch, navigate, navigatePath, navigateState) {
   localStorage.removeItem("id_token");
   localStorage.removeItem("bearerToken");
   dispatch({ type: "SIGN_OUT_SUCCESS" });
   navigate(navigatePath, navigateState);
}

function useUserDispatch() {
   var context = React.useContext(UserDispatchContext);
   if (context === undefined) {
      throw new Error("useUserDispatch must be used within a UserProvider");
   }
   return context;
}

function useUserState() {
   var context = React.useContext(UserStateContext);
   if (context === undefined) {
      throw new Error("useUserState must be used within a UserProvider");
   }
   return context;
}

export { UserProvider, useUserDispatch, useUserState, loginUser, signOut };
