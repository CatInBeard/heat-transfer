import ClosablePopupContainer from "./closablePopup/ClosablePopup";
import { useState, useEffect, useRef } from "react";

let LoadFromLibrary = ({ cancelAction, confirmAction }) => {

    const fixturesInpFileNames = [
        "13-elem.inp",
        "200-elem.inp",
    ]

    const selectFile = (event) => {
        const filePath = event.target.getAttribute('data-file-path');
        
        confirmAction(filePath)

    }

    let filesChoseList = fixturesInpFileNames.map( (fileName) => {
        return <div className="p-1">
        <a href="#" onClick={selectFile} data-file-path={"./fixtures/" + fileName}>{fileName}</a>
        </div>
    })
   
    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText={"Select *.inp file from library"} >
            {filesChoseList}
        </ClosablePopupContainer>
    )

}

export default LoadFromLibrary;