import PropTypes from "prop-types";
import React, {useState} from "react";
import {
  Card,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
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
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");

    async function addPatientData () {

        let payload = {
            clientId: props.clientDetails.id,
            petName: petName,
            birthDate: birthDate,
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
                            <Input size="lg" onChange={e => setGender(e.target.value)} value={gender} label="Gender" />
                        </div>
                    </form>
                </Card>
                <Card color="transparent" shadow={false}>
                    <form className="mt-8 mr-3 mb-2 w-80 max-w-screen-lg sm:w-90">
                        <div className="mb-4 flex flex-col gap-4">
                            <Input size="lg" onChange={e => setSpecies(e.target.value)} value={species} label="Species" />
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