import { getStatusText } from "../statusExplain"
const ComputingStatus = ({computingStatus, state_type, transitiveProgress}) => {
    return <div className='p-2'>Status: <b>{getStatusText(computingStatus, state_type, transitiveProgress)}</b></div>
}

export default ComputingStatus