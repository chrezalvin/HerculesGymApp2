import { DocumentReference, collection, getDocs } from "firebase/firestore";
import {db} from "../firestoreConfig";

export interface BaseCampaign{
    days: DocumentReference[];
    imgPath?: string;
    name: string;
}

export interface Campaign extends BaseCampaign{
    id: string;
}

export interface TranslatedCampaign{
    days: string[];
    imgPath?: string;
    name: string;
    id: string;
}

class CampaignProvider {
    private static db_name = "campaign";

    private static isCampaign(campaign: unknown): campaign is BaseCampaign{
        return campaign !== null && typeof campaign === "object" && "days" in campaign && "name" in campaign;
    }

    static async getAllCampaigns(): Promise<Campaign[]>{
        const doc = await getDocs(collection(db, CampaignProvider.db_name));

        const campaigns: Campaign[] = doc.docs
            .filter(doc => CampaignProvider.isCampaign(doc.data()))
            .map(
                doc => {
                    return {
                        ...doc.data(),
                        id: doc.id
                    }
                }
            ) as Campaign[];

        return campaigns;
    }

    static async getCampaignById(id: string): Promise<Campaign | undefined>{
        const campaigns = await CampaignProvider.getAllCampaigns();

        return campaigns.find(campaign => campaign.id === id);
    }
}

export default CampaignProvider;