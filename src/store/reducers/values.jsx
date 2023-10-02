import { createSlice } from '@reduxjs/toolkit'

const valuesSlice = createSlice({
  name: 'values',
  initialState: {
    heat_transfer_status_text: "Steady-state",
  },
  reducers: {
    setHeatTranserStatus: (state, action) => {
      state.heat_transfer_status_text += action.text
    },
  },
})

export const { setHeatTranserStatus } = valuesSlice.actions

export default valuesSlice.reducer