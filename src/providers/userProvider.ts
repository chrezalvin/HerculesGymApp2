import { DocumentReference, collection, doc, getDoc, getDocs, setDoc, where } from "firebase/firestore";
import {db as firebase, storage} from "../firestoreConfig";
import {auth} from "../firestoreConfig";
import {UserCredential, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface User{
    username: string;
    password: string;
    completedReps?: DocumentReference[];
    id: string;
    oldBodyImg?: string;
    newBodyImg?: string;
}

export class UserProvider{
    private static DB_NAME = "user";
    private static old_body_storage_path = "oldBody";
    private static new_body_storage_path = "newBody";

    private static isUser(user: any): user is User{
        return user.username !== undefined && user.password !== undefined;
    }

    private static async getAllUsers(): Promise<User[]>{
        const doc = await getDocs(collection(firebase, UserProvider.DB_NAME));
        
        const users: User[] = doc.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            })
            .filter(doc => UserProvider.isUser(doc)) as User[];
        
        return users;
    }

    public static async getUserById(id: string): Promise<User | undefined>{
        const res = await getDoc(doc(firebase, UserProvider.DB_NAME, id));

        if(!res.exists)
            return undefined;

        return {
            ...res.data(),
            id: res.id
        } as User;
    }

    // not secure but whatever
    static async getUser(username: string, password: string): Promise<UserCredential | undefined>{
        console.log(`username: ${username}, password: ${password}`);

        const user = await signInWithEmailAndPassword(auth, username, password);

        return user;
    }


    static async createNewUser(email: string, password: string): Promise<void>{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
    }

    static async finishRep(id: string, repid: string): Promise<void>{
        // find user and rep
        const user = await UserProvider.getUserById(id);
        const rep = await getDoc(doc(firebase, "reps", repid));

        if(!user || !rep.exists)
            throw new Error("User or rep not found");

        if(!user.completedReps?.find(rep => rep.id === repid))
            await setDoc(doc(firebase, UserProvider.DB_NAME, id), {
                completedReps: [...(user.completedReps ?? []), rep.ref]
            }, { merge: true });
    }

    static async submitOldBodyImage(username: string, blobUrl: string): Promise<void>{
        // get blob from url
        const blob = await fetch(blobUrl).then(res => res.blob());

        const storageRef = ref(storage, `${UserProvider.old_body_storage_path}/${username}`);
        await uploadBytes(storageRef, blob)

        await setDoc(doc(firebase, "user", username), {
            oldBodyImg: storageRef.fullPath
        }, {
            merge: true
        })
    }

    static async submitNewBodyImage(username: string, blobUrl: string): Promise<void>{
        // get blob from url
        const blob = await fetch(blobUrl).then(res => res.blob());

        const storageRef = ref(storage, `${UserProvider.new_body_storage_path}/${username}`);
        await uploadBytes(storageRef, blob)

        await setDoc(doc(firebase, "user", username), {
            newBodyImg: storageRef.fullPath
        }, {
            merge: true
        })
    }

    static async getUserOldBodyImageDownloadUrl(username: string){
        const user = await UserProvider.getUserById(username);

        if(!user)
            throw new Error("User not found");

        if(!user.oldBodyImg)
            throw new Error("User has no old body image");

        const storageRef = ref(storage, user.oldBodyImg);

        return await getDownloadURL(storageRef);
    }

    static async getUserNewBodyImageDownloadUrl(username: string){
        const user = await UserProvider.getUserById(username);

        if(!user)
            throw new Error("User not found");

        if(!user.newBodyImg)
            throw new Error("User has no new body image");

        const storageRef = ref(storage, user.newBodyImg);

        return await getDownloadURL(storageRef);
    }
}

export default UserProvider;