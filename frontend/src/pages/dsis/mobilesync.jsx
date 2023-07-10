import React, {useState} from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { 
  UserCircleIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Spinner,
  Input,
  Select, 
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import Mobile from '@/api/Mobile'
import moment from "moment/moment";
import {
  useMaterialTailwindController,
  setEvidenceContent,
  setBookingContent,
  setCallContent
} from '@/context'
import { 
  EvidenceDialog,
  BookingDialog,
  CallDialog
} from "@/widgets/mobile";
 
const callHeading = ["Business Name", "Address", "Category", "Call", "Remarks", "Action"];
const categories = [
  {
      "id":1,
      "catName": "Farm",
      "catDesc": "All farm establishment or business",
      "icon": "agriculture",
      "color": "green"
  },
  {
      "id":2,
      "catName": "Vet",
      "catDesc": "Vet clinics that supplied of the products",
      "icon": "vaccines",
      "color": "blue"
  },
  {
      "id":3,
      "catName": "Poultry",
      "catDesc": "Chicken farm supplied of the products",
      "icon": "flutter_dash",
      "color": "orange"
  },
  {
      "id":4,
      "catName": "Pet Shop",
      "catDesc": "Pet Shop that supplied of the products",
      "icon": "pets",
      "color": "red"
  }
]

export function AgentSync() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { evidenceContent } = controller;

  const [listAgent, setListAgent] = useState([]);
  const [TABLE_HEAD, setTableHead] = useState(callHeading);
  const [TABLE_ROWS, setTableRow] = useState([]);
  const [tableLoad, setTableLoad] = useState(false);
  const [syncDate, setSyncDate] = useState(moment().format('yyyy-MM-DD'))
  const [agentId, setAgentId] = useState(0)

  // Onchanges Methods
  const dateOnchange = (e) => {
    setSyncDate(e)
  }
  const agentOnchange = (e) => {
    setAgentId(e)
  }

  // Client
  const getAgentListCall = async () => {
    const {status, data} = await Mobile.getAgentList();
    // Action Scenario
    if(status <= 200){
      setListAgent(data.list)
      agentOnchange(data.list[0].key)
    } else {
      setListAgent([])
    }
  }
  const getClientListCall = async () => {
    setTableLoad(true)
    let payload = {
      aid: Number(agentId),
      date: moment(syncDate).format('yyyy-MM-DD')
    }
    const {status, data} = await Mobile.getClientList(payload);
    // Action Scenario
    if(status <= 200){
      let setData = await setTableRow(data.list)
      setTableLoad(false)
    } else {
      setTableRow([])
      setTableLoad(false)
    }
  }

  const getCategoryName = (val) => {
    let res = categories.filter(el => el.id === val)
    res = res.length === 0 ? '' : res[0].catName
    return res
  }

  const loaderTable = () => {
    if(tableLoad){
      return 'Fetching Data Please Wait...'
    } else {
      return ''
    }
  }

  React.useEffect(() => {
    getAgentListCall()
  }, [])

  return (
    <>
    
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none overflow-visible">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-60">
              {/* <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} /> */}
              <Input type="date" onChange={e => dateOnchange(e.target.value)} value={syncDate} label="Sync Date" />
            </div>
            <div className="w-full md:w-90">
              <Select
                onChange={e => agentOnchange(e)}
                label="Select Agent"
              >
                {listAgent.map(({ key, name }) => (
                  <Option key={key} value={key} className="flex items-center gap-2">
                    {/* <UserCircleIcon className="h-5 w-5 text-blue-500" /> */}
                    {name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-full md:w-90">
              <Button onClick={() => {getClientListCall()}}>Show Record</Button>
            </div>
          </div>
          <div>
            <Typography variant="h5" color="blue-gray">
              Agent Transactions
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the agent synced mobile app transactions to the clients and admin
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto px-0">
        
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
            TABLE_ROWS.map((value, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                      
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {value.storeName}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                      
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {value.address}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                      
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {getCategoryName(value.categoryId)}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {/* {value.attendance} */}
                          <Button 
                            onClick={() => setCallContent(dispatch, {
                              show: true,
                              store: {
                                name: value.storeName,
                                address: value.address,
                                loc: value.geoLocation,
                              },
                              callDetails: value.attendance
                            })}
                            size="sm"
                          >
                            Call Details
                          </Button>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                      
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {value.remarks}
                        </Typography>
                      </div>
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
                          <MenuItem
                            onClick={() => setBookingContent(dispatch, {show: true, list: value.books})}
                          >Booking Details</MenuItem>
                          <MenuItem
                            onClick={() => setEvidenceContent(dispatch, {show: true, imageUrl: value.files})}
                          >Evidence</MenuItem>
                        </MenuList>
                      </Menu>
                      
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        {loaderTable()}
        {/* <Button variant="outlined" color="blue-gray" size="sm">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton variant="outlined" color="blue-gray" size="sm">
            1
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            2
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            3
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            ...
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            8
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            9
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            10
          </IconButton>
        </div>
        <Button variant="outlined" color="blue-gray" size="sm">
          Next
        </Button> */}
      </CardFooter>
    </Card>
    <EvidenceDialog />
    <BookingDialog />
    <CallDialog />

    </>
  );
}


export default AgentSync;
