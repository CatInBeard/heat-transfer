import cursor from "../style/cursor.module.css"
import inputStyle from "../style/input.module.css"
import { cloneDeep } from 'lodash';

const PreStepTransitive = ({ usePreStep, setUsePreStep, preStepIncrement, setPreStepIncrement, preStepSteps, setPreStepSteps, OnPreStepHelp, useAverageTemp, setUseAverageTemp, preStepCustomBC, setPreStepCustomBC, onFocusBc, onBlurBC }) => {

  const togglePreStep = () => {
    setUsePreStep(!usePreStep)
  }

  const toggleAverageTemp = () => {
    setUseAverageTemp(!useAverageTemp)
  }

  const changeIncrement = (event) => {
    setPreStepIncrement(event.target.value)
  }

  const changeSteps = (event) => {
    setPreStepSteps(event.target.value)
  }

  const preStepSettings = <>
    <div className="row">
      <div className="col">
        Increment
      </div>
      <div className="col">
        <input type="number" value={preStepIncrement} className={inputStyle.inputMinSize + " form-control"} onChange={changeIncrement} />
      </div>
    </div>
    <div className="row">
      <div className="col">
        Steps
      </div>
      <div className="col">
        <input type="number" value={preStepSteps} className={inputStyle.inputMinSize + " form-control"} onChange={changeSteps} />
      </div>
    </div>
    <div className="row">
      <div className="col">
        Calculate average temperatures for BC
      </div>
      <div className="col">
        <div className="form-check form-switch">
          <input checked={useAverageTemp} className="form-check-input" type="checkbox" onChange={toggleAverageTemp} />
        </div>
      </div>
    </div>
  </>

  const onBCTemperatureChange = (event) => {
    const bcName = event.target.getAttribute('data-bc-name');
    const array = cloneDeep(preStepCustomBC)
    const index = array.findIndex((item) => item.name === bcName);
    if (index !== -1) {
      array[index].temperature = event.target.value;
      setPreStepCustomBC(array)
    }
  }

  const BCPrestepSettings = <>
    {preStepCustomBC.map((boundary) => {
      return <div className='p-2 form-group' key={boundary.name}>
        <div className="row">
          <div className='col'>
            <label>{boundary.name}:</label>
          </div>
          <div className="col">
            <input onFocus={onFocusBc} onBlur={onBlurBC} min={0} data-bc-name={boundary.name} value={boundary.temperature} onChange={onBCTemperatureChange} type={"number"} className={'form-control ' + (inputStyle.inputMinSizeLarge)}></input>
          </div>
          <div className="col">
            &deg;C
          </div>
        </div>
      </div>
    })}
  </>

  return <div className="row">
    <div className="col">
      Use pre-step <i onClick={OnPreStepHelp} title='Use preheating of the model' className={'bi bi-question-circle ' + cursor.helpCursor}></i>
    </div>
    <div className="col">
      <div className="form-check form-switch">
        <input checked={usePreStep} className="form-check-input" type="checkbox" onChange={togglePreStep} />
      </div>
    </div>
    {usePreStep && preStepSettings}
    {!useAverageTemp && BCPrestepSettings}
  </div>
}

export default PreStepTransitive