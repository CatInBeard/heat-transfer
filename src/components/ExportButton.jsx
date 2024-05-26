const ExportButton = ({canExport, openExport}) => {

    return <div className="row">
        <div className="col p-2">
            <button onClick={openExport} disabled={!canExport} className="btn btn-primary">Export result</button>
        </div>
    </div>
}

export default ExportButton;