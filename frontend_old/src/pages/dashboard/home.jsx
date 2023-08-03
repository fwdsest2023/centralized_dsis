import React, {useState} from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip
} from "@material-tailwind/react";
import {
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import {
  statisticsCardsData,
  ordersOverviewData,
} from "@/data";
import Dashboard from '@/api/Dashboard'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export function Home() {
  const [dashList, setDashList] = useState([])
  const [dashCards, setDashCards] = useState([])

  const getSchedules = React.useCallback( async () => {
    const {status, data} = await Dashboard.getScheduleList();
    // Action Scenario
    if(status <= 200){
      setDashList(data.list)
    }
  })
  const getDashboard = React.useCallback( async () => {
    const {status, data} = await Dashboard.getDashbaordList();
    // Action Scenario
    if(status <= 200){
      statisticsCardsData.map((el, index) => {
        if(index === 1){
          el.value = data.data.clientCount
        } else if(index === 2) {
          el.value = data.data.patientCount
        } else if(index === 3) {
          el.value = data.data.totalSales
        } else {
          el.value = data.data.todaysSale
        }

        return el
      })
      setDashCards(data.data)
    }
  })

  React.useEffect(() => {
    getSchedules()
    getDashboard()
  }, [])

  return (
    <React.Fragment>
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            // footer={
            //   <Typography className="font-normal text-blue-gray-600">
            //     <strong className={footer.color}>{footer.value}</strong>
            //     &nbsp;{footer.label}
            //   </Typography>
            // }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Client Schedules
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <strong>count of total scheduled patients</strong>
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="ml-4 mr-4 px-0 pt-0 pb-2">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView='dayGridMonth'
              weekends={true}
              dayMaxEvents={true}
              events={dashList}
              eventContent={renderEventContent}
            />
          </CardBody>
        </Card>
        {/* <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card> */}
      </div>
    </div>
    </React.Fragment>
  );
}

function renderEventContent(eventInfo) {
  const details = eventInfo.event.extendedProps.details;
  let petName = details.patientDetails.petName;
  let ownerName = `${details.patientOwner.firstName} ${details.patientOwner.lastName}`;
  let contactNumber = `${details.patientOwner.contact}`;

  return (
    <>
      <Chip 
        color="blue" 
        value={
          <div>
            <Typography
              variant="medium"
              color="white"
              className="font-medium capitalize leading-none"
            >
              <b>{petName}</b>
            </Typography>
            <Typography
              variant="small"
              color="white"
              className="font-medium capitalize leading-none"
            >
            <i>Owner: {ownerName}</i>
            </Typography>
            <Typography
              variant="small"
              color="white"
              className="font-medium capitalize leading-none"
            >
            <i>Contact: {contactNumber}</i>
            </Typography>
            <Typography
              variant="small"
              color="white"
              className="font-medium capitalize leading-none"
            >
            <i>Purpose: <br></br>{eventInfo.event.title}</i>
            </Typography>
          </div>
        }
      />
        
    </>
  )
}

export default Home;
