import {
    configureStore
} from "@reduxjs/toolkit";

import darkModeReducer from "./darkMode";
import loggingReducer from "./logging";
import campaignReducer from "./campaignData";

const store = configureStore({
    reducer: {
        darkModeReducer,
        loggingReducer,
        campaignReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;