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
import ExpressionHelpComponent from "./components/ExpressionHelpComponent.jsx"
import UploadComponent from './components/UploadComponent.jsx';
import { parseInpText, checkInpDataForHeatTransfer } from './inpParse';
import style from "./App.module.css"
import cnvStyle from "./canvas.module.css"
import ErrorPopup from "./components/ErrorPopup.jsx"
import { convertInpDataToMesh } from "./mesh"
import { setMesh, toggleGridVisibility, setNodesTemperature } from "./store/reducers/canvas.jsx"
import { drawMesh, drawTemperatureMap, findMinMax, hilightBC } from './draw';
import LoadFromLibrary from "./components/LoadFromLibrary.jsx"
import UploadCsvComponent from "./components/uploadCsvComponent.jsx"
import InsertCsvTableComponent from "./components/insertCsvTableComponent.jsx"
import LoadBCFromLibrary from "./components/LoadBCFromLibrary.jsx"
import StatusComponent from './components/StatusComponent.jsx';
import TransitivePlayerComponent from './components/TransitivePlayerComponent.jsx';
import TransitiveTableSwitcher from './components/TransitiveTableSwitch.jsx';
import GridSettingsButton from './components/GridSettingsButton.jsx';
import StartButton from './components/StartButton.jsx';
import StateSwitcher from './components/StateSwitcher.jsx';
import ComputingStatus from './components/ComputingStatus.jsx';
import InpLoaderButton from './components/InpLoaderButton.jsx';
import TransitiveSettings from './components/TransitiveSettings.jsx';
import BCEditor from './components/BCEditor.jsx';
import SectionSettings from './components/SectionSettings.jsx';
import NeedUploadHint from './components/NeedUploadHint.jsx';
import TransitiveSolverMethodSwitcher from './components/TransitiveSolverMethodSwitch.jsx';
import MethodHelpComponent from './components/MethodHelpComponent.jsx';
import PreStepTransitive from './components/PreStepTransitive.jsx';
import PreStepHelpComponent from './components/PreStepHelpComponent.jsx';
import { cloneDeep } from 'lodash';
import ExportButton from './components/ExportButton.jsx';
import DataExportDialog from './components/DataExportDialog.jsx';

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


  const [show_load_bc_from_library, set_show_load_bc_from_library] = useState(false)
  const [errorPopup, setErrorPopup] = useState(null);
  const [transitiveProgress, setTransitiveProgress] = useState(0);
  const [initialTemp, setInitialTemp] = useState(0);
  const [stepIncrement, setStepIncrement] = useState(0.1);
  const [steps, setSteps] = useState(100);
  const [elementsCount, setElementsCount] = useState(0);
  const [nodesCount, setNodesCount] = useState(0);
  const [expressionHelpStatus, setExpressionHelpStatus] = useState(false);
  const [useCSVTable, setUseCSVTable] = useState(false);
  const [uploadCSVTableBCName, setuploadCSVTableBCName] = useState(false);
  const [csvTableInsertBCName, setCsvTableInsertBCName] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerFrame, setPlayerFrame] = useState(0);
  const [playerInterval, setPlayerInterval] = useState(0);
  const [BCHilight, setBCHilight] = useState(false);

  const [minT, setMinT] = useState(0);
  const [maxT, setMaxT] = useState(0);


  const [MaxFrames, setMaxFrames] = useState(0);
  const [preDrawFrames, setPreDrawFrames] = useState([])

  const [transitiveMethod, setTransitiveMethod] = useState("forward")
  const [methodHelpStatus, setMethodHelpStatus] = useState(false);
  const [preStepHelpStatus, setPreStepHelpStatus] = useState(false);
  const [usePreStep, setUsePreStep] = useState(false);
  const [useAverageTemp, setUseAverageTemp] = useState(true);

  const [preStepIncrement, setPreStepIncrement] = useState(10000);
  const [preStepSteps, setPreStepSteps] = useState(5);
  const [preStepCustomBC, setPreStepCustomBC] = useState([]);

  const [exportStatus, setExportStatus] = useState(false);

  const canvasRef = useRef(null);
  const canvasDiv = useRef(null);


  const isTransitive = state_type === "transitive"

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

        if (preDrawFrames.length === 0) {
          drawTemperatureMap(Mesh, nodesTemperature, inpData, blocksVisibility, canvasRef.current, div)
        } else {
          drawTemperatureMap(Mesh, preDrawFrames[playerFrame], inpData, blocksVisibility, canvasRef.current, div, minT, maxT)
        }
      }

      if (Mesh && gridVisible) {

        drawMesh(Mesh, canvasRef.current);

      }

      if (Mesh && BCHilight) {
        hilightBC(inpData, Mesh, canvasRef.current, BCHilight)
      }
    }


  }, [Mesh, gridVisible, blocksVisibility, nodesTemperature, preDrawFrames, playerFrame, BCHilight]);


  const toggle_bc_librabry = () => {
    if (show_load_bc_from_library == false) {
      set_show_load_bc_from_library(uploadCSVTableBCName);
    }
    else {
      set_show_load_bc_from_library(false);
    }
  }

  const OnExpressionHelp = () => {
    setExpressionHelpStatus(!expressionHelpStatus)
  }

  const OnMethodHelp = () => {
    setMethodHelpStatus(!methodHelpStatus)
  }

  const OnPreStepHelp = () => {
    setPreStepHelpStatus(!preStepHelpStatus)
  }

  const openCSVUpload = (event) => {
    let bcName = event.target.getAttribute('data-bc-name');
    setuploadCSVTableBCName(bcName)
  }

  const openCsvTableInsert = (event) => {
    let bcName = event.target.getAttribute('data-bc-name');
    setCsvTableInsertBCName(bcName)
  }

  const closeCsvUpload = () => {
    setuploadCSVTableBCName(null)
  }

  const closeCsvTableInsert = () => {
    setCsvTableInsertBCName(null)
  }

  const onFocusBc = (event) => {
    let bcName = event.target.getAttribute('data-bc-name');
    setBCHilight(bcName)
  }

  const onBlurBC = () => {
    setBCHilight(false)
  }

  const toggleExportDialog = () => {
    setExportStatus(!exportStatus)
  }

  const uploadCSV = (file) => {

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        var text = e.target.result;
        dispatch(setBCTemperature({ event: text, bcName: uploadCSVTableBCName }))
      }
      catch (error) {
        console.error(error);
        setErrorPopup({ title: "Error parsing *.csv file", text: error.message });
      }


      closeCsvUpload()
    };
    reader.readAsText(file);


  }

  const insertTable = (data) => {
    let text = data.map((row) => {
      return row.join(", ")
    }).filter((line) => line !== "" && line !== ", ").join("\n");
    dispatch(setBCTemperature({ event: text, bcName: csvTableInsertBCName }))
    closeCsvTableInsert()
  }

  const tryCsvTextToArray = (text) => {
    const defaultValue = [["", ""]];
    try {
      const rows = text.split('\n');
      if (rows.length === 0) {
        return defaultValue;
      }
      const data = rows.map(row => {
        const columns = row.split(',').map((col) => parseFloat(col));
        if (columns.length !== 2) {
          return defaultValue;
        }
        return columns;
      });
      data.push(["", ""])
      return data;
    } catch (error) {
      console.warn(error)
      return defaultValue;
    }
  }

  const getBCInitialData = () => {
    let BCText = temperature_BC.find((BC) => BC.name == csvTableInsertBCName).temperature
    return tryCsvTextToArray(BCText)
  }

  const togglePlaying = () => {
    if (computingStatus == "computed") {
      setIsPlaying(!isPlaying)
      if (!isPlaying) {

        let i = 0;
        const intervalId = setInterval(() => {

          setPlayerFrame(i);
          i++;

          if (i >= MaxFrames) {
            clearInterval(intervalId);
            setIsPlaying(false)
          }
        }, 100);
        setPlayerInterval(intervalId)

      }
      else {
        clearInterval(playerInterval)
      }
    }
  }

  const onNextFrameClick = () => {
    if (playerFrame + 2 > MaxFrames || computingStatus != "computed") {
      return
    }
    setPlayerFrame(playerFrame + 1)
  }
  const onPrevFrameClick = () => {
    if (playerFrame - 1 < 0 || computingStatus != "computed") {
      return
    }
    setPlayerFrame(playerFrame - 1)
  }

  const updateFrameFromRange = (event) => {
    setPlayerFrame(event.target.value)
  }

  const canStartComputing = computingStatus == "ready" || computingStatus == "computed";


  const transitivePlayer = isTransitive ?
    <TransitivePlayerComponent onPrevFrameClick={onPrevFrameClick} togglePlaying={togglePlaying} onNextFrameClick={onNextFrameClick} clickable={computingStatus == "computed"} updateFrameFromRange={updateFrameFromRange} playerFrame={playerFrame} MaxFrames={MaxFrames} isPlaying={isPlaying} />
    : <></>

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
    setPreDrawFrames([]);
    dispatch(setcomputingStatus({ status: "loading" }))
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        var text = e.target.result;
        let inpData = parseInpText(text);
        setElementsCount(inpData.problemData[0].elements.length);
        setNodesCount(inpData.problemData[0].nodes.length);
        checkInpDataForHeatTransfer(inpData);
        dispatch(saveInpData({ data: inpData }));
        setPreStepCustomBC(cloneDeep(inpData.steps[0].boundaries.temperature))
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

    const newState = isTransitive ? "steady" : "transitive";

    dispatch(setHeatStateType({ type: newState }))
  }

  const changeUseCsvTable = (event) => {
    setUseCSVTable(!useCSVTable);
  }

  const confirmChooseFromLibrary = async (filePath) => {
    dispatch(toggleShowLoadFromLibrary());
    setPreDrawFrames([]);
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
        setPreStepCustomBC(cloneDeep(inpData.steps[0].boundaries.temperature))
        setElementsCount(inpData.problemData[0].elements.length);
        setNodesCount(inpData.problemData[0].nodes.length);
        dispatch(setcomputingStatus({ status: "ready" }))
      }
      catch (error) {
        console.error(error);
        setErrorPopup({ title: "Error parsing *.inp file", text: error.message });
        dispatch(setcomputingStatus({ status: "waiting" }))
      }
    }, 100);
  }

  const confirmChooseBCFromLibrary = async (filePath) => {

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
        dispatch(setBCTemperature({ event: text, bcName: show_load_bc_from_library }))
      }
      catch (error) {
        console.error(error);
        setErrorPopup({ title: "Error getting *.csv file", text: error.message });
      }
      set_show_load_bc_from_library(false);
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
    setPreDrawFrames([]);

    setTimeout(() => {
      try {
        const start = performance.now();

        let temperatures;

        if (isTransitive) {

          setMaxFrames(parseFloat(steps) + 1);
          setTransitiveProgress(0)
          setPlayerFrame(0)

          let counter = 0;

          setPreDrawFrames([])

          const transitiveWorker = new Worker(new URL("./computeTransitiveWorker.ts", import.meta.url));

          transitiveWorker.postMessage({ inpData: inpData, temperature_BC: temperature_BC, blocks_termal_conductivity: blocks_termal_conductivity, blocks_density: blocks_density, blocks_specific_heat: blocks_specific_heat, initialTemp: initialTemp, stepIncrement: stepIncrement, steps: steps, method: transitiveMethod, usePreStep: usePreStep, useAverageTemp: useAverageTemp, preStepSteps: preStepSteps, preStepIncrement: preStepIncrement, preStepBC:preStepCustomBC });

          transitiveWorker.onmessage = function (event) {
            if (event.data.action == "done") {
              let temperatureFrames = event.data.result;
              temperatures = temperatureFrames[temperatureFrames.length - 1];
              const end = performance.now();
              console.log("Solved in " + (end - start).toString() + " milliseconds.");
              console.log(JSON.stringify(temperatureFrames))
              setPreDrawFrames(temperatureFrames)

              let { min, max } = findMinMax(temperatureFrames)

              setMinT(min)
              setMaxT(max)

              dispatch(setNodesTemperature({ nodesTemperature: temperatures }));
              dispatch(setcomputingStatus({ status: "computed" }))
              transitiveWorker.terminate();

            }
            else if (event.data.action == "progress") {
              let progress = event.data.result;
              counter++
              setPlayerFrame(counter)
              dispatch(setNodesTemperature({ nodesTemperature: event.data.temp }));
              console.log("progress:" + progress.toFixed(2) + "%")
              setTransitiveProgress(progress.toFixed(2))
            }
            else if (event.data.action == "progress_preStep") {
              let progress = event.data.result;
              console.log("Pre-step progress:" + progress.toFixed(2) + "%")
            }
            else if (event.data.action == "error") {
              let error = event.data.result;
              console.error(error);
              setErrorPopup({ title: "Error computing", text: error.message });
              dispatch(setcomputingStatus({ status: "ready" }))
              transitiveWorker.terminate();
            }
          };

        }
        else {
          const steadyWorker = new Worker(new URL("./computeSteadyWorker.ts", import.meta.url));

          steadyWorker.postMessage({ inpData: inpData, temperature_BC: temperature_BC, blocks_termal_conductivity: blocks_termal_conductivity });

          steadyWorker.onmessage = function (event) {
            if (event.data.action == "done") {
              let temperatures = event.data.result;
              const end = performance.now();
              console.log("Solved in " + (end - start).toString() + " milliseconds.");
              dispatch(setNodesTemperature({ nodesTemperature: temperatures }));
              dispatch(setcomputingStatus({ status: "computed" }))
              setPreDrawFrames([temperatures])
              steadyWorker.terminate();
            }
            else if (event.data.action == "error") {
              let error = event.data.result;
              console.error(error);
              setErrorPopup({ title: "Error computing", text: error.message });
              dispatch(setcomputingStatus({ status: "ready" }))
              steadyWorker.terminate();
            }
          };
        }
      }
      catch (error) {
        console.error(error);
        setErrorPopup({ title: "Error computing", text: error.message });
      }
    }, 100)
  }

  const canChangeSectionsSettings = computingStatus != "waiting" && inpData !== null;
  const canChangeBC = computingStatus != "waiting" && inpData !== null;
  const canChangeGridVisibility = Boolean(Mesh);
  const canExport = computingStatus === "computed"


  const onInitialTChange = (event) => {
    setInitialTemp(event.target.value)
  }
  const onStepIncrementChange = (event) => {
    setStepIncrement(event.target.value)
  }
  const onStepsChange = (event) => {
    setSteps(event.target.value)
  }


  return (
    <div className="container-lg mt-3">
      <header>
        <h1>{!isTransitive ? "Steady-state" : "Transitive"} heat transfer</h1>
      </header>
      <main>
        {expressionHelpStatus && <ExpressionHelpComponent cancelAction={OnExpressionHelp}></ExpressionHelpComponent>}
        {methodHelpStatus && <MethodHelpComponent cancelAction={OnMethodHelp}></MethodHelpComponent>}
        {preStepHelpStatus && <PreStepHelpComponent cancelAction={OnPreStepHelp} />}
        {uploadCSVTableBCName && <UploadCsvComponent libraryAction={toggle_bc_librabry} confirmAction={uploadCSV} cancelAction={closeCsvUpload} />}
        {csvTableInsertBCName && <InsertCsvTableComponent confirmAction={insertTable} cancelAction={closeCsvTableInsert} initialData={getBCInitialData()} />}
        {hint_status && <HintComponent cancelAction={hintClick}></HintComponent>}
        {upload_status && <UploadComponent inpLibraryAction={LoadFromLibraryClick} confirmAction={confirmUpload} fileType="*.inp" cancelAction={uploadClick} />}
        {show_load_from_library && <LoadFromLibrary confirmAction={confirmChooseFromLibrary} cancelAction={LoadFromLibraryClick}></LoadFromLibrary>}
        {show_load_bc_from_library && <LoadBCFromLibrary confirmAction={confirmChooseBCFromLibrary} cancelAction={toggle_bc_librabry}></LoadBCFromLibrary>}
        {errorPopup && <ErrorPopup closeAction={closeError} title={errorPopup.title} text={errorPopup.text}></ErrorPopup>}
        <div ref={canvasDiv} className={style.scrollable}>
          <canvas id="canvas" width={1200} height={500} ref={canvasRef} className={cnvStyle.crosshairCursor}></canvas>
        </div>
        {transitivePlayer}
        <div className='d-flex align-items-baseline'>
          <div className='p-2 d-flex flex-column col-3'>
            <div className='p-2'>
              Сhange thermal conductivity coefficient
            </div>

            {!canChangeSectionsSettings && <NeedUploadHint />}
            {canChangeSectionsSettings && <SectionSettings inpData={inpData} blocksVisibility={blocksVisibility} blocks_termal_conductivity={blocks_termal_conductivity} blocks_specific_heat={blocks_specific_heat} blocks_density={blocks_density} toggleBlock={toggleBlock} isTransitive={isTransitive} onBlockDensityChange={onBlockDensityChange} onBlockSpecificHeatChange={onBlockSpecificHeatChange} onBlockConductivityChange={onBlockConductivityChange} />}

          </div>
          <div className='p-2 d-flex flex-column col-3'>
            <div className='p-2'>
              Change temperature
            </div>
            {canChangeBC && <BCEditor temperature_BC={temperature_BC} useCSVTable={useCSVTable} onFocusBc={onFocusBc} onBlurBC={onBlurBC} onBCTemperatureChange={onBCTemperatureChange} openCSVUpload={openCSVUpload} openCsvTableInsert={openCsvTableInsert} isTransitive={isTransitive} OnExpressionHelp={OnExpressionHelp} />}
            {isTransitive && <TransitiveSettings usePreStep={usePreStep} initialTemp={initialTemp} onInitialTChange={onInitialTChange} stepIncrement={stepIncrement} onStepIncrementChange={onStepIncrementChange} steps={steps} onStepsChange={onStepsChange} />}
          </div>
          <div className='p-2 d-flex flex-column'>
            <InpLoaderButton uploadClick={uploadClick} hintClick={hintClick} />
            <ComputingStatus computingStatus={computingStatus} state_type={state_type} transitiveProgress={transitiveProgress} />
            <StatusComponent inpData={inpData} nodesCount={nodesCount} elementsCount={elementsCount} />
            <div className='p-2'>
              <StateSwitcher isTransitive={isTransitive} canStartComputing={canStartComputing} changeProblemState={changeProblemState} />
            </div>
            <StartButton canStartComputing={canStartComputing} startComputing={startComputing} />
            <GridSettingsButton canChangeGridVisibility={canChangeGridVisibility} toggleGrid={toggleGrid} gridVisible={gridVisible} />
            {isTransitive && <TransitiveTableSwitcher useCSVTable={useCSVTable} changeUseCsvTable={changeUseCsvTable} />}
            {isTransitive && <TransitiveSolverMethodSwitcher OnMethodHelp={OnMethodHelp} transitiveMethod={transitiveMethod} changeTransitiveMethod={setTransitiveMethod} />}
            {isTransitive && <PreStepTransitive usePreStep={usePreStep} setUsePreStep={setUsePreStep} OnPreStepHelp={OnPreStepHelp} preStepIncrement={preStepIncrement} preStepSteps={preStepSteps} setPreStepSteps={setPreStepSteps} setPreStepIncrement={setPreStepIncrement} useAverageTemp={useAverageTemp} setUseAverageTemp={setUseAverageTemp} preStepCustomBC={preStepCustomBC} setPreStepCustomBC={setPreStepCustomBC} onBlurBC={onBlurBC} onFocusBc={onFocusBc} />}
            <ExportButton canExport={canExport} openExport={toggleExportDialog}/>
            {exportStatus && <DataExportDialog cancelAction={toggleExportDialog} temperatures={preDrawFrames} increment={stepIncrement}/>}
          </div>

        </div>
      </main>
      <footer className='border-top p-2'>
        <a className='text-muted' target="_blank" href='https://github.com/CatInBeard/heat-transfer/'>Get source code</a>
      </footer>
    </div>
  );
}

export default App;
