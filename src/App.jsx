import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from "react";
import {
  toggleHint, toggleUpload, toggleBlockVisibility, toggleShowLoadFromLibrary,
  setBlockTermalConductivity, setBlockSpecificHeat, setBlockDensity,
  setBCTemperature, saveInpData,
  setcomputingStatus, setHeatStateType
} from './store/reducers/values.jsx'
import HintComponent from './components/HintComponent.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { parseInpText, checkInpDataForHeatTransfer } from './inpParse.tsx';
import { getStatusText } from './statusExplain.jsx';
import style from "./App.module.css"
import cnvStyle from "./canvas.module.css"
import ErrorPopup from "./components/ErrorPopup.jsx"
import { convertInpDataToMesh } from "./mesh.tsx"
import { setMesh, toggleGridVisibility, setNodesTemperature } from "./store/reducers/canvas.jsx"
import { computeSteadyState, computeTransitive } from './computeHeatTransfer.tsx';
import { drawMesh, drawTemperatureMap } from './draw.tsx';
import LoadFromLibrary from "./components/LoadFromLibrary.jsx"

let App = () => {
  const dispatch = useDispatch();
  const state_type = useSelector((state) => state.values.state_type)
  const hint_status = useSelector((state) => state.values.show_hint)
  const upload_status = useSelector((state) => state.values.show_upload)
  const inpData = useSelector((state) => state.values.inpData)
  const computingStatus = useSelector((state) => state.values.computingStatus)
  const blocksVisibility = useSelector((state) => state.values.blocks_visibility)
  const blocks_termal_conductivity = useSelector((state) => state.values.blocks_termal_conductivity)
  const blocks_specific_heat = useSelector((state) => state.values.blocks_specific_heat)
  const blocks_density = useSelector((state) => state.values.blocks_density)
  const temperature_BC = useSelector((state) => state.values.temperature_BC)
  const Mesh = useSelector((state) => state.canvas.mesh)
  const gridVisible = useSelector((state) => state.canvas.gridVisible)
  const nodesTemperature = useSelector((state) => state.canvas.nodesTemperature)
  const show_load_from_library = useSelector((state) => state.values.show_load_from_library)

  const [errorPopup, setErrorPopup] = useState(null);


  const canvasRef = useRef(null);
  const canvasDiv = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;

    if (inpData !== null) {
      let Mesh = convertInpDataToMesh(inpData, canvas.height, canvas.width)
      dispatch(setMesh({ Mesh: Mesh }));
    }

  }, [inpData]);


  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Mesh && nodesTemperature) {
        const div = canvasDiv.current;
        drawTemperatureMap(Mesh, nodesTemperature, inpData, blocksVisibility, canvasRef.current, div)
      }

      if (Mesh && gridVisible) {

        drawMesh(Mesh, canvasRef.current);

      }

    }


  }, [Mesh, gridVisible, blocksVisibility, nodesTemperature]);


  const canStartComputing = computingStatus == "ready" || computingStatus == "computed";

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

  const onBlockDensityChange = (event) => {
    const sectionName = event.target.getAttribute('data-section-name');
    dispatch(setBlockDensity({ event: event.target.value, sectionName: sectionName }))
  };

  const onBlockSpecificHeatChange = (event) => {
    const sectionName = event.target.getAttribute('data-section-name');
    dispatch(setBlockSpecificHeat({ event: event.target.value, sectionName: sectionName }))
  };


  const onBCTemperatureChange = (event) => {
    const bcName = event.target.getAttribute('data-bc-name');
    dispatch(setBCTemperature({ event: event.target.value, bcName: bcName }))
  };



  const toggleBlock = (event) => {
    const sectionName = event.target.getAttribute('data-section-name');
    dispatch(toggleBlockVisibility({ sectionName: sectionName }))
  }


  const hintClick = () => {
    dispatch(toggleHint())
  }
  const uploadClick = () => {
    dispatch(toggleUpload())
  }

  const LoadFromLibraryClick = () => {
    dispatch(toggleShowLoadFromLibrary())
  }

  const confirmUpload = (file) => {
    dispatch(setcomputingStatus({ status: "loading" }))
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        var text = e.target.result;
        let inpData = parseInpText(text);
        checkInpDataForHeatTransfer(inpData);
        dispatch(saveInpData({ data: inpData }));
        dispatch(setcomputingStatus({ status: "ready" }))
      }
      catch (error) {
        console.error(error);
        setErrorPopup({ title: "Error parsing *.inp file", text: error.message });
        dispatch(setcomputingStatus({ status: "waiting" }))
      }
      dispatch(toggleUpload());
    };
    reader.readAsText(file);
  }


  const changeProblemState = (event) => {


    dispatch(setHeatStateType({ type: event.target.checked === true ? "transitive" : "steady" }))
  }

  const confirmChooseFromLibrary = async (filePath) => {
    dispatch(toggleShowLoadFromLibrary());
    dispatch(setcomputingStatus({ status: "loading" }))

    const getFile = async (filePath) => {

      let retData;

      await fetch(filePath)
        .then(response => response.text())
        .then(data => {
          retData = data
        });

      return retData
    }

    let text = await getFile(filePath);
    setTimeout(() => {
      try {
        let inpData = parseInpText(text);
        checkInpDataForHeatTransfer(inpData);
        dispatch(saveInpData({ data: inpData }));
        dispatch(setcomputingStatus({ status: "ready" }))
      }
      catch (error) {
        console.error(error);
        setErrorPopup({ title: "Error parsing *.inp file", text: error.message });
        dispatch(setcomputingStatus({ status: "waiting" }))
      }
    }, 100);
  }

  const toggleGrid = () => {
    dispatch(toggleGridVisibility())
  }

  const closeError = () => {
    setErrorPopup(null);
  }


  const startComputing = () => {
    dispatch(setcomputingStatus({ status: "computing" }))

    setTimeout(() => {
      try {
        const start = performance.now();

        let temperatures;

        if(state_type == "transitive"){
          let temperatureFrames = computeTransitive(inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_specific_heat);

          console.log(temperatureFrames);

          temperatures = temperatureFrames[temperatureFrames.length-1];
        }
        else{
          temperatures = computeSteadyState(inpData, temperature_BC, blocks_termal_conductivity);
        }

        const end = performance.now();
        console.log("Solved in " + (end - start).toString() + " milliseconds.");


        dispatch(setNodesTemperature({ nodesTemperature: temperatures }));
      }
      catch (error) {
        console.error(error);
        setErrorPopup({ title: "Error computing", text: error.message });
      }
      dispatch(setcomputingStatus({ status: "computed" }))
    }, 100)
  }

  const canChangeSectionsSettings = computingStatus != "waiting" && inpData !== null;
  const canChangeBC = computingStatus != "waiting" && inpData !== null;
  const canChangeGridVisibility = Boolean(Mesh);

  const stateSwitcher =
    <div className="row">
      <div className="col">
        Steady-state
      </div>
      <div className="col">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" disabled={!canStartComputing} onChange={changeProblemState} />
        </div>
      </div>
      <div className="col">
        Transitive
      </div>
    </div>

  let gridSettingsButton = !canChangeGridVisibility ? <></> : (gridVisible ?
    <div className='p-2'>
      <button onClick={toggleGrid} className='btn btn-secondary'>Hide mesh</button>
    </div> :
    <div className='p-2'>
      <button onClick={toggleGrid} className='btn btn-primary'>Show mesh</button>
    </div>)

  let blocksSettings = !canChangeSectionsSettings ?
    <div className='p-2'>
      <div className="row">
        <div className="col alert alert-info">
          To change settings, first upload the file
        </div>
      </div>
    </div> : <>
      {inpData.problemData[0].sections.map((section) => {



        let block_visibility = !blocksVisibility[section.name]
        let block_termal_conductivity = blocks_termal_conductivity[section.name];
        let block_specific_heat = blocks_specific_heat[section.name];
        let block_density = blocks_density[section.name];
        let Button = block_visibility ? <button onClick={toggleBlock} data-section-name={section.name} className='btn btn-success'><nobr data-section-name={section.name}>Show</nobr></button> :
          <button onClick={toggleBlock} data-section-name={section.name} className='btn btn-danger'><nobr data-section-name={section.name}>Hide</nobr></button>


        let transitivePart = state_type == "transitive" ? <>
          <div className='p-2 form-group row'>
            <div className="row">
              <div className='col'>
                &rho;
              </div>
              <div className="col">
                <input data-section-name={section.name} min={0} value={block_density} onChange={onBlockDensityChange} type='number' className={'form-control ' + style.inputMinSize}></input>
              </div>
              <div className='col'>
                <label>kg/m<sup>3</sup></label>
              </div>
            </div>
          </div>
          <div className='p-2 form-group row'>
            <div className="row">
              <div className='col'>
                <label>C</label>
              </div>
              <div className="col">
                <input data-section-name={section.name} min={0} value={block_specific_heat} onChange={onBlockSpecificHeatChange} type='number' className={'form-control ' + style.inputMinSize}></input>
              </div>
              <div className='col'>
                <label>J/°С</label>
              </div>
            </div>
          </div>
        </> :
          <></>

        return <>
          <div className='p-2' key={section.name}>
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
              <div className='col'>
                <label>P</label>
              </div>
              <div className="col">
                <input data-section-name={section.name} min={0} value={block_termal_conductivity} onChange={onBlockConductivityChange} type='number' className={'form-control ' + style.inputMinSize}></input>
              </div>
              <div className='col'>
                <label>W/mK</label>
              </div>
            </div>
          </div>
          {transitivePart}
        </>
      }
      )}</>


  const BCeditor = !canChangeBC ?
    <></> :
    <>
      {temperature_BC.map((boundary) => {

        return <div className='p-2 form-group' key={boundary.name}>
          <div className="row">
            <div className='col'>
              <label>{boundary.name}:</label>
            </div>
            <div className="col">
              <input min={0} data-bc-name={boundary.name} value={boundary.temperature} onChange={onBCTemperatureChange} type='number' className={'form-control ' + style.inputMinSize}></input>
            </div>
            <div className="col">
              &deg;C
            </div>
          </div>
        </div>

      })}
    </>



  const hint_component = hint_status ? <HintComponent cancelAction={hintClick}></HintComponent> : <></>
  const upload_component = upload_status ? <UploadComponent inpLibraryAction={LoadFromLibraryClick} confirmAction={confirmUpload} fileType="*.inp" cancelAction={uploadClick}></UploadComponent> : <></>
  const load_from_library_component = show_load_from_library ? <LoadFromLibrary confirmAction={confirmChooseFromLibrary} cancelAction={LoadFromLibraryClick}></LoadFromLibrary> : <></>
  const error_component = errorPopup ? <ErrorPopup closeAction={closeError} title={errorPopup.title} text={errorPopup.text}></ErrorPopup> : <></>


  return (
    <div className="container-lg mt-3">
      <h1>{state_type == "steady" ? "Steady-state" : "Transitive"} heat transfer</h1>
      {hint_component}
      {upload_component}
      {load_from_library_component}
      {error_component}
      <div ref={canvasDiv} className={style.scrollable}>
        <canvas id="canvas" width={1200} height={500} ref={canvasRef} className={cnvStyle.crosshairCursor}></canvas>
      </div>
      <div className='d-flex align-items-baseline'>
        <div className='p-2 d-flex flex-column col-3'>
          <div className='p-2'>
            Сhange thermal conductivity coefficient
          </div>

          {blocksSettings}

        </div>
        <div className='p-2 d-flex flex-column col-3'>
          <div className='p-2'>
            Change temperature
          </div>
          {BCeditor}
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
            {stateSwitcher}
          </div>
          <div className='p-2'>
            <button disabled={!canStartComputing} onClick={startComputing} className='btn btn-lg btn-primary'>Start</button>
          </div>
          {gridSettingsButton}
        </div>

      </div>
    </div>
  );
}

export default App;
