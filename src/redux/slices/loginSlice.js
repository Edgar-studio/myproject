import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { notify } from "../../utils/notify.js";

// Async thunk for user login
export const loginUser = createAsyncThunk(
    "login/loginUser",
    async ({ email, password, rememberMe }, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:4000/users");
            const users = response.data;
            const user = users.find(user => user.email === email && user.password === password);
            localStorage.setItem("token", user.username);


                window.location.reload();

            if (user) {
                if (rememberMe) {
                    localStorage.setItem("rememberMe", JSON.stringify(user));
                } else {
                    localStorage.removeItem("rememberMe");
                }
                return user;
            }
            else {
                notify("Invalid email or password.", "red");
                return rejectWithValue("Invalid email or password.");
            }
        } catch (err) {
            console.error("Login failed:", err.message);
            notify("Login failed. Please try again.", "red");
            return rejectWithValue("Login failed. Please try again.");
        }
    }
);

export const findUser = createAsyncThunk(
    "login/findUser",
    async ({token }, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:4000/users");
            const users = response.data;
            const user = users.find(user => user.username === token);
            return user;
        }catch (error) {
            console.log(error);
            return rejectWithValue("Login failed. Please try again.");
        }
    })

const loginSlice = createSlice({
    name: "login",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            window.location.reload();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logoutUser } = loginSlice.actions;
export default loginSlice.reducer;