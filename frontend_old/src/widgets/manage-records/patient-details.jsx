import React, {useState} from "react";
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
import {AddSchedule} from "@/widgets/dialogs";
import Client from '@/api/Client'

export function PatientDetails(props) {
  const [listData, setListData] = useState([])
  const [activeTab, setActiveTab] = useState("petdetails");

  const fetchData =  async (value) => {
      let payload = {
          params: {
              pid: props.patientDetails.id
          },
          action: "get",
          tabSelected: value,
      }
      const {status, data} = await Client.patientActionTab(payload);
      // Action Scenario
      if(status <= 200){
          setListData(data.list)
      } else {
          setListData([])
      }
  }

  const handleTabSelection = async (value) => {
    setActiveTab(value)
    if(value === "petdetails"){
      return
    }

    fetchData(value)
  }

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
      component: <PetSchedule listData={listData} detail={props.patientDetails} />
    },
    {
      label: "Checkup",
      value: "checkup",
      icon: MagnifyingGlassCircleIcon,
      component: <PetCheckup listData={listData} detail={props.patientDetails} />
    },
    {
      label: "Wellness",
      value: "wellness",
      icon: BeakerIcon,
      desc: `dsads`,
      component: <PetWellness listData={listData} />
    },
  ];

  React.useEffect(() => {
    setActiveTab("petdetails")
  }, [])

  return (
    <div className="mt-4">
      <Tabs value={activeTab}>
        <TabsHeader>
          {data.map(({ label, value, icon }) => (
            <Tab 
              key={value} 
              value={value} 
              onClick={() => handleTabSelection(value)}
            >
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, component }) => (
            <TabPanel 
              key={value} 
              value={value}
            >
              {component}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
      <AddSchedule detail={props.patientDetails} loadData={fetchData} />
    </div>
  );
}

export default PatientDetails