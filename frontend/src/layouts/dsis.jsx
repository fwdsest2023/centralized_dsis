import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  ErrorNotification
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function dsis() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [brndName, setBrndName] = useState("DVS Distribution")

  // Methods and Functions
  const checkUI = () => {
    let uui = localStorage.getItem('interface')
    return uui === 'VCLNC' ? "DVS Vet Clinic" : "DVS Distribution";
  }
  // const setNavigationRoutes = () => {
  //   let uui = localStorage.getItem('interface')
  //   return uui === 'VCLNC' ? [] : []
  // }
  
  React.useEffect(() => {
    setBrndName(checkUI())
  }, [])

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={[routes[2]]}
        brandName={brndName}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <ErrorNotification />
        {/* <Configurator /> */}
        {/* <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton> */}
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}

dsis.displayName = "/src/layout/dsis.jsx";

export default dsis;
