const GridSettingsButton = ({ canChangeGridVisibility, toggleGrid, gridVisible }) => {
    if (gridVisible) {
        return <div className='p-2'>
            <button disabled={!canChangeGridVisibility} onClick={toggleGrid} className='btn btn-secondary'>Hide mesh</button>
        </div>
    }
    return <div className='p-2'>
        <button disabled={!canChangeGridVisibility} onClick={toggleGrid} className='btn btn-primary'>Show mesh</button>
    </div>

}

export default GridSettingsButton;