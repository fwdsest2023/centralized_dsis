import React, {useState, useMemo} from "react";
import { MagnifyingGlassIcon, ChevronUpDownIcon, AdjustmentsHorizontalIcon  } from "@heroicons/react/24/outline";
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { AddProduct } from "@/widgets/dialogs";
import Product from "@/api/Product";
import Pagination from "@/hooks/Pagination";
import {
    useMaterialTailwindController,
    setProductDialog
} from '@/context'

const TABLE_HEAD = ["SKU", "Products", "Unit Type", "Unit Price", "Category ID", "Total Stock", "Action" ];
 

export function Products() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { productModal } = controller;
    
    const [TABLE_ROWS, setTableRow] = useState([]);
    const [tableLoad, setTableLoad] = useState(false)
    //For Pagination
    const totalCountPerPage = 10;
    const [totalCount, setTotalCount] = useState(0)
    const [currPage, setCurrPage] = useState(1)

    const fetchProduct =  async () => {
        setTableLoad(true)
        setTableRow([])
        const {status, data} = await Product.getProductList();
        // Action Scenario
        if(status <= 200){
            setTableRow(data.list)
            setTotalCount(data.list.length)
            setTableLoad(false)
        } else {
            setTableRow([])
            setTotalCount(0)
            setTableLoad(false)
        }
    }

    const loaderTable = () => {
        if(tableLoad){
          return 'Fetching Data Please Wait...'
        } else {
          return <Pagination
            currentPage={currPage}
            totalCount={totalCount}
            pageSize={totalCountPerPage}
            onPageChange={page => setCurrPage(page)}
          />
        }
      }

    React.useEffect(() => {
        fetchProduct()
    }, [])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currPage - 1) * totalCountPerPage;
        const lastPageIndex = firstPageIndex + totalCountPerPage;
        return TABLE_ROWS.slice(firstPageIndex, lastPageIndex);
    }, [currPage, TABLE_ROWS]);
 
  return (
    
    <div>

        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none overflow-visible">
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                
                <div className="flex w-full shrink-0 gap-2 md:w-max">
                    <div className="w-full md:w-90">
                        <Button 
                            onClick={() => setProductDialog(dispatch, !productModal)}
                        >Add Product</Button>
                    </div>
                </div>
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Product List
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        These are list of product
                    </Typography>
                </div>
                </div>
            </CardHeader>
            <CardBody className=" px-0">
                <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                    {TABLE_HEAD.map((head, index) => (
                        <th
                        key={head}
                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                        >
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                            {head}{" "}
                            {index !== TABLE_HEAD.length - 1 && (
                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                            )}
                        </Typography>
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {/* for value.name etc */}
                    {currentTableData.map((value, index) => {
                    const isLast = index === TABLE_ROWS.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
        
                    return (
                        <tr key={value.productName}>
                            <td className={classes}>
                                <div className="flex flex-col">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {value.sku}
                                    </Typography>
                                </div>
                            </td>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {value.productName}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                            
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                >
                                    {value.unit}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                {value.productCost}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    N/A
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                {value.stock}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <Menu size="sm" placement="right-start">
                                        <MenuHandler>
                                        <Button variant="outlined" size="sm" className="flex items-center gap-3">
                                            <AdjustmentsHorizontalIcon strokeWidth={2} className="h-5 w-5" />
                                        </Button>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem>View Full Details</MenuItem>
                                            <MenuItem>Stock Details</MenuItem>
                                            
                                        </MenuList>
                                    </Menu>
                                </div>
                            </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                {loaderTable()}
            </CardFooter>
        </Card>

        <AddProduct
            handleChange={fetchProduct}  
        />
    </div>
  )
}

export default Products
