import { createSlice } from "@reduxjs/toolkit";
import UserThemePreference from "../localStorage/userThemePreference";

import storage from "../database";

function setStorageThemePreference(newState: boolean) {
    // set the theme
    document.body.classList.toggle('dark', newState);

    // set the theme in storage
    (new UserThemePreference(storage)).setThemePreference(newState ? "dark" : "light");
}

export const darkModeSlice = createSlice({
    name: "darkMode",
    initialState: {
        value: false
    },
    reducers: {
        toggleDarkMode: state => {
            const newState = !state.value;

            state.value = newState;

            setStorageThemePreference(newState);
        },
        setDarkMode: (state, action) => {
            state.value = action.payload as boolean;
        
            setStorageThemePreference(action.payload as boolean);
        }
    }
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;