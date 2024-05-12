const StartButton = ({canStartComputing, startComputing}) => {
    return <div className='p-2'>
        <button disabled={!canStartComputing} onClick={startComputing} className='btn btn-lg btn-primary'>Start</button>
    </div>
}

export default StartButton