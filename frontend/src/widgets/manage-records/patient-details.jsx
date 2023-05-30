import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel
} from "@material-tailwind/react";
import {
  BeakerIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  MagnifyingGlassCircleIcon
} from "@heroicons/react/24/solid";
import { PetDetails, PetSchedule, PetCheckup, PetWellness } from "@/widgets/manage-records/details";

export function PatientDetails(props) {
  const data = [
    {
      label: "Pet Details",
      value: "petdetails",
      icon: UserCircleIcon,
      component: <PetDetails detail={props.patientDetails} />
    },
    {
      label: "Schedules",
      value: "schedule",
      icon: CalendarDaysIcon,
      component: <PetSchedule />
    },
    {
      label: "Checkup",
      value: "checkup",
      icon: MagnifyingGlassCircleIcon,
      component: <PetCheckup />
    },
    {
      label: "Wellness",
      value: "wellness",
      icon: BeakerIcon,
      desc: `dsads`,
      component: <PetWellness />
    },
  ];


  return (
    <div className="mt-4">
      <Tabs value="petdetails">
        <TabsHeader>
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, component }) => (
            <TabPanel key={value} value={value}>
              {component}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}

export default PatientDetails