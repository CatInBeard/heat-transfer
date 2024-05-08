import ClosablePopupContainer from "./closablePopup/ClosablePopup";
import { useState, useEffect, useRef } from "react";

let InsertCsvTableComponent = ({ cancelAction, confirmAction, initialData = null }) => {


    if(initialData === null){
        initialData = [["",""]]
    }
    const submitRef = useRef(null);

    useEffect(() => {
        if (submitRef.current) {
            submitRef.current.focus();
        }
    }, []);

    const [tableData, setTableData] = useState(initialData);


    const onUploadClick = () => {
        confirmAction(tableData)
    }

    const handleInputChange = (e, i, j) => {
        const updatedTableData = [...tableData];
        updatedTableData[i][j] = e.target.value;
        setTableData(updatedTableData);
        if( (i != updatedTableData.length -1) && updatedTableData[i].every(element => element === '')){
            updatedTableData.splice(i, 1);
        }
        if (tableData.every((row) => row.every((cell) => cell !== ""))) {
            setTableData([...tableData, ["",""]]);
        }
    };

    const tablePart = tableData.map((row, i) => {
        return <tr>
            <td>
                <input type="number" min={0} onChange={(e) => handleInputChange(e, i, 0)} key={i} value={row[0]} className="form-control" />
            </td>
            <td>
                <input type="number" onChange={(e) => handleInputChange(e, i, 1)} value={row[1]} className="form-control" />
            </td>
        </tr>
    })

    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText={"Insert Boundary condition table"} focusOnClose={false} >
            <div className="form-group mt-2">
                <table className="table">
                    <thead className="text-center">
                        <tr>
                            <th>time</th>
                            <th>temperature</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tablePart}
                    </tbody>
                </table>
            </div>
            <div className="form-group mt-2">
                <button ref={submitRef} className='btn btn-primary' onClick={onUploadClick}>
                    Confirm
                </button>
            </div>

        </ClosablePopupContainer>
    )

}

export default InsertCsvTableComponent;