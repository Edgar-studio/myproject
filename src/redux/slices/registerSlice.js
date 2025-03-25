import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
    name: "register",
    initialState: {
        currentUser: null,
    },
    reducers: {
        registerUser: (state, action) => {
            state.currentUser = action.payload;
        },
        logoutUser: (state) => {
            state.currentUser = null;
        },
    },
});

export const { registerUser, logoutUser } = registerSlice.actions;
export default registerSlice.reducer;
