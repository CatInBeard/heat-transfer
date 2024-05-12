import cursor from "../style/cursor.module.css"

const TransitivePlayerComponent = ( {onPrevFrameClick, togglePlaying, onNextFrameClick, clickable, updateFrameFromRange, playerFrame, MaxFrames, isPlaying}) => {
    return <div className='p-2 d-flex flex-row col-9'>
      <div className='fs-3 text-center m-2'>
        <i onClick={onPrevFrameClick} className={"bi bi-skip-start" + (clickable ? "-fill" : "") + " " + (clickable ? cursor.clickCursor : cursor.forbiddenCursor)}></i>
        <i onClick={togglePlaying} className={"bi bi-" + (isPlaying ? "pause" : "play") + (clickable ? "-fill" : "") + " " + (clickable ? cursor.clickCursor : cursor.forbiddenCursor)}></i>
        <i onClick={onNextFrameClick} className={"bi bi-skip-end" + (clickable ? "-fill" : "") + " " + (clickable ? cursor.clickCursor : cursor.forbiddenCursor)}></i>
      </div>
      <div className='fs-3 text-center m-2'>
        <input disabled={!clickable} onChange={updateFrameFromRange} value={playerFrame} type='range' min={0} max={MaxFrames - 1} step={1}/>
      </div>
      <div className="fs-3 m-2">
        frame: {playerFrame} {MaxFrames > 0 ? "/ " + (MaxFrames - 1) : ""}
      </div>
    </div>
}

export default TransitivePlayerComponent;