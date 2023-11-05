import ClosablePopupContainer from "./closablePopup/ClosablePopup";
import { useState } from "react";

let UploadComponent = ( {cancelAction, fileType, confirmAction} ) => {

    const [buttonText, setButtonText] = useState('Upload');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLabel, setLabelText] = useState("Upload your " + fileType + " file:");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onUploadClick = () => {
        if(selectedFile){
            setButtonText('Loading...');
            confirmAction()
        }
        else{
            setLabelText(<i className="text-danger">You must select {fileType} file:</i>)
        }
    }

    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText= {"Upload " + fileType + " file" } >

            <div className="form-group">
                <label for='fileinput' className="mb-2">
                    {uploadLabel}
                </label>
                <input accept=".inp" onChange={handleFileChange} name='fileinput' id='fileinput' type='file' className='form-control'></input>
            </div>
            <div className="form-group mt-2">
                <button id='uploadButton' className='btn btn-primary' onClick={onUploadClick}>
                    {buttonText}
                </button>
            </div>

        </ClosablePopupContainer>
    )

}

export default UploadComponent;