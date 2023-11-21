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
    water_temperature: 273.15,
    air_temperature: 273.15,
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
    setAirTemperature: (state, action) => {
      state.air_temperature = action.payload.value
    },
    setWaterTemperature: (state, action) => {
      state.water_temperature = action.payload.value
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
    },
  },
})

export const { toggleHint,setHeatTranserStatus, toggleUpload,
  toggleBlockVisibility, setBlockTermalConductivity,
  setAirTemperature, setWaterTemperature,
  saveInpData, setcomputingStatus } = valuesSlice.actions

export default valuesSlice.reducer