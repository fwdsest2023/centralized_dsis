import PropTypes from "prop-types";
import React, {useState} from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  Card,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import Client from '@/api/Client'

export function PatientList({dataList}) {
    return (
        <div>
            <div className="flex flex-wrap w-max gap-8">
                {dataList.map(
                    (el, index) => {
                        return (
                            <Card onClick={() => openPetDetails(el)} className="w-40">
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
        </div>
    );
}

PatientList.defaultProps = {
    dataList: [],
};

PatientList.propTypes = {
  dataList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
  
PatientList.displayName = "/src/widgets/manage-recors/patient-list.jsx";

export default PatientList;