import { createSlice } from '@reduxjs/toolkit'

const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        mesh: null
    },
    reducers: {
        setMesh: (state, action) => {
            state.mesh = action.payload.Mesh
        }
    }
});

export const {setMesh} = canvasSlice.actions;

export default canvasSlice.reducer