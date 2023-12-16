import { createSlice } from '@reduxjs/toolkit'
import produce from 'immer';

const valuesSlice = createSlice({
  name: 'values',
  initialState: {
    show_hint: false,
    show_upload: false,
    blocks_visibility: {},
    blocks_termal_conductivity: {},
    blocks_specific_heat: {},
    blocks_density: {},
    temperature_BC: [],
    computingStatus: "waiting",
    inpData: null,
    show_load_from_library: false,
    state_type: "steady"
  },
  reducers: {
    setHeatStateType: (state, action) => {
      state.state_type = action.payload.type
    },
    setcomputingStatus: (state, action) => {
      state.computingStatus = action.payload.status
    },
    setBlockTermalConductivity: (state, action) => {
      const sectionName = action.payload.sectionName
      const value = action.payload.event

      return {
        ...state,
        blocks_termal_conductivity: {
          ...state.blocks_termal_conductivity,
          [sectionName]: value
        }
      };
    },
    setBlockDensity: (state, action) => {
      const sectionName = action.payload.sectionName
      const value = action.payload.event

      return {
        ...state,
        blocks_density: {
          ...state.blocks_density,
          [sectionName]: value
        }
      };
    },
    setBlockSpecificHeat: (state, action) => {
      const sectionName = action.payload.sectionName
      const value = action.payload.event

      return {
        ...state,
        blocks_specific_heat: {
          ...state.blocks_specific_heat,
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
    toggleShowLoadFromLibrary: (state, action) => {
      state.show_load_from_library = !state.show_load_from_library 

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
      state.blocks_specific_heat = []
      state.blocks_density = []
      state.inpData.problemData[0].sections.forEach( section => {
        state.blocks_visibility[section.name] = true

        
        let material = state.inpData.materials.find((material) => material.name == section.material)

        if(material){
          state.blocks_termal_conductivity[section.name] = material.conductivity
          state.blocks_specific_heat[section.name] = ( (material.density ?? 0) > 0 ) ? material.density : 0
          state.blocks_density[section.name] = ( (material.specificHeat ?? 0) > 0 ) ? material.specificHeat : 0
        }
        else{
          state.blocks_termal_conductivity[section.name] = 0
          state.blocks_specific_heat[section.name] = 0
          state.blocks_density[section.name] = 0
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
        const value = action.payload.event;
        
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

export const { toggleHint,setHeatTranserStatus, toggleUpload, toggleShowLoadFromLibrary,
  toggleBlockVisibility, setBlockTermalConductivity,
  setBCTemperature, setHeatStateType,
  saveInpData, setcomputingStatus,
  setBlockDensity, setBlockSpecificHeat  } = valuesSlice.actions

export default valuesSlice.reducer