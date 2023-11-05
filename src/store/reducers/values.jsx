import { createSlice } from '@reduxjs/toolkit'

const valuesSlice = createSlice({
  name: 'values',
  initialState: {
    heat_transfer_status_text: "Steady-state",
    show_hint: false
  },
  reducers: {
    setHeatTranserStatus: (state, action) => {
      console.log(action)
      state.heat_transfer_status_text = action.payload.text
    },
    toggleHint: (state, action) => {
      state.show_hint = !state.show_hint 
    },
  },
})

export const { toggleHint,setHeatTranserStatus } = valuesSlice.actions

export default valuesSlice.reducer