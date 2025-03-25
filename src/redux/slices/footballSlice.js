import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    teams: [],
    loading: false,
    error: null,
};


const footballSlice = createSlice({
    name: 'football',
    initialState,
    reducers: {
        setTeams: (state, action) => {
            state.teams = action.payload;
        },
        addTeam: (state, action) => {
            state.teams.push(action.payload);
        },
        updateTeam: (state, action) => {
            const updatedTeam = action.payload;
            const index = state.teams.findIndex((team) => team.id === updatedTeam.id);
            if (index !== -1) {
                state.teams[index] = updatedTeam;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setTeams, addTeam, updateTeam,
    setLoading, setError } = footballSlice.actions;

export const fetchFootballData = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get('http://localhost:4000/football-data');
        dispatch(setTeams(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export default footballSlice.reducer;
