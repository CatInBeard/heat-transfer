import { computeTransitive } from "./computeHeatTransfer.tsx"


const computeTransitiveWorker = (data, cb) => {

    const callback = (progress, data) => {
        cb({ action: "progress", result: progress, temp: data });
    }

    let inpData = data.inpData
    let temperature_BC = data.temperature_BC
    let blocks_termal_conductivity = data.blocks_termal_conductivity
    let blocks_density = data.blocks_density
    let blocks_specific_heat = data.blocks_specific_heat
    let initialTemp = data.initialTemp
    let stepIncrement = data.stepIncrement
    let steps = data.steps

    try {
        var result = computeTransitive(inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_specific_heat, callback, initialTemp, stepIncrement, steps);
    }
    catch (e) {
        cb({ action: "error", result: e });
    }
    cb({ action: "done", result: result });
};

export default computeTransitiveWorker