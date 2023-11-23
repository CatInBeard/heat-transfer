import ClosablePopupContainer from "./closablePopup/ClosablePopup";
import { useState, useEffect, useRef } from "react";

let UploadComponent = ({ cancelAction, fileType, confirmAction }) => {

    const [buttonLoadingStatus, setButtonStatus] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLabel, setLabelText] = useState("Upload your " + fileType + " file:");

    const focusRef = useRef(null);

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
    }, []);

    const handleFileChange = (event) => {
        setLabelText("Upload your " + fileType + " file:");
        setSelectedFile(event.target.files[0]);
    };

    const onUploadClick = () => {
        if (selectedFile) {
            setButtonStatus(true);
            confirmAction(selectedFile)
        }
        else {
            setLabelText(<i className="text-danger">You must select {fileType} file:</i>)
        }
    }

    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText={"Upload " + fileType + " file"} >

            <div className="form-group">
                <label htmlFor='fileinput' className="mb-2">
                    {uploadLabel}
                </label>
                <input ref={focusRef} accept=".inp" onChange={handleFileChange} name='fileinput' id='fileinput' type='file' className='form-control'></input>
            </div>
            <div className="form-group mt-2">
                <button id='uploadButton' className='btn btn-primary' onClick={onUploadClick} disabled={buttonLoadingStatus}>
                    {buttonLoadingStatus ? "Loading..." : "Upload"}
                </button>
            </div>

        </ClosablePopupContainer>
    )

}

export default UploadComponent;