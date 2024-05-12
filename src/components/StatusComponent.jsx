const StatusComponent = ({ inpData, nodesCount, elementsCount }) => {
    if (inpData) {

        const nodesCountComponent = nodesCount ?
            <div className="row">
                <div className="col p-1">
                    Nodes: {nodesCount}
                </div>
            </div> : <></>
        const elementsCountComponent = elementsCount ?
        <div className="row">
            <div className="col p-1">
                Elements: {elementsCount}
            </div>
        </div> : <></>

        return <div className='p-2'>
            <div className="row">
                <div className="col p-1">
                    Job name: {inpData.heading.jobName}
                </div>
            </div>
            <div className="row">
                <div className="col p-1">
                    Model name: {inpData.heading.modelName}
                </div>
            </div>
            {elementsCountComponent}
            {nodesCountComponent}
        </div>
    }
    return <></>
}

export default StatusComponent;