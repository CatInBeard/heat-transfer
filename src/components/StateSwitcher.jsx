const StateSwitcher = ({isTransitive, canStartComputing, changeProblemState}) => {
    return <div className="row">
      <div className="col">
        Steady-state
      </div>
      <div className="col">
        <div className="form-check form-switch">
          <input checked={!isTransitive} className="form-check-input" type="checkbox" disabled={!canStartComputing} onChange={changeProblemState} />
        </div>
      </div>
      <div className="col">
        Transitive
      </div>
      <div className="col">
        <div className="form-check form-switch">
          <input checked={isTransitive} className="form-check-input" type="checkbox" disabled={!canStartComputing} onChange={changeProblemState} />
        </div>
      </div>
    </div>
}

export default StateSwitcher