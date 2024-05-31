import { IonCol, IonContent, IonGrid, IonHeader, IonImg, IonPage, IonRow, IonSpinner } from "@ionic/react";
import no_photo from "../assets/images/photo_unavailable.png";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { useEffect, useState } from "react";
import UserProvider from "../providers/userProvider";
import { useAppSelector } from "../hooks";

import { storage } from "../firestoreConfig";
import { getDownloadURL, ref } from "firebase/storage";

const OldAndNew: React.FC = () => {
    const userEmail = useAppSelector(state => state.loggingReducer.userEmail);

    const {takePhoto} = usePhotoGallery();

    const [photoOld, setPhotoOld] = useState<string | null>(null);
    const [photoNew, setPhotoNew] = useState<string | null>(null);

    const [photoOldisLoading, setPhotoOldisLoading] = useState<boolean>(false);
    const [photoNewisLoading, setPhotoNewisLoading] = useState<boolean>(false);

    async function fetchUserOldAndNewPhoto(email: string){
        setPhotoNewisLoading(true);
        setPhotoOldisLoading(true);

        try{
            const downloadUrlOld = await UserProvider.getUserOldBodyImageDownloadUrl(email);
            setPhotoOld(downloadUrlOld);
            setPhotoOldisLoading(false);
            
            const downloadUrlNew = await UserProvider.getUserNewBodyImageDownloadUrl(email);
            setPhotoNew(downloadUrlNew);
            setPhotoNewisLoading(false);
        }
        catch(e){
            console.error(e);
        }
        finally{
            setPhotoNewisLoading(false);
            setPhotoOldisLoading(false);
        }
    }

    useEffect(() => {

        if(userEmail)
            fetchUserOldAndNewPhoto(userEmail);

    }, []);

    return (
        <IonPage>
            <IonHeader>
                <h1 className="ion-text-center">Old and New</h1>
                <h2 className="ion-text-center">
                    Take photo of your old self and compare it with your new self
                </h2>
            </IonHeader>

            <IonContent>
                <IonGrid 
                    className="ion-justify-content-center"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}    
                >
                    <IonRow className="ion-justify-content-center" style={{maxWidth: "75%"}}>
                        <IonCol size="6">
                            <h3 className="ion-text-center ion-padding-vertical">Old</h3>
                            <div style={{maxWidth: "250px", margin: "auto"}}>
                                {
                                    photoOldisLoading ? 
                                    <IonSpinner style={{width: "100%", margin: "auto"}} /> 
                                    :
                                    <IonImg
                                        src={photoOld ?? no_photo}
                                        alt="old"
                                        style={{width: "100%"}}
                                        onClick={ async () => {
                                            const photo = await takePhoto();
                                            if(userEmail && photo.webviewPath)
                                                await UserProvider.submitOldBodyImage(userEmail, photo.webviewPath);
                                            setPhotoOld(photo.webviewPath ?? null);
                                        }}
                                    />
                                }
                            </div>
                        </IonCol>
                        <IonCol size="6">
                            <h3 className="ion-text-center ion-padding-vertical">New</h3>
                            <div style={{maxWidth: "250px", margin: "auto"}}>
                                {
                                    photoNewisLoading ? 
                                    <IonSpinner style={{width: "100%", margin: "auto"}} /> 
                                    :
                                    <IonImg
                                        src={photoNew ?? no_photo}
                                        alt="new"
                                        style={{width: "100%"}}
                                        onClick={ async () => {
                                            const photo = await takePhoto();
                                            if(userEmail && photo.webviewPath)
                                                await UserProvider.submitNewBodyImage(userEmail, photo.webviewPath);
                                            setPhotoNew(photo.webviewPath ?? null);
                                        }}
                                    />
                                }
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default OldAndNew;