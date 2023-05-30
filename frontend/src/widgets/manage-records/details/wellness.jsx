import React from "react";

export function PetWellness(props){

    return(
        <>
            <div className="mx-3">
                this is wellness of {props.petName}
            </div>
        </>
    )
}

export default PetWellness