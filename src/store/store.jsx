import { configureStore } from '@reduxjs/toolkit'
import valuesSlice from './reducers/values.jsx'
import canvasSlice from './reducers/canvas.jsx'

export default configureStore({
  reducer: {
    values: valuesSlice,
    canvas: canvasSlice,
  },
})