import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userLocation: localStorage.getItem("userLocation") ? JSON.parse(localStorage.getItem("userLocation")) : null
}

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: { // Ensure that setLocation is inside reducers
        setLocation: (state, action) => {
            state.userLocation = action.payload;
            localStorage.setItem("userLocation", JSON.stringify(action.payload));
        },
        clearLocation: (state) => {
            state.userLocation = null;
            localStorage.removeItem("userLocation");
        }
    }
});

export const { setLocation, clearLocation } = locationSlice.actions;
export const selectCurrentLocation = (state) => state.location.userLocation;
export default locationSlice.reducer;
