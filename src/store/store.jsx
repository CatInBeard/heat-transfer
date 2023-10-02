import { configureStore } from '@reduxjs/toolkit'
import valuesSlice from './reducers/values.jsx'

export default configureStore({
  reducer: {
    values: valuesSlice,
  },
})