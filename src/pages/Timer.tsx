import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonList, IonPage, IonRow, IonSpinner, IonText, IonTitle } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import RepsSetProvider from "../providers/repsSetProvider";
import RepProvider, { Rep } from "../providers/repProvider";
import { people } from "ionicons/icons";

interface Set{
    name: string,
    duration: number,
    description: string,
    finished?: boolean,
}

interface TimerProp extends RouteComponentProps<{
    repSetId: string;
}>{
}

const Timer: React.FC<TimerProp> = ({match}) => {
    const [time, setTime] = useState<number>(0);
    const [isCountdown, setIsCountdown] = useState<boolean>(false);
    const [indexSet, setIndexSet] = useState<number>(0);
    const [reps, setReps] = useState<{duration: number, rep: Rep}[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [thumbnailImg, setThumbnailImg] = useState<string | null>(null);

    async function fetchRepsSet(id: string){
        setIsLoading(true);
        console.log("fetching reps set");

        try{
            const repsSet = await RepsSetProvider.getRepsSetById(id);

            if(repsSet){
                const repList = await Promise.all(repsSet.reps.map(async rep => {
                    return {
                        duration: rep.duration,
                        rep: await RepProvider.getRepById(rep.rep.id)
                    };
                }));
    
                const repListArray = repList as {duration: number, rep: Rep}[];
    
                setReps(repListArray);
                setTime(repListArray[0].duration);
            }
        }
        catch(e){
            console.log(e);
        }
        finally{
            setIsLoading(false);
        }

        console.log(`finish fetching reps set, ${reps.length} data`);
    }

    // called once for fetching
    useEffect(()  => {
        fetchRepsSet(match.params.repSetId);
    }, [])

    function timerStartOrPause(){
        if(isCountdown == true){
            setIsCountdown(false);
        }
        else{
            setIsCountdown(true);
        }

        if(time == 0){
            setTime(reps[indexSet].duration);
        }
    }

    function resetTimer(){
        setTime(reps[indexSet].duration);
        setIsCountdown(false);
    }

    function switchSet(){
        setIndexSet(prevIndex => prevIndex + 1);
        resetTimer();
    }

    useEffect(() => {
        let countdown: number;
        if (isCountdown) {
            countdown = window.setInterval(() => {
                if (time > 0) {
                    setTime(prevSeconds => prevSeconds - 1);
                }
                else
                    switchSet();
            }, 1000);
            
            if(countdown)
                clearInterval(countdown);
        }

    }, [isCountdown, time]);

    return (
        <IonPage>
            <IonHeader>
                Timer
            </IonHeader>
            <IonContent>
                {
                    isLoading ? 
                        <IonSpinner 
                            style={{width: "100%", height: "100%"}} 
                        /> : 
                        <div>
                            <IonGrid>
                                <IonRow>
                                {
                                    reps.map((rep, index) => (
                                        <IonCol
                                            onClick={async () => {
                                                setIndexSet(index);
                                                setThumbnailImg(null);

                                                if(reps[indexSet].rep.img){
                                                    setThumbnailImg(await RepProvider.getDemonstrationDownloadUrl(reps[indexSet].rep.img!));
                                                }
                                            }}
                                            style={{maxWidth: "150px", backgroundColor: indexSet === index ? "green" : null}}
                                        >
                                            <IonRow className="ion-justify-content-center">
                                                <IonIcon src={people} />
                                            </IonRow>
                                            <IonRow className="ion-justify-content-center">
                                                {rep.rep.name}
                                            </IonRow>
                                            <IonRow className="ion-justify-content-center">
                                                {rep.duration}s
                                            </IonRow>
                                        </IonCol>
                                    ))
                                }
                                </IonRow>
                            </IonGrid>
                            <h1 className="ion-text-center">{reps[indexSet].rep.name}</h1>
                            <p className="ion-margin-vertical ion-text-center">
                                {reps[indexSet].rep.description}
                            </p>
                            <IonImg src={thumbnailImg ?? ""} style={{width: "240px", margin: "auto"}} />

                            <h1 className="ion-text-center">{time}</h1> 
                            <div className="ion-margin-vertical" style={{display: "flex", justifyContent: "center"}}>
                                <IonButton
                                    color="primary"
                                    onClick={() => timerStartOrPause()}
                                >
                                    {isCountdown ? "Stop": "Start Timer!"}
                                </IonButton>
                            </div>
                        </div>
                }
            </IonContent>
        </IonPage>
    );

    // return (
    //     <IonPage>
    //         <IonContent fullscreen>
    //             <h1>Timer {time} | Current Set: {props.sets[indexSet].name}</h1>

    //             <IonList>
    //                 {
    //                     props.sets.map((ele, index) => (
    //                         <IonItem 
    //                             style={{"padding": 0, "margin": 0}}
    //                             // color={index === indexSet ? "primary": "secondary"}
    //                         >
    //                             <IonButton
    //                                 style={{"width": "100%", "height": "100%"}}
    //                                 color={ele.finished ? "success" : index === indexSet ? "primary": "secondary"}
    //                                 onClick={() => {
    //                                     if(ele.finished || index == props.sets.filter(set => set.finished).length + 1){
    //                                         setIndexSet(index);
    //                                         setTime(props.sets[index].duration);
    //                                     }
    //                                 }}
    //                             >
    //                                 {ele.name}
    //                             </IonButton>
    //                             {/* {ele.name} */}
    //                         </IonItem>
    //                     ))
    //                 }
    //             </IonList>

    //             <IonButton 
    //                 onClick={() => timerStartOrPause()}
    //                 color={isCountdown ? "danger" : "primary"}
    //             >
    //                 {isCountdown ? "Stop" : "Mulai Latihan"}
    //             </IonButton>

    //             <IonButton
    //                 onClick={() => resetTimer()}
    //             >
    //                 Reset
    //             </IonButton>
    //         </IonContent>
    //     </IonPage>
    // );
}

export default Timer;