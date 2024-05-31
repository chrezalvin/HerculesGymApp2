import { createSlice } from "@reduxjs/toolkit";

interface LoggingState {
    userEmail: string | null;
    isLoading: boolean;
}

const initialState: LoggingState = {
    userEmail: null,
    isLoading: false
}

export const darkModeSlice = createSlice({
    name: "logging",
    initialState,
    reducers: {
        setUserEmail: (state, action) => {
            state.userEmail = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setUserEmail, setLoading } = darkModeSlice.actions;

export default darkModeSlice.reducer;