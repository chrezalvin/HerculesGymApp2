import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { useAppDispatch, useAppSelector } from "../hooks";

import {setLoading, setUserEmail} from "../storage/logging";
import UserProvider from "../providers/userProvider";
import { useState } from "react";
import { useHistory } from "react-router";

const LoginPage: React.FC = () => {
    const isLoggedIn = useAppSelector((state) => state.loggingReducer.userEmail !== null);
    const isLoading = useAppSelector((state) => state.loggingReducer.isLoading);
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    async function login(username: string, password: string) {
        dispatch(setLoading(true));
        setError(null);

        try{
            // wait for 3 seconds
            const user = await UserProvider.getUser(username, password);

            dispatch(setUserEmail(user?.user.email ?? null));
        }
        catch(e){
            console.log(e);
            setError("Invalid username or password");
        }
        finally{
            dispatch(setLoading(false));
        }

        
    }

    return (
        <IonPage>
            <IonHeader>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Login</IonTitle>
                    </IonToolbar>
                </IonHeader>
            </IonHeader>
            <IonContent className="ion-justify-content-center">
                <IonTitle className="ion-text-center ion-padding-vertical">
                    <strong>Hercules Gym App</strong>
                </IonTitle>
                <IonCard>
                    <IonCardContent>
                        <IonGrid>
                            <IonRow className="ion-justify-content-center">
                                <IonCol size="4">
                                    <IonInput 
                                        placeholder="Email" 
                                        onIonChange={(e) => {
                                            console.log(e.target.value);
                                            setUsername(`${e.target.value}`);
                                        }}
                                    value={username}
                                    ></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow className="ion-justify-content-center">
                                <IonCol size="4">
                                    <IonInput 
                                        placeholder="Password" 
                                        type="password"
                                        onIonChange={(e) => {
                                                setPassword(`${e.target.value}`);
                                            }
                                        }
                                        value={password}
                                    ></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow className="ion-justify-content-center">
                                <IonButton
                                    onClick={() => login(username, password)}
                                >
                                    {isLoading ? "Loading..." : "Login"}
                                </IonButton>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
                <IonRow class="ion-justify-content-center">
                    <IonText color="danger" className="ion-text-center">
                        {error}
                    </IonText>
                </IonRow>
            </IonContent>
        </IonPage>
    )
};

export default LoginPage;