import {
  HomeIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/solid";
import { Home, Patients, Inventory } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { Dsishome } from "@/pages/dsis";


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
      {
        icon: <BuildingStorefrontIcon {...icon} />,
        name: "Inventory Management",
        path: "/inventory",
        element: <Inventory />,
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
    title: "dsis pages",
    layout: "dsis",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "Dashboard",
        path: "/dashboard",
        element: <Dsishome />,
      },
    ],
  },
  
];

export default routes
