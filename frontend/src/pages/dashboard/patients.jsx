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
import { 
    PatientList,
    PatientDetails,
    ClientList
} from "@/widgets/manage-records";
import {
    useMaterialTailwindController,
    setOpenClientForm,
    setOpenPatientForm
} from '@/context'

export function Patients() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openClientForm, openPatientForm } = controller;

    // Set the View of the Component Display
    const [compView, setCompView] = useState("clientList");
    const [listData, setListData] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState({});
    const [clientDetail, setClientDetail] = useState({});

    async function handleOpenClientPet (id, details) {

        let payload = {
            uid: id
        }

        const {status, data} = await Client.getClientPatients(payload);
        // Action Scenario
        if(status <= 200){
            setCompView("patientList")
            setClientDetail(details)
            setListData(data.list)
        }
    };
 
    async function handleOpenPatient (data) {
       setSelectedDetails(data)
       setCompView("patientDetails")
    };
 
    const fetchClients =  async () => {
        const {status, data} = await Client.getClientList();
        // Action Scenario
        if(status <= 200){
            setListData(data.list)
        } else {
            setListData([])
        }
    }


    const mapComponentDisplay = () => {
        if(compView === "clientList"){
            return <ClientList 
                    dataList={listData}
                    onClientClick={handleOpenClientPet}
                />
        } else if(compView === "patientList") {
            return <PatientList 
                    dataList={listData}
                    clientDetails={clientDetail}
                    onPatientClick={handleOpenPatient}
                />;
        } else if(compView === "patientDetails") {
            return <PatientDetails
                    patientDetails={selectedDetails}
                />
        }
    }

    const breadCrumbsHandle = () => {
        if(compView === "patientList") {
            fetchClients()
            setCompView("clientList")
        } else if(compView === "patientDetails") {
            handleOpenClientPet(clientDetail.id, clientDetail)
            setCompView("patientList")
        }
    }



    const mapBreadCrumbs = () => {
        
        if(compView === "clientList"){
            return '';
        } else {
            return (
                <div className="flex flex-wrap w-max gap-8 mx-5">
                    <Breadcrumbs>
                        <a onClick={() => breadCrumbsHandle()} className="opacity-60">
                            <ArrowUturnLeftIcon className="h-6 w-6 text-blue-500" />
                        </a>
                    </Breadcrumbs>
                </div>
            );
        }
    }

    const addButtons = () => {
        
        if(compView === "patientList"){
            return (
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => setOpenPatientForm(dispatch, !openPatientForm)}
                >
                    <span>Add Pet</span>
                </Button>
                
            );
        } else if(compView === "clientList") {
            return (
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => setOpenClientForm(dispatch, !openClientForm)}
                >
                    <span>Add Client</span>
                </Button>
            );
        } else {
            return ''
        }
    }

    const parentHandleChange = () => {
        fetchClients()
        setCompView("clientList")
    }
    const addPatientHandleChange = (id, details) => {
        handleOpenClientPet(clientDetail.id, clientDetail)
        setCompView("patientList")
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
                    {mapBreadCrumbs()}
                </CardHeader>
                {mapComponentDisplay()}
                {/* <CardBody className="flex  flex-wrap px-0">
                    <div className="flex flex-wrap mt-4 w-max gap-8 mx-5">
                        
                    </div>
                </CardBody> */}
                
            </Card>

            {/* FORM DIALOGS*/}
            <AddClient 
                handleChange={parentHandleChange} 
            />
            <AddPatient 
                clientDetails={clientDetail} 
                handleChange={addPatientHandleChange} 
            />
        </div>
    );
}

export default Patients;