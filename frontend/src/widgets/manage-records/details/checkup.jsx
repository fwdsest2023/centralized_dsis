import React from "react";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

   
const TABLE_HEAD = ["Scheduled Date", "Complain", "Weight", "Diagnosis",  "Treatment", "Remarks"];

export function PetCheckup(props){

    return(
        <>
            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Checkup list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about patients checkup appointments
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        
                    </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    
                    <div className="w-full md:w-72">
                        <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
                    </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0">
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
                    {/* ["Scheduled Date", "Complain", "Weight", "Diagnosis",  "Treatment", "Remarks"]; */}
                        {props.listData.map(({ createdDate, complain, weight, treatment, remarks, diagnosis }, index) => {
                        const isLast = index === props.listData.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
            
                        return (
                            <tr key={index}>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {createdDate}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {complain}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {weight}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {treatment}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {diagnosis}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {remarks}
                                    </Typography>
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
        </>
    )
}

export default PetCheckup