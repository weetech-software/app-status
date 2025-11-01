import React from "react";
import Contextualizer from "../context/Contextualizer";
import ProvidedServices from "../context/ProvidedServices";

const FirewallServiceContext = Contextualizer.createContext(
   ProvidedServices.FirewallService
);
export const useFirewallService = () =>
   Contextualizer.useContext(ProvidedServices.FirewallService);

const FirewallService = ({ children }) => {
   // get    getAll          /api/firewall/
   const firewallService = {
      async getAll() {
         const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/firewall/`,
            {
               headers: {
                  "x-access-token": localStorage.getItem("bearerToken"),
               },
            }
         );
         if (response.ok) {
            const resultJson = await response.json();
            return new Promise((resolve) => {
               //resolve(results);
               resolve(resultJson);
            });
         } else {
            await response.json().then((json) => {
               if (json.message === "Token is expired") {
                  const navigateState = {
                     state: { message: "session expired" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               } else if (json.message === "not authorize to access") {
                  const navigateState = {
                     state: { message: "not authorize to access" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               } else {
                  const navigateState = {
                     state: { message: "unauth" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               }
            });
         }
      },

      // get    get             /api/firewall/blblablaba
      async get(id) {
         const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/firewall/${id}/`,
            {
               headers: {
                  "x-access-token": localStorage.getItem("bearerToken"),
                  "content-type": "application/json",
               },
            }
         );
         if (response.ok) {
            const resultJson = await response.json();
            return new Promise((resolve) => {
               resolve(resultJson);
            });
         } else {
            await response.json().then((json) => {
               if (json.message === "Token is expired") {
                  const navigateState = {
                     state: { message: "session expired" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               } else if (json.message === "not authorize to access") {
                  const navigateState = {
                     state: { message: "not authorize to access" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               } else {
                  const navigateState = {
                     state: { message: "unauth" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               }
            });
         }
      },

     // delete delete /api/firewall/blblablaba/delete
     async delete(ids) {
         const repsonse = await fetch(
             `${process.env.REACT_APP_API_URL}/api/firewall/${ids}/delete`,
             {
               method: "DELETE",
               headers: {
                  "x-access-token": localStorage.getItem("bearerToken"),
               },
             }
         );
         if (response.ok) {
             return new Promise((resolve) => {
                  resolve(true);
             });
         } else {
             await response.json().then((json) => {
                if (json.message === "Token is expired") {
                   const navigateState = {
                      state: { message: "session expired" },
                   };
                } else if (json.message === "not authorize to access") {
                   const navigateState = {
                      state: { mesage: "not authorize to access" },
                   };
                   return new Promise((_, reject) => reject(navigateState));
                } else {
                   const navigateState = {
                      state: { message: "unauth" },
                   };
                   return new Promise((_, reject) => reject(navigateState));
                }
             });
         }
     },

     // post create  /api/firewall/
     async create(data) {
         const response = await fetch(
              `${process.env.REACT_APP_API_URL}/api/firewall`,
              {
                 method: "POST",
                 headers: {
                    "x-access-token": localStorage.getItem("bearerToken"),
                    "content-type": "application/json",
                 },
                 body: JSON.stringify(data),
              }
         );
         if (response.ok) {
             return new Promise((resolve) => {
                resolve(true);
             })
         } else {
             await response.json().then((json) => {
                if (json.message === "Token is expired") {
                    const navigateState = {
                       state: { message: "session expired" },
                    };
                    return new Promise((_, reject) => reject(navigateState));
                } else if (json.message === "not authorized to access") {
                    const navigateState = {
                       state: { message: "not authorize to access" },
                    };
                    return new Promise((_, reject) => reject(navigateState));
                } else {
                    const navigateState = {
                       state: { message: "unauth" },
                    };
                    return new Promise((_, reject) => reject(navigateState));
                }
             });
         }
     },

  }
}
