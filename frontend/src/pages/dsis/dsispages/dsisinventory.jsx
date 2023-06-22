import React from 'react'
import { Button } from "@material-tailwind/react";

import { Card, Typography } from "@material-tailwind/react";
const TABLE_HEAD = ["Action", "Date","ReferenceNO" , "Location", "Adjustment type", "Total Amount", "Total amount recovered", "Reason", "Added by" ];
 
const TABLE_ROWS = [
    
    {
      name: "John Michael",
      date: "23/04/18",
      ReferenceNO:"1223112",
      location:"asd",
      AdjustmentType:"ssd",
      TotalAmount:"P 120",
      TotalAmountRecovered:"ddaa",
      Reason:"swa",
      AddedBy:"asd",
      
    },
    {
      name: "John Michael",
      date: "23/04/18",
      ReferenceNO:"1223112",
      location:"asd",
      AdjustmentType:"ssd",
      TotalAmount:"23/22/212",
      TotalAmountRecovered:"ddaa",
      Reason:"swa",
      AddedBy:"asd",
    },
    {
      name: "John Michael",
      date: "23/04/18",
      ReferenceNO:"1223112",
      location:"asd",
      AdjustmentType:"ssd",
      TotalAmount:"23/22/212",
      TotalAmountRecovered:"ddaa",
      Reason:"swa",
      AddedBy:"asd",
    },
    {
      name: "John Michael",
      date: "23/04/18",
      ReferenceNO:"1223112",
      location:"asd",
      AdjustmentType:"ssd",
      TotalAmount:"23/22/212",
      TotalAmountRecovered:"ddaa",
      Reason:"swa",
      AddedBy:"asd",
    },
    {
      name: "John Michael",
      date: "23/04/18",
      ReferenceNO:"1223112",
      location:"asd",
      AdjustmentType:"ssd",
      TotalAmount:"23/22/212",
      TotalAmountRecovered:"ddaa",
      Reason:"swa",
      AddedBy:"asd",
    },
];

function dsisinventory() {
  return (
    <div>
        <div className='inventory-container mt-5'>
                            <Card className="overflow-scroll h-full w-full">
                                <table className="w-full min-w-max table-auto text-left">
                                    <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
                                    {TABLE_ROWS.map(({ name,date,ReferenceNO ,location,AdjustmentType, TotalAmount, TotalAmountRecovered, Reason, AddedBy}, index) => {
                                        const isLast = index === TABLE_ROWS.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                            
                                        return (
                                        <tr key={name}>
                                            <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {name}
                                            </Typography>
                                            </td>
                                            <td className={`${classes} bg-blue-gray-50/50`}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {date}
                                            </Typography>
                                            </td>
                                            <td className={`${classes} bg-blue-gray-50/50`}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {ReferenceNO}
                                            </Typography>
                                            </td>
                                            <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {location}
                                            </Typography>
                                            </td>
                                            <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {AdjustmentType}
                                            </Typography>
                                            </td>
                                            <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {TotalAmount}
                                            </Typography>
                                            </td>
                                            <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {TotalAmountRecovered}
                                            </Typography>
                                            </td>
                                            <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {Reason}
                                            </Typography>
                                            </td>
                                            <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {AddedBy}
                                            </Typography>
                                            </td>
                                            <td className={classes}>
                                            <Typography>
                                                <Button color="amber">EDIT</Button>
                                            </Typography>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                             </Card>
                             <div className="flex w-max gap-4">
                                    <Button color="green">Save</Button>
                             </div>
                </div>     
            </div>
  )
}

export default dsisinventory
