import FirewallService from "./FirewallService";

const GlobalServices = ({ children }) => {
   return (
      <>
         <FirewallService>{children}</FirewallService>
      </>
   );
};

export default GlobalServices;
