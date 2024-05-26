import inputStyle from "../style/input.module.css"

const TransitiveSettings = ({initialTemp, onInitialTChange, stepIncrement, onStepIncrementChange, steps, onStepsChange, usePreStep}) => {
    return <>
        <div className='p-2 form-group' key="transitiveSettings">
            <div className="row">
                <div className='col'>
                    <label>Transitive settings:</label>
                </div>
            </div>
        </div>
        {!usePreStep && <div className='p-2 form-group' key="initalT">
            <div className="row">
                <div className='col'>
                    <label>Initial Temp:</label>
                </div>
                <div className="col">
                    <input value={initialTemp} min={0} onChange={onInitialTChange} type='number' className={'form-control ' + inputStyle.inputMinSize}></input>
                </div>
                <div className="col">
                    &deg;C
                </div>
            </div>
        </div> }

        <div className='p-2 form-group' key="stepIncrement">
            <div className="row">
                <div className='col'>
                    <label>Step increment:</label>
                </div>
                <div className="col">
                    <input value={stepIncrement} min={0.000000000001} onChange={onStepIncrementChange} type='number' className={'form-control ' + inputStyle.inputMinSize}></input>
                </div>
                <div className="col">

                </div>
            </div>
        </div>
        <div className='p-2 form-group' key="steps">
            <div className="row">
                <div className='col'>
                    <label>Steps:</label>
                </div>
                <div className="col">
                    <input value={steps} min={1} onChange={onStepsChange} type='number' className={'form-control ' + inputStyle.inputMinSize}></input>
                </div>
                <div className="col">

                </div>
            </div>
        </div>
    </>
}

export default TransitiveSettings