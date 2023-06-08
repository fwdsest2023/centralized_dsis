import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import {BellIcon, CheckCircleIcon} from "@heroicons/react/24/solid"
import {
    useMaterialTailwindController,
    setOpenNotif
} from '@/context'

export function ErrorNotification() {

    const [controller, dispatch] = useMaterialTailwindController();
    const { openNotif, notifContent } = controller;

    return (
        <>
            <Dialog open={openNotif} size="sm" handler={() => setOpenNotif(dispatch, !openNotif)}>
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        {notifContent.header}
                    </Typography>
                </DialogHeader>
                <DialogBody divider className="grid place-items-center gap-4">
                    <BellIcon className="h-16 w-16 text-red-500" />
                    {/* return type === 'error' ? <BellIcon className="h-16 w-16 text-red-500" /> : <CheckCircleIcon className="h-16 w-16 text-green-500" />; */}
                    <Typography color={notifContent.color} variant="h4">
                        {notifContent.title}
                    </Typography>
                    <Typography className="text-center font-normal">
                        {notifContent.message}
                    </Typography>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button variant="text" color="blue-gray" onClick={() => setOpenNotif(dispatch, !openNotif)}>
                        close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
       
    );
}

ErrorNotification.displayName = "/src/widgets/layout/error-handler.jsx";

export default ErrorNotification;