import { createSlice } from '@reduxjs/toolkit'
import produce from 'immer';

const valuesSlice = createSlice({
  name: 'values',
  initialState: {
    heat_transfer_status_text: "Steady-state",
    show_hint: false,
    show_upload: false,
    blocks_visibility: {},
    blocks_termal_conductivity: {},
    temperature_BC: [],
    computingStatus: "waiting",
    inpData: null
  },
  reducers: {
    setHeatTranserStatus: (state, action) => {
      state.heat_transfer_status_text = action.payload.text
    },
    setcomputingStatus: (state, action) => {
      state.computingStatus = action.payload.status
    },
    setBlockTermalConductivity: (state, action) => {
      const sectionName = action.payload.sectionName
      const value = action.payload.value
      return {
        ...state,
        blocks_termal_conductivity: {
          ...state.blocks_termal_conductivity,
          [sectionName]: value
        }
      };
    },
    toggleHint: (state, action) => {
      state.show_hint = !state.show_hint 
    },
    toggleUpload: (state, action) => {
      state.show_upload = !state.show_upload 
    },
    toggleBlockVisibility: (state, action) => {
      let blocks_visibility = state.blocks_visibility;
      const sectionName = action.payload.sectionName
      return {
        ...state,
        blocks_visibility: {
          ...state.blocks_visibility,
          [sectionName]: !blocks_visibility[sectionName]
        }
      };
    },
    saveInpData: (state, action) => {
      state.inpData = action.payload.data
      state.blocks_visibility = []

      state.blocks_visibility = []
      state.blocks_termal_conductivity = []
      state.inpData.problemData[0].sections.forEach( section => {
        state.blocks_visibility[section.name] = true

        
        let material = state.inpData.materials.find((material) => material.name == section.material)

        if(material){
          state.blocks_termal_conductivity[section.name] = material.conductivity
        }
        else{
          state.blocks_termal_conductivity[section.name] = 0
        }
        

      });
      state.temperature_BC = [];
      state.inpData.steps[0].boundaries.temperature.forEach(bc => {
        state.temperature_BC.push(bc)
      });
    },
    setBCTemperature: (state, action) => {

      return produce(state, draftState => {
        const bcName = action.payload.bcName;
        const value = action.payload.value;
        
        const boundaryIndex = draftState.temperature_BC.findIndex(
          boundary => boundary.name === bcName
        );

        if (boundaryIndex !== -1) {
          draftState.temperature_BC[boundaryIndex].temperature = value;
        }

      });
    },
  },
})

export const { toggleHint,setHeatTranserStatus, toggleUpload,
  toggleBlockVisibility, setBlockTermalConductivity,
  setBCTemperature,
  saveInpData, setcomputingStatus } = valuesSlice.actions

export default valuesSlice.reducer