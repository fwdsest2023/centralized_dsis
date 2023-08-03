import PropTypes from "prop-types";
import React from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Typography,
  CardBody,
  Tooltip,
} from "@material-tailwind/react";

export function ClientList(props) {
    return (
        <CardBody className="flex  flex-wrap px-0">
            <div className="flex flex-wrap mt-4 w-max gap-8 mx-5">
                {props.dataList.map(
                    (val, index) => {
                        return (
                            <Tooltip 
                                content={
                                <div className="w-80">
                                    <Typography color="white" className="font-medium">{`${val.firstName} ${val.lastName}`}</Typography>
                                    <Typography
                                        variant="small"
                                        color="white" 
                                        className="font-normal opacity-80"
                                    >
                                        {`Contact #: ${val.contact}`}
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="white" 
                                        className="font-normal opacity-80"
                                    >
                                        {`Address: ${val.address}`}
                                    </Typography>
                                </div>} 
                                placement="bottom"
                            >
                                <Card key={val.id} onClick={() => props.onClientClick(val.id, val)} className="w-40">
                                    <CardBody className="text-center">
                                        <FolderIcon color="orange" />
                                        <Typography variant="small" color="blue-gray">
                                            {`${val.firstName} ${val.lastName}`}
                                        </Typography>
                                    </CardBody>
                                </Card>
                            </Tooltip>
                        );
                    },
                )}
            </div>
        </CardBody>
    );
}

ClientList.displayName = "/src/widgets/manage-recors/client-list.jsx";

export default ClientList;