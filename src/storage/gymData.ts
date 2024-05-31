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
    name: "gymData",
    initialState: {
        value: false,
        
    },
    reducers: {
        setGymData: (state, action) => {

        }
    }
});

export const { } = darkModeSlice.actions;

export default darkModeSlice.reducer;