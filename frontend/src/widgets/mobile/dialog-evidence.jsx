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
    setEvidenceContent
} from '@/context'

export function EvidenceDialog(props) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { evidenceContent } = controller;
    
    return (
        <Dialog open={evidenceContent.show} size="sm">
            <DialogHeader>
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        Evidence of Visit
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider >
                <img
                    className="h-full w-full rounded-lg"
                    src={evidenceContent.imageUrl}
                    alt="agent and client evidence image"
                />
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    className="mr-1"
                    onClick={() => setEvidenceContent(dispatch, !evidenceContent.show)}
                >
                    <span>Close</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

EvidenceDialog.displayName = "/src/widgets/dialogs/add-client.jsx";

export default EvidenceDialog;