const InpLoaderButton = ({uploadClick, hintClick}) => {
  return <>
    <div className='p-2'>Load data</div>
    <div className='p-2'>
      <div className="row">
        <div className="col p-1">
          <button onClick={uploadClick} className='btn btn-primary'>
            <nobr>
              .inp <i className="bi bi-upload "></i>
            </nobr>
          </button>
        </div>
        <div className="col p-1">
          <button onClick={hintClick} className='btn btn-primary'>Help</button>
        </div>
      </div>
    </div>
  </>
}

export default InpLoaderButton