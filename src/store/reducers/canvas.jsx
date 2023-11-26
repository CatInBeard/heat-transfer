import { createSlice } from '@reduxjs/toolkit'

const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        mesh: null,
        gridVisible: true,
    },
    reducers: {
        setMesh: (state, action) => {
            state.mesh = action.payload.Mesh
        },
        toggleGridVisibility: (state, action) => {
            state.gridVisible = !state.gridVisible
        }
    }
});

export const {setMesh, toggleGridVisibility} = canvasSlice.actions;

export default canvasSlice.reducer