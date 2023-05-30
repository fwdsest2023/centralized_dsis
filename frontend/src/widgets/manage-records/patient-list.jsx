import PropTypes from "prop-types";
import React from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Typography,
  CardBody,
} from "@material-tailwind/react";

export function PatientList(props) {
    return (
        <CardBody className="flex  flex-wrap px-0">
            <div className="flex flex-wrap mt-4 w-max gap-8 mx-5">
                {props.dataList.map(
                    (el, index) => {
                        return (
                            <Card onClick={() => props.onPatientClick(el)} className="w-40">
                                <CardBody className="text-center">
                                    <FolderIcon color="orange" />
                                    <Typography variant="text" color="blue-gray">
                                        {el.petName}
                                    </Typography>
                                </CardBody>
                            </Card>
                        );
                    },
                )}
            </div>
        </CardBody>
    );
}

PatientList.displayName = "/src/widgets/manage-recors/patient-list.jsx";

export default PatientList;