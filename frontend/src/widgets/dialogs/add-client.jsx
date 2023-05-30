import React, {useState} from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  Card,
  Typography,
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
    setOpenClientForm
} from '@/context'

export function AddClient(props) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openClientForm } = controller;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");

    async function addClient (id, details) {
        let payload = {
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            contact: contact,
            address: address,
        }

        const {status, data} = await Client.addClientData(payload);

        if(status <= 200){
            setFirstName("")
            setLastName("")
            setMiddleName("")
            setContact("")
            setAddress("")
            setOpenClientForm(dispatch, !openClientForm)
            props.handleChange()
        }
    };

    return (
        <Dialog open={openClientForm}>
            <DialogHeader>
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        Add Client
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider>
                
                <Card color="transparent" shadow={false}>
                    <form className="mt-8 mr-3 mb-2 w-80 max-w-screen-lg sm:w-90">
                        <div className="mb-4 flex flex-col gap-4">
                            <Input size="lg" onChange={e => setFirstName(e.target.value)} value={firstName} label="Fist Name" />
                            <Input size="lg" onChange={e => setLastName(e.target.value)} value={lastName} label="Last Name" />
                            <Input size="lg" onChange={e => setMiddleName(e.target.value)} value={middleName} label="Middle Initial" />
                        </div>
                    </form>
                </Card>
                <Card color="transparent" shadow={false}>
                    <form className="mt-8 mr-3 mb-2 w-80 max-w-screen-lg sm:w-90">
                        <div className="mb-4 flex flex-col gap-4">
                            <Input size="lg" onChange={e => setContact(e.target.value)} value={contact} label="Contact Number" />
                            <Input size="lg" onChange={e => setAddress(e.target.value)} value={address} label="Address" />
                            <Card color="transparent" shadow={false}>
                                <i>Note: default password always <strong>dvspet123</strong></i>
                            </Card>
                        </div>
                    </form>
                </Card>

            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    className="mr-1"
                    onClick={() => setOpenClientForm(dispatch, !openClientForm)}
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => addClient()}
                >
                    <span>Create Account</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

AddClient.displayName = "/src/widgets/dialogs/add-client.jsx";

export default AddClient;