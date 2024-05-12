const TransitiveTableSwitcher = ({useCSVTable, changeUseCsvTable}) => {
    return <div className="row">
    <div className="col">
      Const/Formula
    </div>
    <div className="col">
      <div className="form-check form-switch">
        <input checked={!useCSVTable} className="form-check-input" type="checkbox" onChange={changeUseCsvTable} />
      </div>
    </div>
    <div className="col">
      CSV table
    </div>
    <div className="col">
      <div className="form-check form-switch">
        <input checked={useCSVTable} className="form-check-input" type="checkbox" onChange={changeUseCsvTable} />
      </div>
    </div>
  </div>
}
export default TransitiveTableSwitcher