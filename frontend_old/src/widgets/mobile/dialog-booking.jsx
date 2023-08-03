import React, {useState} from "react";
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
import {
    useMaterialTailwindController,
    setBookingContent
} from '@/context'

const HEADING = ["Item Name", "QTY", "Price", "Total"];

export function BookingDialog(props) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { bookingContent } = controller;
    
    return (
        <Dialog open={bookingContent.show} size="sm">
            <DialogHeader>
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        Booking Details
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider >
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                        {HEADING.map((head) => (
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
                        {bookingContent.list.map((value, index) => {
                            const isLast = index === bookingContent.list.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                            <tr key={index}>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                        {value.itemName}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                        {value.price}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                        {value.qty}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                        {(Number(value.price) * Number(value.qty))}
                                        </Typography>
                                    </div>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    className="mr-1"
                    onClick={() => setBookingContent(dispatch, {show: !bookingContent.show, list:[]})}
                >
                    <span>Close</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

BookingDialog.displayName = "/src/widgets/dialogs/booking-details.jsx";

export default BookingDialog;