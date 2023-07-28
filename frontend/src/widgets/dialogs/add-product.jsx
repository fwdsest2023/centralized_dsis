import React, {useState, useMemo} from "react";
import jwtDecode from "jwt-decode";
import { FolderIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  Card,
  Typography,
  Button,
  Input,
  Select,
  Switch,
  Option,
  Textarea,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Product from '@/api/Product'
import {
    useMaterialTailwindController,
    setProductDialog
} from '@/context'

const regions = [
    {
        "regionId": 1,
        "regionName": 'Nueva Ecija',
        "price": 0
    },
    {
        "regionId": 2,
        "regionName": 'Aurora',
        "price": 0
    },
    {
        "regionId": 3,
        "regionName": 'Region II',
        "price": 0
    },
    {
        "regionId": 4,
        "regionName": 'Region I',
        "price": 0
    },
    {
        "regionId": 5,
        "regionName": 'Branches',
        "price": 0
    }
]



export function AddProduct(props) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { productModal } = controller;

    let appData = localStorage.getItem('token');
    const token = appData;
    const usrData = jwtDecode(token);

    const [sku, setSku] = useState("");
    const [prdoctName, setPrdoctName] = useState("");
    const [productCost, setproductCost] = useState("");
    const [unit, setunit] = useState("");
    const [category, setcategory] = useState("");
    const [description, setdescription] = useState("");
    const [hasPriceGroup, sethasPriceGroup] = useState(false);
    const [createdBy, setCreatedBy] = useState(usrData.userId);

    async function addProduct (id, details) {
        let cg = "";
        if(hasPriceGroup){
            let costGroup = regions.map((el) => {
                return {
                    regionId: el.regionId,
                    price: el.price
                }
            })
            cg = costGroup;
        }

        let payload = {
            sku: sku,
            productName: prdoctName,
            productCost: productCost,
            unit: unit,
            category: category,
            description: description,
            hasPriceGroup: hasPriceGroup,
            costGroup: cg,
            createBy: createdBy
        }
        const {status, data} = await Product.addNewProduct(payload);

        if(status <= 200){
            setSku("");
            setPrdoctName("");
            setproductCost("");
            setunit("");
            setcategory("");
            setdescription("");
            sethasPriceGroup(false);
            setProductDialog(dispatch, !productModal)
            props.handleChange()
        }
    };

    const checkHasGroupPrice = (val) => {
        sethasPriceGroup(val)
    }
    const groupPriceValueChange = (e, index) => {
        regions[index].price = e.target.value
    }


    const loadGroupList = () => {
        if(!hasPriceGroup){
            return '';
        } else {
            return regions.map((el, key) => {
                return (<div className="my-4 flex items-center gap-4">
                    <Input
                        label="Area"
                        value={el.regionName}
                        containerProps={{ className: "min-w-[72px]" }}
                    />
                    <Input
                        label="Price"
                        onChange={e => groupPriceValueChange(e, key)}
                        containerProps={{ className: "min-w-[72px]" }}
                    />
                </div>
                    
                )
            })
        }
    }

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
                        <div className="my-4 flex items-center gap-4">
                            <Input type="number" onChange={e => setSku(e.target.value)} value={sku} label="Product SKU" />
                        </div>
                        <Input type="text" label="Product Name" onChange={e => setPrdoctName(e.target.value)} value={prdoctName} className="mb-4 font-medium" />
                        <div className="my-4 flex items-center gap-4">
                            <Input type="number" label="Product Price" onChange={e => setproductCost(e.target.value)} value={productCost}/>
                        </div>
                        <div className="my-4 flex items-center gap-4">
                            <Select 
                                label="Unit"
                                onChange={e => setunit(e)}
                                containerProps={{ className: "min-w-[72px]" }}
                            >
                                <Option value="BG">BAG (BG)</Option>
                                <Option value="PC">PIECE (PC)</Option>
                                <Option value="BT">BOTTLE (BT)</Option>
                                <Option value="BX">BOX (BX)</Option>
                                <Option value="PH">POUCH (PH)</Option>
                            </Select>
                            <Select 
                                label="Category"
                                onChange={e => setcategory(e)}
                                containerProps={{ className: "min-w-[72px]" }}
                            >
                                <Option value="1">CAT FOOD</Option>
                                <Option value="2">DOG FOOD</Option>
                                <Option value="3">OTC MEDICINE</Option>
                                <Option value="4">PET ACCESSORIES</Option>
                                <Option value="5">POULTRY LINES</Option>
                            </Select>
                        </div>
                        <div className="">
                            <Textarea 
                                label="Description" 
                                onChange={e => setdescription(e.target.value)}
                                value={description} 
                                containerProps={{ className: "min-w-[72px]" }} 
                            />
                        </div>
                        {/* Cost Details */}
                        <div className="my-6">
                            <div className="my-4 flex items-center gap-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    containerProps={{ className: "min-w-[72px] mb-4 font-medium" }}
                                >
                                    Price Group 
                                </Typography>
                                <Switch 
                                    color="green"
                                    onChange={e => checkHasGroupPrice(e.target.checked)}
                                    containerProps={{ className: "min-w-[72px]" }}
                                />
                            </div>
                            
            
                            <div>
                                {loadGroupList()}
                            </div>
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