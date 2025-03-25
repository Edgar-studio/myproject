import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./slices/registerSlice";
import loginReducer from "./slices/loginSlice.js";
import footballReducer from "../../src/redux/slices/footballSlice.js"

export const store = configureStore({
    reducer: {
        register: registerReducer,
        login: loginReducer,
        football: footballReducer,
    },
});
