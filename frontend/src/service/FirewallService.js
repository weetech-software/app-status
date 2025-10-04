import React from "react";
import Contextualizer from "../context/Contextualizer";
import ProvidedServices from "../context/ProvidedServices";

const FirewallServiceContext = Contextualizer.createContext(
   ProvidedServices.FirewallService
);
export const useFirewallService = () =>
   Contextualizer.useContext(ProvidedServices.FirewallService);

