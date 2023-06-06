import React, {useState} from "react";
import {
  Card,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Alert, 
  Textarea 
} from "@material-tailwind/react";
import {BellIcon} from "@heroicons/react/24/solid"
import Client from '@/api/Client'
import {
    useMaterialTailwindController,
    setOpenScheduleForm
} from '@/context'
import jwtDecode from "jwt-decode";

export function AddSchedule(props) {
    const token = localStorage.getItem('token');
    const usrData = jwtDecode(token);

    const [controller, dispatch] = useMaterialTailwindController();
    const { openScheduleForm } = controller;
    // Pet Details
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [complain, setComplain] = useState("");
    const [treatment, setTreatment] = useState("");

    async function addPatientSchedule () {

        if(scheduleDate === ""){
            setHasError(!hasError)
            setErrorMessage("Missing Schedule Date!")
            return
        }

        let payload = {
            params: {
                patientId: props.detail.id,
                clientId: props.detail.clientId,
                scheduleDate: scheduleDate,
                chckupForm: {
                    complain: complain,
                    treatment: treatment,
                },
                remarks: remarks,
                createdBy: usrData.userId,
            },
            action: "add",
            tabSelected: "schedule"
        } 
        // console.log(payload)
        // return
        const {status, data} = await Client.patientActionTab(payload);

        if(status <= 200){
            setOpenScheduleForm(dispatch, !openScheduleForm)
            props.loadData("schedule")
        }
    };

    return (
        <>
            <Dialog open={openScheduleForm} size="xl">
                <DialogHeader>
                    <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            Schedule an Appointment
                        </div>
                    </div>
                </DialogHeader>
                <DialogBody divider className="h-[30rem] overflow-scroll">
                <form className="flex flex-col w-full gap-4">
                    <div className="my-6">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-4 font-medium"
                        >
                            Schedule Details
                        </Typography>
                        <Input 
                            type="date" 
                            label="Schedule Date" 
                            onChange={e => setScheduleDate(e.target.value)} 
                            value={scheduleDate}
                        /><br />
                        <Textarea 
                            label="Remarks"
                            onChange={e => setRemarks(e.target.value)} 
                            value={remarks}
                        />
                    </div>
    
                    <div className="my-6">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-4 font-medium"
                    >
                        Purpose of Visit
                    </Typography>
                    <div className=""> 
                        <Textarea
                            onChange={e => setComplain(e.target.value)} 
                            value={complain}
                            label="Chief Complaint" 
                        />
                        <Textarea
                            onChange={e => setTreatment(e.target.value)} 
                            value={treatment}
                            label="Treatment"
                        />
                    </div>
                    
                    </div>
                </form>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        className="mr-1"
                        onClick={() => setOpenScheduleForm(dispatch, !openScheduleForm)}
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={() => addPatientSchedule()}
                    >
                        <span>Submit</span>
                    </Button>
                </DialogFooter>
            </Dialog>


            {/* Error Message */}
            <Dialog open={hasError} size="sm">
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Notification
                    </Typography>
                </DialogHeader>
                <DialogBody divider className="grid place-items-center gap-4">
                    <BellIcon className="h-16 w-16 text-red-500" />
                    <Typography color="red" variant="h4">
                        Submit Failed
                    </Typography>
                    <Typography className="text-center font-normal">
                        {errorMessage}
                    </Typography>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button variant="text" color="blue-gray" onClick={() => setHasError(!hasError)}>
                        close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
       
    );
}

AddSchedule.displayName = "/src/widgets/dialogs/add-patient.jsx";

export default AddSchedule;