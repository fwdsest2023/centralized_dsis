import {
  HomeIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon
} from "@heroicons/react/24/solid";
import { Home, Patients, } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { Dsishome, DSISDashboard, Products, AgentSync } from "@/pages/dsis";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <FolderIcon {...icon} />,
        name: "Manage Records",
        path: "/records",
        element: <Patients />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Schedule List",
        path: "/schedule-list",
        element: <Patients />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    layout: "dsis",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/home",
        element: <DSISDashboard />,
      },
      {
        icon: <QrCodeIcon {...icon} />,
        name: "Products",
        path: "/inventory",
        element: <Products />,
      },
      {
        icon: <DevicePhoneMobileIcon {...icon} />,
        name: "Mobile Sync Management",
        path: "/mobile_sync",
        element: <AgentSync />,
      },
    ],
  },
  
];

export default routes
