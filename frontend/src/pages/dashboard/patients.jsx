import React, {useState} from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, ArrowUturnLeftIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Input,
  Breadcrumbs 
} from "@material-tailwind/react";
import Client from '@/api/Client'
import { AddClient, AddPatient } from "@/widgets/dialogs";
import { PatientList } from "@/widgets/manage-records";
import {
    useMaterialTailwindController,
    setOpenClientForm,
    setOpenPatientForm
} from '@/context'

export function Patients() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openClientForm, openPatientForm } = controller;

    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [clientDetail, setClientDetail] = useState({});
    const [clientList, setClientList] = useState([]);

    async function handleOpen (id, details) {
        let payload = {
            uid: id
        }

        const {status, data} = await Client.getClientPatients(payload);
        // Action Scenario
        if(status <= 200){
            setClientDetail(details)
            setModalData(data.list)
        } 

        setOpen(!open)
    };
 
    const fetchClients =  async () => {
        setOpen(false)
        setModalData([])
        const {status, data} = await Client.getClientList();
        // Action Scenario
        if(status <= 200){
            setClientList(data.list)
        }
    }


    const mapClientList = () => {
        if(clientList.length >= 1 && !open){
            return clientList.map(
                (val, _index) => {
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
                            <Card key={val.id} onClick={() => handleOpen(val.id, val)} className="w-40">
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
            )
        } else {
            return <PatientList dataList={modalData} />;
        }
    }

    const mapBreadCrumbs = () => {
        
        if(open){
            return (
                <div className="flex flex-wrap w-max gap-8 mx-5">
                    <Breadcrumbs>
                        <a onClick={() => fetchClients()} className="opacity-60">
                            <ArrowUturnLeftIcon className="h-6 w-6 text-blue-500" />
                        </a>
                    </Breadcrumbs>
                </div>
            );
        } else {
            return '';
        }
    }

    const addButtons = () => {
        
        if(open){
            return (
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => setOpenPatientForm(dispatch, !openPatientForm)}
                >
                    <span>Add Pet</span>
                </Button>
                
            );
        } else {
            return (
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => setOpenClientForm(dispatch, !openClientForm)}
                >
                    <span>Add Client</span>
                </Button>
            );
        }
    }

    React.useEffect(() => {
        fetchClients()
    }, [])

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
                            <div className="w-full md:w-30">
                                {addButtons()}
                            </div>
                            <div className="w-full md:w-71">
                                <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
                                
                            </div>
                            
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    
                    {mapBreadCrumbs()}
                    
                    <div className="flex flex-wrap mt-4 w-max gap-8 mx-5">
                        {mapClientList()}
                    </div>
                </CardBody>
                
            </Card>

            {/* FORM DIALOGS*/}
            <AddClient />
            <AddPatient clientDetails={clientDetail} />
        </div>
    );
}

export default Patients;