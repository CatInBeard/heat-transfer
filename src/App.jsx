import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react";
import {
  toggleHint, toggleUpload, toggleBlockVisibility,
  setBlockTermalConductivity,
  setAirTemperature, setWaterTemperature, saveInpData,
  setcomputingStatus
} from './store/reducers/values.jsx'
import HintComponent from './components/HintComponent.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { parseInpText, checkInpDataForHeatTransfer } from './inpParse.tsx';
import { getStatusText } from './statusExplain.jsx';
import style from "./App.module.css"
import ErrorPopup from "./components/ErrorPopup.jsx"

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
  const blocksVisibility = useSelector((state) => state.values.blocks_visibility)
  const blocks_termal_conductivity = useSelector((state) => state.values.blocks_termal_conductivity)

  const [errorPopup, setErrorPopup] = useState(null);


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

  const onBlockConductivityChange = (event) => {
    const sectionName = event.target.getAttribute('data-section-name');
    dispatch(setBlockTermalConductivity({ event: event.target.value, sectionName: sectionName }))
  };

  const onAirTemperatureChange = (event) => {
    dispatch(setAirTemperature({ event: event.target.value }))
  };

  const onWaterTemperatureChange = (event) => {
    dispatch(setWaterTemperature({ event: event.target.value }))
  };



  const toggleBlock = (event) => {
    const sectionName = event.target.getAttribute('data-section-name');
    dispatch(toggleBlockVisibility({sectionName: sectionName}))
  }


  const hintClick = () => {
    dispatch(toggleHint())
  }
  const uploadClick = () => {
    dispatch(toggleUpload())
  }

  const confirmUpload = (file) => {
    dispatch(setcomputingStatus({ status: "loading" }))
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        var text = e.target.result;
        let inpData = parseInpText(text);
        checkInpDataForHeatTransfer(inpData);
        console.log(inpData);
        dispatch(saveInpData({ data: inpData }));
        dispatch(setcomputingStatus({ status: "ready" }))
      }
      catch (error) {
        setErrorPopup({ title: "Error parsing *.inp file", text: error.message });
        dispatch(setcomputingStatus({ status: "waiting" }))
      }
      dispatch(toggleUpload());
    };
    reader.readAsText(file);
  }

  const closeError = () => {
    setErrorPopup(null);
  }

  const canChangeSectionsSettings = computingStatus != "waiting" && inpData !== null;

  let blocksSettings = !canChangeSectionsSettings ?
  <div className='p-2'>
    <div className="row">
      <div className="col alert alert-info">
        To change settings, first upload the file
      </div>
    </div>
  </div>: <>
  {inpData.problemData[0].sections.map( (section) =>{

    let block_visibility = !blocksVisibility[section.name]
    let block_termal_conductivity = blocks_termal_conductivity[section.name];
    let Button = block_visibility ? <button onClick={toggleBlock} data-section-name={section.name} className='btn btn-success'><nobr data-section-name={section.name}>Show</nobr></button> :
    <button onClick={toggleBlock} data-section-name={section.name} className='btn btn-danger'><nobr data-section-name={section.name}>Hide</nobr></button>

  return <>
  <div className='p-2'>
    <div className="row">
      <div className="col">
        {section.name}:
      </div>
      <div className="col">
        {Button}
      </div>
    </div>
  </div>
  <div className='p-2 form-group row'>
    <div className="row">
      <div className="col">
        <input data-section-name={section.name} min={0} value={block_termal_conductivity} onChange={onBlockConductivityChange} type='number' className='form-control'></input>
      </div>
      <div className='col'>
        <label>W/mK</label>
      </div>
    </div>
  </div>
  </>
  }
  )}</>


  const hint_component = hint_status ? <HintComponent cancelAction={hintClick}></HintComponent> : <></>
  const upload_component = upload_status ? <UploadComponent confirmAction={confirmUpload} fileType="*.inp" cancelAction={uploadClick}></UploadComponent> : <></>
  const error_component = errorPopup ? <ErrorPopup closeAction={closeError} title={errorPopup.title} text={errorPopup.text}></ErrorPopup> : <></>

  const status = 'Press start'
  return (
    <div className="container-lg mt-3">
      <h1>{heat_transfer_status_text} heat transfer</h1>
      {hint_component}
      {upload_component}
      {error_component}
      <div className={style.scrollable}>
        <canvas id="canvas" width={1200} height={500}></canvas>
      </div>
      <div className='d-flex align-items-baseline'>
        <div className='p-2 d-flex flex-column'>
          <div className='p-2'>
            Сhange thermal conductivity coefficient
          </div>
          
          {blocksSettings}
          
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
