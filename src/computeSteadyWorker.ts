import { computeSteadyState } from './computeHeatTransfer';


// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

ctx.addEventListener("message", (event) => {

    let inpData = event.data.inpData
    let temperature_BC = event.data.temperature_BC
    let blocks_termal_conductivity = event.data.blocks_termal_conductivity

    let result: number[] = [];
    try {
        result = computeSteadyState(inpData, temperature_BC, blocks_termal_conductivity);
    }
    catch (e) {
        postMessage({ action: "error", result: e });
    }
    postMessage({ action: "done", result: result });
});

export default null as any;