import { computeTransitive, calculateAverageBC } from "./computeHeatTransfer"
import { cloneDeep } from 'lodash';


// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

ctx.addEventListener("message", (event) => {

    let inpData = event.data.inpData
    let temperature_BC = event.data.temperature_BC
    let blocks_termal_conductivity = event.data.blocks_termal_conductivity
    let blocks_density = event.data.blocks_density
    let blocks_specific_heat = event.data.blocks_specific_heat
    let initialTemp = event.data.initialTemp
    let stepIncrement = event.data.stepIncrement
    let steps = event.data.steps
    let method = event.data.method

    let usePreStep = event.data.usePreStep

    let result: number[][] = [];

    if (usePreStep) {

        let preStepResult: number[][] = [];

        let useAverageTemp = event.data.usePreStep
        let preStepSteps = event.data.preStepSteps
        let preStepIncrement = event.data.preStepIncrement

        let preStepBC = []
        

        if(useAverageTemp){
            preStepBC = temperature_BC.map( (BC) => {
                let averageBC = cloneDeep(BC)
                averageBC.temperature = calculateAverageBC(averageBC.temperature, 0, preStepSteps * preStepIncrement , 10)
                return averageBC
            })
        }

        try {
            preStepResult = computeTransitive(inpData, preStepBC, blocks_termal_conductivity, blocks_density, blocks_specific_heat, progress_callback_preStep, initialTemp, preStepIncrement, preStepSteps, "crank-nicolson");
            result = computeTransitive(inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_specific_heat, callback, initialTemp, stepIncrement, steps, method, preStepResult[preStepResult.length-1]);
        }
        catch (e) {
            postMessage({ action: "error", result: e });
        }
    }
    else {
        try {
            result = computeTransitive(inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_specific_heat, callback, initialTemp, stepIncrement, steps, method);
        }
        catch (e) {
            postMessage({ action: "error", result: e });
        }
    }
    postMessage({ action: "done", result: result });
});


const callback = (progress, data) => {
    postMessage({ action: "progress", result: progress, temp: data });
}

const progress_callback_preStep = (progress, data) => {
    postMessage({ action: "progress_preStep", result: progress, temp: data });
}

export default null as any;