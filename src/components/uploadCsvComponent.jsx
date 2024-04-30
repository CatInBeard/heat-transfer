import ClosablePopupContainer from "./closablePopup/ClosablePopup";
import { useState, useEffect, useRef } from "react";

let UploadCsvComponent = ({ cancelAction, confirmAction }) => {

    let fileType = "csv"

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
            confirmAction(selectedFile)
        }
        else {
            setLabelText(<i className="text-danger">You must select {fileType} file:</i>)
        }
    }


    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText={"Upload " + fileType + " file"} focusOnClose={false} >

            <div className="form-group">
                <label htmlFor='fileinput' className="mb-2">
                    {uploadLabel}
                </label>
                <input ref={inputRef} accept=".csv" onChange={handleFileChange} name='fileinput' id='fileinput' type='file' className='form-control'></input>
            </div>
            <div className="form-group mt-2">
                <button ref={submitRef} className='btn btn-primary' onClick={onUploadClick}>
                    Upload
                </button>
            </div>

        </ClosablePopupContainer>
    )

}

export default UploadCsvComponent;