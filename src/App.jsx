import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useSelector, useDispatch } from 'react-redux'
import { setHeatTranserStatus, toggleHint, toggleUpload, toggleFirstBlockVisibility,
  toggleSecondBlockVisibility, setFirstBlockTermalConductivity, setSecondBlockTermalConductivity, 
  setAirTemperature, setWaterTemperature, saveInpData,
  setcomputingStatus } from './store/reducers/values.jsx'
import HintComponent from './components/HintComponent.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { parseInpText } from './inpParse.tsx';
import { getStatusText } from './statusExplain.jsx';
import style from "./App.module.css"

let App = () => {
  const dispatch = useDispatch();
  const heat_transfer_status_text = useSelector((state) => state.values.heat_transfer_status_text)
  const hint_status = useSelector((state) => state.values.show_hint)
  const upload_status = useSelector((state) => state.values.show_upload)
  const first_block_visibility = useSelector((state) => state.values.first_block_visibility)
  const second_block_visibility = useSelector((state) => state.values.second_block_visibility)
  const first_block_termal_conductivity = useSelector((state) => state.values.first_block_termal_conductivity)
  const second_block_termal_conductivity = useSelector((state) => state.values.second_block_termal_conductivity)
  const water_temperature = useSelector((state) => state.values.water_temperature)
  const air_temperature = useSelector((state) => state.values.air_temperature)
  const inpData = useSelector((state) => state.values.inpData)
  const computingStatus = useSelector((state) => state.values.computingStatus)
  

  const canStartComputing = computingStatus == "ready";

  const statusData = inpData ?
  <div className='p-2'>
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
  </div> : <></>;

  const onFirstBlockConductivityChange = (event) => {
    dispatch(setFirstBlockTermalConductivity( { event: event.target.value } ))
  };

  const onSecondBlockConductivityChange = (event) => {
    dispatch(setSecondBlockTermalConductivity( { event: event.target.value } ))
  };

  const onAirTemperatureChange = (event) => {
    dispatch(setAirTemperature( { event: event.target.value } ))
  };

  const onWaterTemperatureChange = (event) => {
    dispatch(setWaterTemperature( { event: event.target.value } ))
  };



  const toggleFirstBlock = () => {
    dispatch(toggleFirstBlockVisibility())
  }

  let firstButton = first_block_visibility ? <button onClick={toggleFirstBlock} className='btn btn-success'><nobr>Show</nobr></button> :
  <button onClick={toggleFirstBlock} className='btn btn-danger'><nobr>Hide</nobr></button>

  const toggleSecondBlock = () => {
    dispatch(toggleSecondBlockVisibility())
  }

  let secondButton = second_block_visibility ? <button onClick={toggleSecondBlock} className='btn btn-success'><nobr>Show</nobr></button> :
  <button onClick={toggleSecondBlock} className='btn btn-danger'><nobr>Hide</nobr></button>

  const hintClick = () => {
    dispatch(toggleHint())
  }
  const uploadClick = () => {
    dispatch(toggleUpload())
  }

  const confirmUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
      var text = e.target.result;
      }
      catch(error){
        alert("Error reading file!");
        return;
      }
      let inpData = parseInpText(text);
      console.log(inpData);
      dispatch(saveInpData({ data: inpData}));
      dispatch(toggleUpload());
    };
    reader.readAsText(file);
    dispatch(setcomputingStatus({status: "ready"}))
  }

  const hint_component = hint_status ? <HintComponent cancelAction = {hintClick}></HintComponent> : <></>
  const upload_component = upload_status ? <UploadComponent confirmAction={confirmUpload} fileType="*.inp" cancelAction = {uploadClick}></UploadComponent> : <></>

  const status = 'Press start'
  return (
    <div className="container-lg mt-3">
      <h1>{heat_transfer_status_text} heat transfer</h1>
      {hint_component}
      {upload_component}
      <div className={style.scrollable}>
        <canvas id="canvas" width={1200} height={500}></canvas>
      </div>
      <div className='d-flex align-items-baseline'>
        <div className='p-2 d-flex flex-column'>
          <div className='p-2'>
            Сhange thermal conductivity coefficient
          </div>
          <div className='p-2'>
            <div className="row">
              <div className="col">
                First block:
              </div>
              <div className="col">
                {firstButton}
              </div>
            </div>
          </div>
          <div className='p-2 form-group row'>
            <div className="row">
              <div className="col">
                <input min={0} value={first_block_termal_conductivity} onChange={onFirstBlockConductivityChange} type='number' className='form-control' name="coefB1" id="coefB1"></input>
              </div>
              <div className='col'>
              <label>W/mK</label>
              </div>
            </div>
          </div>
          <div className='p-2'>
            <div className="row">
              <div className="col">
                <nobr>Second block:</nobr>
              </div>
              <div className="col">
                {secondButton}
              </div>
            </div>
          </div>
          <div className='p-2 form-group'>
            <div className="row">
              <div className="col">
                <input min={0} value={second_block_termal_conductivity} onChange={onSecondBlockConductivityChange} type='number' className='form-control' name="coefB1" id="coefB1"></input>
              </div>
              <div className='col'>
              <label>W/mK</label>
              </div>
            </div>
          </div>
        </div>
        <div className='p-2 d-flex flex-column'>
          <div className='p-2'>
            Change temperature
          </div>
          <div className='p-2 form-group'>
            <div className="row">
              <div className='col'>
              <label>Water:</label>
              </div>
              <div className="col">
                <input min={0} value={water_temperature} onChange={onWaterTemperatureChange} type='number' className='form-control'></input>
              </div>
              <div className="col">
                &deg;K
              </div>
            </div>
          </div>
          <div className='p-2 form-group'>
            <div className="row">
              <div className='col'>
              <label>Air:</label>
              </div>
              <div className="col">
                <input min={0} value={air_temperature} type='number' onChange={onAirTemperatureChange} className='form-control'></input>
              </div>
              <div className="col">
                &deg;K
              </div>
            </div>
          </div>
        </div>
        <div className='p-2 d-flex flex-column'>
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
                <button onClick={hintClick} className='btn btn-primary'>{hint_status ? "Hide" : "Hint"}</button>
              </div>
            </div>
          </div>
          <div className='p-2'>Status: <b>{getStatusText(computingStatus)}</b></div>
          {statusData}
          <div className='p-2'>
            <button disabled={!canStartComputing} className='btn btn-lg btn-primary'>Start</button>  
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
