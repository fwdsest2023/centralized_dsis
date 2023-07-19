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
    setProductDialog
} from '@/context'

export function AddProduct(props) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { productModal } = controller;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");

    async function addProduct (id, details) {
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
            setProductDialog(dispatch, !productModal)
            props.handleChange()
        }
    };

    return (
        <Dialog open={productModal} size="xs" >
            <DialogHeader>
                <div className=" flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        Add Product
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider className="">
                <form className="flex flex-col gap-4">
                    <div>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-4 font-medium"
                        >
                            Product Details
                        </Typography>
                        <Input type="text" label="Product Name" />
                        <div className="my-6">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="mb-4 font-medium"
                            >
                                Costing Details
                            </Typography>
            
                            <Input
                                label="Card Number"
                                maxLength={19}
                            />
                            <div className="my-4 flex items-center gap-4">
                                <Input
                                label="Expires"
                                maxLength={5}
                                containerProps={{ className: "min-w-[72px]" }}
                                />
                                <Input
                                label="CVC"
                                maxLength={4}
                                containerProps={{ className: "min-w-[72px]" }}
                                />
                            </div>
                            <Input label="Holder Name" />
                            </div>
                    </div>
                </form>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    className="mr-1"
                    onClick={() => setProductDialog(dispatch, !productModal)}
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={() => addProduct()}
                >
                    <span>Submit</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

AddProduct.displayName = "/src/widgets/dialogs/add-product.jsx";

export default AddProduct;