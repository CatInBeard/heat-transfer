import {computeTransitive} from "./computeHeatTransfer.tsx"

onmessage = function(event) {

    let inpData = event.data.inpData
    let temperature_BC = event.data.temperature_BC
    let blocks_termal_conductivity = event.data.blocks_termal_conductivity
    let blocks_density = event.data.blocks_density
    let blocks_specific_heat = event.data.blocks_specific_heat
    let initialTemp = event.data.initialTemp
    let stepIncrement = event.data.stepIncrement
    let steps = event.data.steps
    
    try{
        var result = computeTransitive(inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_specific_heat, callback, initialTemp,stepIncrement, steps);
    }
    catch(e){
        postMessage({ action: "error", result: e});    
    }
    postMessage({ action: "done", result: result});
};


const callback = (progress, data) => {
    postMessage({action: "progress", result: progress, temp: data});
}