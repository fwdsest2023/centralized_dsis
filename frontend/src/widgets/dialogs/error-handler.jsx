import React, {useState} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import {BellIcon} from "@heroicons/react/24/solid"
import {
    useMaterialTailwindController,
    setOpenNotif
} from '@/context'

export function ErrorNotification() {

    const [controller, dispatch] = useMaterialTailwindController();
    const { openNotif, notifContent } = controller;

    return (
        <>
            <Dialog open={openNotif} size="sm">
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Notification
                    </Typography>
                </DialogHeader>
                <DialogBody divider className="grid place-items-center gap-4">
                    <BellIcon className="h-16 w-16 text-red-500" />
                    <Typography color={notifContent.color} variant="h4">
                        {notifContent.title}
                    </Typography>
                    <Typography className="text-center font-normal">
                    {notifContent.message}
                    </Typography>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button variant="text" color="blue-gray" onClick={() => setOpenNotif(!openNotif)}>
                        close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
       
    );
}

ErrorNotification.displayName = "/src/widgets/dialogs/error-handler.jsx";

export default ErrorNotification;