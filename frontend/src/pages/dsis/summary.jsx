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
 
const callHeading = ["DATE", "CLIENT NAME", "ADDRESS", "TIME-IN", "TIME-OUT", "DURATION","Remarks"];
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

export function AgentSummary() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { evidenceContent } = controller;

  const [listAgent, setListAgent] = useState([]);
  const [TABLE_HEAD, setTableHead] = useState(callHeading);
  const [TABLE_ROWS, setTableRow] = useState([]);
  const [tableLoad, setTableLoad] = useState(false);
  const [syncDate, setSyncDate] = useState(moment().format('yyyy-MM-DD'))
  const [dateFrom, setDateFrom] = useState(moment().format('yyyy-MM-DD'))
  const [dateTo, setDateTo] = useState(moment().format('yyyy-MM-DD'))
  const [agentId, setAgentId] = useState(0)

  // Onchanges Methods
  const dateFromOnChange = (e) => {
    setDateFrom(e)
  }
  const dateToOnchange = (e) => {
    setDateTo(e)
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
    setTableRow([])
    setTableLoad(true)
    let payload = {
      aid: Number(agentId),
      dateFrom: moment(dateFrom).format('yyyy-MM-DD'),
      dateTo: moment(dateTo).format('yyyy-MM-DD')
    }
    const {status, data} = await Mobile.getAgentSummaryList(payload);
    // Action Scenario
    if(status <= 200){
      let setData = await setTableRow(data.list)
      setTableLoad(false)
    } else {
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
            <div className="w-full md:w-60">
              <Input type="date" onChange={e => dateFromOnChange(e.target.value)} value={syncDate} label="Date From" />
            </div>
            <div className="w-full md:w-60">
              <Input type="date" onChange={e => dateToOnChange(e.target.value)} value={syncDate} label="Date To" />
            </div>
            <div className="w-full md:w-90">
              <Button onClick={() => {getClientListCall()}}>Show Record</Button>
            </div>
          </div>
          <div>
            <Typography variant="h5" color="blue-gray">
              Agent Summary Report
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the agent call from the range selected to be generated
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
                            {value.date}
                          </Typography>
                        </div>
                      </td>
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
                            {value.timeIn}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {value.timeOut}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {value.duration}
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
                    </tr>
                )
              })
            }
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        {loaderTable()}
      </CardFooter>
    </Card>
    <EvidenceDialog />
    <BookingDialog />
    <CallDialog />

    </>
  );
}


export default AgentSummary;
