import React from "react";
import ProvidedServices from "./ProvidedServices";

const contexts = new Map();

const Contextualizer = {

   createContext: (service) => {
      const context = React.createContext();
      contexts.set(service, context);
      return context;
   },

   useContext: (services) => {
      const context = contexts.get(services);
      if (context === undefined) {
         throw new Error(`${ProvidedServices[services]} was not created`);
      }
      const service = React.useContext(context);

      if (service === undefined) {
         throw new Error(
            `You must use ${ProvidedServices[services]} from within its service`
         );
      }
      return service;
   },


};

