import { createSlice } from '@reduxjs/toolkit'

const valuesSlice = createSlice({
  name: 'values',
  initialState: {
    heat_transfer_status_text: "Steady-state",
    show_hint: false,
    show_upload: false,
    first_block_visibility: false,
    second_block_visibility: false,
    first_block_termal_conductivity: 0,
    second_block_termal_conductivity: 0,
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
    setFirstBlockTermalConductivity: (state, action) => {
      state.first_block_termal_conductivity = action.payload.value
    },
    setSecondBlockTermalConductivity: (state, action) => {
      state.second_block_termal_conductivity = action.payload.value
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
    toggleFirstBlockVisibility: (state, action) => {
      state.first_block_visibility = !state.first_block_visibility 
    },
    toggleSecondBlockVisibility: (state, action) => {
      state.second_block_visibility = !state.second_block_visibility 
    },
    saveInpData: (state, action) => {
      state.inpData = action.payload.data
    },
  },
})

export const { toggleHint,setHeatTranserStatus, toggleUpload, toggleFirstBlockVisibility,
  toggleSecondBlockVisibility, setFirstBlockTermalConductivity,
  setSecondBlockTermalConductivity, setAirTemperature, setWaterTemperature,
  saveInpData, setcomputingStatus } = valuesSlice.actions

export default valuesSlice.reducer