import React from "react";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { ProfileInfoCard } from "@/widgets/cards";

export function PetDetails(props){
    return(
        <>
            <div className="relative h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
                <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
                <CardBody className="p-4">
                <div className="mb-10 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                    <div>
                        <Typography variant="h5" color="blue-gray" className="mb-1">
                            {props.detail.petName}
                        </Typography>
                        <Typography
                        variant="small"
                        className="font-normal text-blue-gray-600"
                        >
                            Breed / Species: {`${props.detail.breed} / ${props.detail.species}`}
                        </Typography>
                    </div>
                    </div>
                </div>
                <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
                    <ProfileInfoCard
                        title="Owner Information"
                        description=""
                        details={{
                            "first name": `${props.detail.patientOwner.firstName} ${props.detail.patientOwner.middleName} ${props.detail.patientOwner.lastName}`,
                            mobile: `${props.detail.patientOwner.contact}`,
                            address: `${props.detail.patientOwner.address}`
                        }}
                    />
                    <ProfileInfoCard
                        title="Pet Information"
                        description=""
                        details={{
                            "Birth Date": `${props.detail.birthDate}`,
                            age: `${props.detail.age} Months (${parseFloat(props.detail.age / 12).toFixed(1)} Yrs Old)`,
                            gender: `${props.detail.sex}`
                        }}
                    />
                </div>
                </CardBody>
            </Card>
        </>
    )
}

export default PetDetails