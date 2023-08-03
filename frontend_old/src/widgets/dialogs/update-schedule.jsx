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
  Select, 
  Option,
  Textarea 
} from "@material-tailwind/react";
import Client from '@/api/Client'
import {
    useMaterialTailwindController,
    setOpenUpdateScheduleForm
} from '@/context'
import jwtDecode from "jwt-decode";

export function UpdateSchedule(props) {
    let defForm = {
        treatment: "",
        complain: ""
    }
    const token = localStorage.getItem('token');
    const usrData = jwtDecode(token);
    const checkForm = props.schedData.chckupForm !== undefined ? JSON.parse(props.schedData.chckupForm) : defForm;

    const [controller, dispatch] = useMaterialTailwindController();
    const { openUpdateScheduleForm } = controller;

    // Pet Details
    const [weight, setWeight] = useState("");
    const [temperature, setTemperature] = useState("");
    const [chistory, setHistory] = useState("");
    const [laboratories, setLaboratories] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [remarks, setRemarks] = useState("");

    async function addPatientSchedule () {
        

        let payload = {
            params: {
                patientId: props.detail.id,
                weight: weight,
                temperature: temperature,
                history: chistory,
                laboratories: laboratories,
                diagnosis: diagnosis,
                complain: checkForm.complain,
                treatment: checkForm.treatment,
                remarks: remarks,
                createdBy: usrData.userId,
                schedId: props.schedData.id
            },
            action: "add",
            tabSelected: "checkup"
        } 
        // console.log(payload)
        // return
        const {status, data} = await Client.patientActionTab(payload);

        if(status <= 200){
            setOpenUpdateScheduleForm(dispatch, !openUpdateScheduleForm)
        }
    };

    return (
        <Dialog open={openUpdateScheduleForm} size="xl">
            <DialogHeader>
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        Checkup Information
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider className="h-[30rem] overflow-scroll">
            <form className="flex flex-col gap-4 w-full">
                <div className="my-6">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-4 font-medium"
                    >
                        Checkup Details
                    </Typography>
                    <Input
                        label="Weight" 
                        onChange={e => setWeight(e.target.value)} 
                        value={weight}
                    /><br />
                    <Input
                        label="Temperature" 
                        onChange={e => setTemperature(e.target.value)} 
                        value={temperature}
                    /><br />
                    <Textarea
                        onChange={e => setHistory(e.target.value)} 
                        value={chistory}
                        label="History" 
                    /><br />
                    <Textarea
                        onChange={e => setLaboratories(e.target.value)} 
                        value={laboratories}
                        label="Laboratories" 
                    /><br />
                    <Textarea
                        onChange={e => setDiagnosis(e.target.value)} 
                        value={diagnosis}
                        label="Diagnosis" 
                    /><br />
                    <Textarea
                        onChange={e => setRemarks(e.target.value)} 
                        value={remarks}
                        label="Remarks" 
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
                  <div> 
                    <Textarea
                        onChange={e => setComplain(e.target.value)} 
                        value={checkForm.complain}
                        disabled
                        label="Chief Complaint" 
                    />
                    <Textarea
                        onChange={e => setTreatment(e.target.value)} 
                        value={checkForm.treatment}
                        disabled
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
                    onClick={() => setOpenUpdateScheduleForm(dispatch, !openUpdateScheduleForm)}
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
    );
}

UpdateSchedule.displayName = "/src/widgets/dialogs/add-patient.jsx";

export default UpdateSchedule;