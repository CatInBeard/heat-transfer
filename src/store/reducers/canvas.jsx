import { createSlice } from '@reduxjs/toolkit'

const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        mesh: null,
        gridVisible: true,
        nodesTemperature: null
    },
    reducers: {
        setMesh: (state, action) => {
            state.mesh = action.payload.Mesh
        },
        setNodesTemperature: (state, action) => {
            state.nodesTemperature = action.payload.nodesTemperature
        },
        toggleGridVisibility: (state, action) => {
            state.gridVisible = !state.gridVisible
        }
    }
});

export const {setMesh, toggleGridVisibility, setNodesTemperature} = canvasSlice.actions;

export default canvasSlice.reducer