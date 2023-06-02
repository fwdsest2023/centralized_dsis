import React, {useState} from "react";
import {
  Card,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select, 
  Option
} from "@material-tailwind/react";
import Client from '@/api/Client'
import {
    useMaterialTailwindController,
    setOpenPatientForm
} from '@/context'

export function AddPatient(props) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openPatientForm } = controller;
    // Pet Details
    const [petName, setPetName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [species, setSpecies] = useState("CANINE");
    const [breed, setBreed] = useState("BM");

    async function addPatientData () {

        let payload = {
            clientId: props.clientDetails.id,
            petName: petName,
            birthDate: birthDate,
            age: computeAge(birthDate),
            sex: gender,
            species: species,
            breed: breed,
        } 

        const {status, data} = await Client.addPatientData(payload);

        if(status <= 200){
            setPetName("")
            setBirthDate("")
            setGender("")
            setSpecies("")
            setBreed("")
            setOpenPatientForm(dispatch, !openPatientForm)
            props.handleChange(props.clientDetails.id, props.clientDetails)
        }
    };

    function computeAge(dob){
        var today = new Date();
        var birthDate = new Date(dob);

        const monthDiff = today.getMonth() - birthDate.getMonth();
        const yearDiff = today.getYear() - birthDate.getYear();

        let ageMonth = monthDiff + yearDiff * 12;

        return ageMonth
    }

    return (
        <Dialog open={openPatientForm}>
            <DialogHeader>
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        Pet Details
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider>
                
                <Card color="transparent" shadow={false}>
                    <form className="mt-8 mr-3 mb-2 w-80 max-w-screen-lg sm:w-90">
                        <div className="mb-4 flex flex-col gap-4">
                            <Input size="lg" onChange={e => setPetName(e.target.value)} value={petName} label="Pet Name" />
                            <Input type="date" size="lg" onChange={e => setBirthDate(e.target.value)} value={birthDate} label="Birthdate" />
                            <Select 
                                label="Select Gender"
                                onChange={e => setGender(e)}
                            >
                                <Option value="MALE">MALE</Option>
                                <Option value="FEMALE">FEMALE</Option>
                            </Select>
                        </div>
                    </form>
                </Card>
                <Card color="transparent" shadow={false}>
                    <form className="mt-8 mr-3 mb-2 w-80 max-w-screen-lg sm:w-90">
                        <div className="mb-4 flex flex-col gap-4">
                            <Select 
                                label="Select Species"
                                onChange={e => setSpecies(e)}
                            >
                                <Option value="CANINE">CANINE</Option>
                                <Option value="OTHERS">OTHERS</Option>
                            </Select>
                            <Input size="lg" onChange={e => setBreed(e.target.value)} value={breed} label="Breed" />
                        </div>
                    </form>
                </Card>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    className="mr-1"
                    onClick={() => setOpenPatientForm(dispatch, !openPatientForm)}
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => addPatientData()}
                >
                    <span>Submit</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

AddPatient.displayName = "/src/widgets/dialogs/add-patient.jsx";

export default AddPatient;