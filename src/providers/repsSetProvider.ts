import { DocumentReference, addDoc, collection, doc, getDoc, getDocs, where } from "firebase/firestore";
import firebase from "../firestoreConfig";
import { Rep } from "./repProvider";

export interface BaseRepsSet{
    reps: {
        duration: number,
        rep: DocumentReference
    }[]
}

export interface RepsSet extends BaseRepsSet{
    id: string;
}

export class RepsSetProvider{
    private static db_name = "repsSets";
    private static isRepsSet(repsSet: unknown): repsSet is BaseRepsSet{
        if(repsSet === null || typeof repsSet !== "object") return false;

        return "reps" in repsSet && Array.isArray(repsSet.reps);
    }

    private static async getAllRepsSet(): Promise<RepsSet[]>{
        const doc = await getDocs(collection(firebase, RepsSetProvider.db_name));
        
        const repsSet: RepsSet[] = doc.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            })
            .filter(doc => RepsSetProvider.isRepsSet(doc)) as RepsSet[];
        
        return repsSet;
    }

    static async getRepsSet(): Promise<RepsSet[]>{
        const repsSet = await RepsSetProvider.getAllRepsSet();

        return repsSet;
    }

    static async createNewRepsSet(options: {
        title: string, 
        description: string, 
        reps: DocumentReference[], 
        image?: string
    }): Promise<void>{
        await addDoc(collection(firebase, RepsSetProvider.db_name), {
            ...options
        });
    }

    static async getRepsSetById(id: string): Promise<RepsSet | undefined>{
        const res = await getDoc(doc(firebase, RepsSetProvider.db_name, id));

        console.log(res.data());

        if(!res.exists)
            return undefined;

        const data = res.data();
        if(!RepsSetProvider.isRepsSet(data))
            return undefined;

        return {
            id: res.id,
            reps: data.reps,
        } as RepsSet;
    }
}

export default RepsSetProvider;