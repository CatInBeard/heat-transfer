import cursor from "../style/cursor.module.css"

const TransitiveSolverMethodSwitcher = ({ transitiveMethod, changeTransitiveMethod, OnMethodHelp }) => {

  const options = {
    'forward': 'Forward',
    'crank-nicolson': 'Crank-Nicolson'
  }

  const changeMethod = (event) => {
    changeTransitiveMethod(event.target.value)
  }

  return <div className="row">
    <div className="col">
      Method <i onClick={OnMethodHelp} title='Different methods have different sustainability and resource intensity. Click to learn more' className={'bi bi-question-circle ' + cursor.helpCursor}></i>
    </div>
    <div className="col">
      <select onChange={changeMethod}  className="form-select" aria-label="Select method">
        {Object.entries(options).map((entry) => {
          return <option selected={entry[0] == transitiveMethod} value={entry[0]}>{entry[1]}</option>
        })}
      </select>
    </div>
  </div>
}
export default TransitiveSolverMethodSwitcher