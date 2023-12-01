import ClosablePopupContainer from "./closablePopup/ClosablePopup";
import { useState, useEffect, useRef } from "react";

let UploadComponent = ({ cancelAction, fileType, confirmAction, inpLibraryAction = null }) => {

    const [buttonLoadingStatus, setButtonStatus] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLabel, setLabelText] = useState("Upload your " + fileType + " file:");

    const inputRef = useRef(null);
    const submitRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleFileChange = (event) => {
        setLabelText("Upload your " + fileType + " file:");
        if (submitRef.current) {
            submitRef.current.focus();
        }
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

    let inpLibraryClick = () => {
        cancelAction();
        inpLibraryAction();
    }


    let libraryLink = inpLibraryAction ? <div  className="form-group m-2">
        Or use <a href="#" onClick={inpLibraryClick}>examples library</a>
    </div> : <></>

    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText={"Upload " + fileType + " file"} focusOnClose={false} >

            <div className="form-group">
                <label htmlFor='fileinput' className="mb-2">
                    {uploadLabel}
                </label>
                <input ref={inputRef} accept=".inp" onChange={handleFileChange} name='fileinput' id='fileinput' type='file' className='form-control'></input>
            </div>
            {libraryLink}
            <div className="form-group mt-2">
                <button ref={submitRef} className='btn btn-primary' onClick={onUploadClick} disabled={buttonLoadingStatus}>
                    {buttonLoadingStatus ? "Loading..." : "Upload"}
                </button>
            </div>

        </ClosablePopupContainer>
    )

}

export default UploadComponent;