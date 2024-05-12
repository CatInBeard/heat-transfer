import inputStyle from "../style/input.module.css"
import cursor from "../style/cursor.module.css"

const BCEditor = ({ temperature_BC, useCSVTable, onFocusBc, onBlurBC, onBCTemperatureChange, openCSVUpload, openCsvTableInsert, isTransitive, OnExpressionHelp }) => {
    return <>
        {temperature_BC.map((boundary) => {

            if (useCSVTable) {
                return <div className='p-2 form-group' key={boundary.name}>
                    <div className="row">
                        <div className='col'>
                            <label>{boundary.name}:</label>
                        </div>
                        <div className="col">
                            <textarea onFocus={onFocusBc} onBlur={onBlurBC} data-bc-name={boundary.name} value={boundary.temperature} onChange={onBCTemperatureChange} className={"form-control " + inputStyle.BCTextarea} rows={2}></textarea>
                        </div>
                        <div className="col">
                            <i onClick={openCSVUpload} data-bc-name={boundary.name} title='Upload CSV' className={'bi bi-upload ' + cursor.clickCursor}></i> <i onClick={openCsvTableInsert} data-bc-name={boundary.name} title='Insert table manually' className={'bi bi-table ' + cursor.clickCursor}></i>
                        </div>
                    </div>
                </div>
            }
            else {
                return <div className='p-2 form-group' key={boundary.name}>
                    <div className="row">
                        <div className='col'>
                            <label>{boundary.name}:</label>
                        </div>
                        <div className="col">
                            <input onFocus={onFocusBc} onBlur={onBlurBC} min={0} data-bc-name={boundary.name} value={boundary.temperature} onChange={onBCTemperatureChange} type={!isTransitive ? "number" : "text"} className={'form-control ' + (!isTransitive ? inputStyle.inputMinSize : inputStyle.inputMinSizeLarge)}></input>
                        </div>
                        <div className="col">
                            &deg;C   {!isTransitive ? "" : <i onClick={OnExpressionHelp} title='You can use math expression with t variable' className={'bi bi-question-circle ' + cursor.helpCursor}></i>}
                        </div>
                    </div>
                </div>
            }

        })}
    </>
}

export default BCEditor;