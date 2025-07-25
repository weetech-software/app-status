import React from "react";
import ProvidedServices from "./ProvidedServices";

const contexts = new Map();

const Contextualizer = {

   createContext: (service) => {
      const context = React.createContext();
      contexts.set(service, context);
      return context;
   },

};

