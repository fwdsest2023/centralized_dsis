import React, { useState } from "react";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter
} from "@material-tailwind/react";
import {
    useMaterialTailwindController,
    setOpenScheduleForm,
    setOpenUpdateScheduleForm
} from '@/context'
import {UpdateSchedule} from "@/widgets/dialogs";
import Client from '@/api/Client'
   
const TABLE_HEAD = ["Schedule Date", "Description", "Status", "Action"];
 
export function PetSchedule(props){
    const [controller, dispatch] = useMaterialTailwindController();
    const { 
        openScheduleForm, 
        openUpdateScheduleForm 
    } = controller;
    // set States
    const [schedDetails, setSchedDetails] = useState({})

    // Methods
    const openScheduleDetails = async (scheduleId) => {
        let payload = {
            params: {
                id: scheduleId,
            },
            action: "details",
            tabSelected: "schedule"
        }
        const {status, data} = await Client.patientActionDetailTab(payload);
        if(status <= 200){
            setSchedDetails(data)
            setOpenUpdateScheduleForm(dispatch, !openUpdateScheduleForm)
        }

    }



    return(
        <>
            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Schedule list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about patients scheduled appointments
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button
                            onClick={() => setOpenScheduleForm(dispatch, !openScheduleForm)}
                            className="flex items-center gap-3" 
                            color="blue" 
                            size="sm"
                        >
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Schedule
                        </Button>
                    </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="w-full md:w-72">
                            <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-auto px-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                        {TABLE_HEAD.map((head, index) => (
                            <th
                            key={head}
                            className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                {head}{" "}
                                {index !== TABLE_HEAD.length - 1 && (
                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                )}
                            </Typography>
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.listData.map(({ id, scheduleDate, remarks,status }, index) => {
                        const isLast = index === props.listData.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
            
                        return (
                            <tr key={index}>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {scheduleDate}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {remarks}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <div className="w-max">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={status === "1" ? "Done" : "Pending"}
                                            color={status === "1" ? "green" : "blue-gray"}
                                        />
                                    </div>
                                </td>
                                <td className={classes}>
                                    <Button
                                        onClick={() => openScheduleDetails(id)}
                                        color="blue"
                                        disabled={status === "1"}
                                        size="sm"
                                    >
                                        <EyeIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    {/* <Typography variant="small" color="blue-gray" className="font-normal">
                    Page 1 of 10
                    </Typography>
                    <div className="flex gap-2">
                    <Button variant="outlined" color="blue-gray" size="sm">
                        Previous
                    </Button>
                    <Button variant="outlined" color="blue-gray" size="sm">
                        Next
                    </Button>
                    </div> */}
                </CardFooter>
            </Card>
            <UpdateSchedule 
                detail={props.detail} 
                schedData={schedDetails} 
            />
            
        </>
    )
}

export default PetSchedule