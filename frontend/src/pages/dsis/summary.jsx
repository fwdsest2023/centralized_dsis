import React, {useState, useMemo } from "react";
import { 
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon, 
  ArrowLeftIcon 
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Input,
  Select, 
  Option,
} from "@material-tailwind/react";
import Mobile from '@/api/Mobile'
import moment from "moment/moment";
import Pagination from "@/hooks/Pagination";
 
const TABLE_HEAD = ["DATE", "CLIENT NAME", "ADDRESS", "TIME-IN", "TIME-OUT", "DURATION","Remarks"];

export function AgentSummary() {

  const [listAgent, setListAgent] = useState([])
  const [TABLE_ROWS, setTableRow] = useState([])
  const [tableLoad, setTableLoad] = useState(false)
  const [dateFrom, setDateFrom] = useState(moment().format('yyyy-MM-DD'))
  const [dateTo, setDateTo] = useState(moment().format('yyyy-MM-DD'))
  const [agentId, setAgentId] = useState(0)

  //For Pagination
  const totalCountPerPage = 10;
  const [totalCount, setTotalCount] = useState(0)
  const [currPage, setCurrPage] = useState(1)

  

  // Onchanges Methods
  const dateFromOnChange = (e) => {
    setDateFrom(e)
  }
  const dateToOnChange = (e) => {
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
    setTotalCount(0)
    setTableLoad(true)
    let payload = {
      aid: Number(agentId),
      dateFrom: moment(dateFrom).format('yyyy-MM-DD'),
      dateTo: moment(dateTo).format('yyyy-MM-DD')
    }
    const {status, data} = await Mobile.getAgentSummaryList(payload);
    // Action Scenario
    if(status <= 200){
      await setTableRow(data.list)

      setTotalCount(data.count)
      // setting the total page count
      setTableLoad(false)
    } else {
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
    getAgentListCall()
  }, [])

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currPage - 1) * totalCountPerPage;
    const lastPageIndex = firstPageIndex + totalCountPerPage;
    return TABLE_ROWS.slice(firstPageIndex, lastPageIndex);
  }, [currPage, TABLE_ROWS]);


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
              <Input type="date" onChange={e => dateFromOnChange(e.target.value)} value={dateFrom} label="Date From" />
            </div>
            <div className="w-full md:w-60">
              <Input type="date" onChange={e => dateToOnChange(e.target.value)} value={dateTo} label="Date To" />
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
            currentTableData.map((value, index) => {
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
      <CardFooter >
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            
            <Typography variant="h5" color="blue-gray">
              Total Calls: {totalCount}
            </Typography>
          </div>
          <div>
            {loaderTable()}
          </div>
        </div>
        
      </CardFooter>
    </Card>
    </>
  );
}


export default AgentSummary;
