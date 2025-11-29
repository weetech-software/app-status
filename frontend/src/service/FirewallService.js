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

     // post update /api/firewall/blablabla/update
     async update(id, fwContent) {
        const data = { filename: id, content: fwContent };
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/firewall/${id}/update`,
            {
               method: "PUT",
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

     // post apf-host /api/firewall/apf-host
     async apf_host(content) {
         const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/firewall/apf-host`,
            {
               method: "POST",
               headers: {
                  "x-access-token": localStorage.getItem("bearerToken"),
                  "content-type": "application/json",
               },
               body: JSON.stringify(content),
            }
         );
         if (response.ok) {
            return new Promise((resolve) => {
               resolve(true);
            });
         } else {
            response.json().then((json) => {
               if (json.message === "Token is expired") {
                  const navigateState = {
                     state: { message: "session expired" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               }
            });
            const navigateState = {
               state: { message: "unauth" },
            };
            return new Promise((_, reject) => reject(navigateState));
         }
     },

     // post sync-recv/add   /api/firewall/syn-recv/add
     async syn_recv_add(content) {
         const response = await fetch(
         `${process.env.REACT_APP_API_URL}/api/firewall/syn-recv/add`,
           {
             method: "POST",
             headers: {
               "x-access-token": localStorage.getItem("bearerToken"),
               "content-type": "application/json",
             },
             body: JSON.stringify(content),
           }
         );
         if (response.ok) {
           return new Promise((resolve) => {
                resolve(true);
           });
         } else {
           response.json().then((json) => {
              if (json.message === "Token is expired") {
                  const navigateState = {
                      state: { message: "session expired" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
              }
           });
           const navigateState = {
              state: { message: "unauth" },
           };
           return new Promise((_, reject) => reject(navigateState));
         }
     },

     // get sync-recv/read /api/firewall/sync-recv/read
     async syn_recv_read(content) {
         const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/firewall/syn-recv/read`,
            {
               method: "GET",
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
            response.json().then((json) => {
               if (json.message === "Token is expired") {
                  const navigateState = {
                     state: { message: "session expired" },
                  };
                  return new Promise((_, reject) => reject(navigateState));
               }
            });
            const navigateState = {
               state: { message: "unauth" },
            };
            return new Promise((_, reject) => reject(navigateState));
         }
     },

  }
}
