import React from "react";

export function PetCheckup(props){

    return(
        <>
            <div className="mx-3">
                this is checkup of {props.petName}
            </div>
        </>
    )
}

export default PetCheckup