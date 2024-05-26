import { useState } from 'react';
import { downloadTemperatureCsv } from '../export.tsx'
import ClosablePopupContainer from './closablePopup/ClosablePopup.jsx';

const DataExportDialog = ({ cancelAction, temperatures, increment = 1 }) => {

    const options = {
        'csv': 'csv',
        // 'vtk': 'vtk'
      }

    const [isDownloading, setIsDownloading] = useState(false)

    const [fileType, setFileType] = useState("csv")


    const changeFileType = (event) => {
        setFileType(event.target.value)
    }

    const downloadData = () => {
        downloadTemperatureCsv(temperatures, increment)
        setIsDownloading(true)
        setTimeout(() => {
            setIsDownloading(false)
        }, 2000)
    }

    const downloadingInfo = <div className='row'>
        <div className='col h5'>
            File downloading...
        </div>
    </div>

    return <ClosablePopupContainer focusOnClose={true} cancelAction={cancelAction} headerText="Export result">
        <div className='row'>
            <div className='col'>
                Format type
            </div>
            <div className='col'>
                <select onChange={changeFileType} className="form-select" aria-label="Select file type">
                    {Object.entries(options).map((entry) => {
                        return <option selected={entry[0] == fileType} value={entry[0]}>{entry[1]}</option>
                    })}
                </select>
            </div>
        </div>
        <div className='row'>
            <div className='col pt-2'>
                <button disabled={isDownloading} onClick={downloadData} className='btn btn-primary'>Download</button>
            </div>
        </div>
        {isDownloading && downloadingInfo}

    </ClosablePopupContainer>;
}

export default DataExportDialog;