import { addDoc, collection, getDocs } from "firebase/firestore";
import firestore from "../firestoreConfig";
import { storage } from "../firestoreConfig";
import { getDownloadURL, ref } from "firebase/storage";

export interface BaseRep{
    name: string;
    img?: string;
    description: string;
}

export interface Rep extends BaseRep{
    id: string;
}

export class RepProvider{
    private static storage_name = "demonstrations";
    private static isRep(rep: unknown): rep is BaseRep{
        if(rep === null || typeof rep !== "object") return false;

        if("name" in rep && typeof rep.name === "string")
            if("description" in rep && typeof rep.description === "string")
                return true;

        return false;
    }

    private static async getAllReps(): Promise<Rep[]>{
        const doc = await getDocs(collection(firestore, "Reps"));

        const reps: Rep[] = doc.docs
            .filter(doc => RepProvider.isRep(doc.data()))
            .map(
                doc => {
                    return {
                        ...doc.data(),
                        id: doc.id
                    }
                }
            ) as Rep[];

        return reps;
    }

    static async getRepById(id: string): Promise<Rep | undefined>{
        const reps = await RepProvider.getAllReps();

        return reps.find(rep => rep.id === id);
    }

    static async getReps(): Promise<Rep[]>{
        return await RepProvider.getAllReps();
    }

    static async getDemonstrationDownloadUrl(img: string){
        return await getDownloadURL(ref(storage, img));
    }
}

export default RepProvider;