import React, {useState} from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
    patientList
} from "@/data"

const TABLE_HEAD = ["ID", "Patient Name", "Contact", "Schedule", "Action"];

export function Patients() {
    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState("");

    function handleOpen (data = {}, title = "Client Name") {
        setModalTitle(title)
        setModalData(data)
        setOpen(!open)
    };

    const openPetDetails = (data) => {
        console.log(data)
    }

    return (
        <div>
            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Client Patient Records
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            These are list of the clients that has recorded in this system
                        </Typography>
                    </div>
                    <div className="flex w-full shrink-0 gap-2 md:w-max">
                        <div className="w-full md:w-72">
                        <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
                        </div>
                    </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    <div className="flex flex-wrap w-max gap-8 mx-5">
                        {patientList.map(
                            ({ id, name, contact, schedule, pets }, _index) => {
                                return (
                                    <Card key={id} onClick={() => handleOpen(pets, name)} className="w-40">
                                        <CardBody className="text-center">
                                            <FolderIcon color="orange" />
                                            <Typography variant="text" color="blue-gray">
                                                {name}
                                            </Typography>
                                            <Typography variant="text" color="blue-gray">
                                                {contact}
                                            </Typography>
                                        </CardBody>
                                    </Card>
                                );
                            },
                        )}
                    </div>
                </CardBody>
                
            </Card>

            <Dialog open={open} handler={() => handleOpen(modalData, modalTitle)}>
                <DialogHeader>{modalTitle}</DialogHeader>
                <DialogBody divider>
                    <div className="flex flex-wrap w-max gap-8">
                    {modalData.map(
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
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default Patients;