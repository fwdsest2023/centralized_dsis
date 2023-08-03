import React from 'react';
import { Button } from "@material-tailwind/react";
import Inventory from "./dsispages/dsisinventory";
import Modal from "./dsispages/modal";




export function Dsishome() {
    // const [isToggled, setIsToggled] = useState(initalState)
    return (
        
        <div>
             <div className="flex w-max items-end mt-5 gap-4">
                <Button
                onClick={() => setIsToggled(!isToggled)} 
                size="lg">DSIS inventory
                </Button>
            </div>
            <div>
                <Modal />
                <Inventory />
            </div>
        </div>
        
    )
}

export default Dsishome;