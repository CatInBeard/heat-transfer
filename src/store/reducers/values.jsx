import { createSlice } from '@reduxjs/toolkit'

const valuesSlice = createSlice({
  name: 'values',
  initialState: {
    heat_transfer_status_text: "Steady-state",
    show_hint: false,
    show_upload: false,
    first_block_visibility: false,
    second_block_visibility: false
  },
  reducers: {
    setHeatTranserStatus: (state, action) => {
      state.heat_transfer_status_text = action.payload.text
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
  },
})

export const { toggleHint,setHeatTranserStatus, toggleUpload, toggleFirstBlockVisibility, toggleSecondBlockVisibility } = valuesSlice.actions

export default valuesSlice.reducer