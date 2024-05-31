import { createSlice } from "@reduxjs/toolkit";
import {Campaign} from "../providers/campaignProvider";

interface CampaignDataState {
    campaignData: Campaign[];
    isLoading: boolean;
}

const initialState: CampaignDataState = {
    campaignData: [],
    isLoading: false
};

export const campaignDataSlice = createSlice({
    name: "campaignData",
    initialState,
    reducers: {
        setCampaignData: (state, action) => {
            state.campaignData = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setCampaignData, setLoading } = campaignDataSlice.actions;

export default campaignDataSlice.reducer;