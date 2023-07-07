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
    setCallContent
} from '@/context'
import { Loader } from "@googlemaps/js-api-loader"

const apiKey = 'AIzaSyCrQ2gSBwhbFsnj8JSYxCnTkXrb1ZJbmjw';
const loader = new Loader({
    apiKey: apiKey,
    version: "weekly",
    libraries: ["places"]
});

export function CallDialog(props) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { attContent } = controller;

    const initMap = () => {
        loader
        .load()
        .then((google) => {
                
                let callLoc = attContent.callDetails
                let store = attContent.store
                let storeLoc = Object.keys(attContent.store.loc).length !== 0 ? 
                attContent.store.loc : 
                callLoc.geoLocation.coorIn
                
                const mstore = new google.maps.LatLng(storeLoc.lat, storeLoc.lng);
                const map = new google.maps.Map(document.getElementById("map"), {
                    center: mstore,
                    zoom: 20,
                    mapTypeId: 'satellite'
                });
                const coordInfoWindow = new google.maps.InfoWindow();

                coordInfoWindow.setContent(createInfoWindowContent(mstore, map.getZoom(), store, callLoc));
                coordInfoWindow.setPosition(mstore);
                coordInfoWindow.open(map);
                map.addListener("zoom_changed", () => {
                    coordInfoWindow.setContent(createInfoWindowContent(mstore, map.getZoom(), store, callLoc));
                    coordInfoWindow.open(map);
                });

                // Agent Marker
                const callInTag = document.createElement("div");

                callInTag.className = "callin-tag";
                callInTag.textContent = "Agent Call In";
                const markerCallIn = new google.maps.Marker({
                  map,
                  position: {lat: callLoc.geoLocation.coorIn.lat, lng: callLoc.geoLocation.coorIn.lng},
                  content: callInTag
                });

                const callOutTag = document.createElement("div");

                callOutTag.className = "callin-tag";
                callOutTag.textContent = "Agent Call Out";
                const markerCallOut = new google.maps.Marker({
                  map,
                  position: {lat: callLoc.geoLocation.coorOut.lat, lng: callLoc.geoLocation.coorOut.lng},
                  content: callOutTag
                });
            
                // markerCallIn.addListener('click', ({domEvent, latLng}) => {
                //   const {target} = domEvent;
                //   // Handle the click event.
                //   // ...
                //   alert(target)
                // });
        })
        .catch((e) => {
            // do something
            console.log(e)
        });
        
    }

    const TILE_SIZE = 256;

    function createInfoWindowContent(latLng, zoom, details, callDet) {
        const scale = 1 << zoom;
        const worldCoordinate = project(latLng);
        const pixelCoordinate = new google.maps.Point(
            Math.floor(worldCoordinate.x * scale),
            Math.floor(worldCoordinate.y * scale)
        );
        const tileCoordinate = new google.maps.Point(
            Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
            Math.floor((worldCoordinate.y * scale) / TILE_SIZE)
        );
        return [
            details.name,
            "Address: " + details.address,
            "Call In: " + callDet.startCall,
            "Call Out: " + callDet.endCall,
        ].join("<br>");
    }

    // The mapping between latitude, longitude and pixels is defined by the web
    // mercator projection.
    function project(latLng) {
    let siny = Math.sin((latLng.lat() * Math.PI) / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng() / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
    );
    }
    const runAfterRender = () => {
        const myElem = document.getElementById("map")
        if(myElem)
        {
            initMap()
        }
    }
    React.useEffect(() => {
        if(attContent.show){
            runAfterRender()
        }
    }, [attContent])

    return (
        <Dialog open={attContent.show} size="sm">
            <DialogHeader>
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        Call Details
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider >
                <div id="map" className="w-full h-80"></div>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    className="mr-1"
                    onClick={() => setCallContent(dispatch, !attContent.show)}
                >
                    <span>Close</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

CallDialog.displayName = "/src/widgets/dialogs/add-client.jsx";

export default CallDialog;