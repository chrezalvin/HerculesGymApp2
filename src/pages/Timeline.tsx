import { IonBackButton, IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonItem, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import Timer from "./Timer";
import { RouteComponentProps, useHistory } from "react-router";
import {type Challenge, Timeline, Set } from "../assets/challenges";
import { useAppSelector } from "../hooks";
import CampaignProvider, { Campaign } from "../providers/campaignProvider";
import RepsSetProvider, { RepsSet } from "../providers/repsSetProvider";

interface TimelineProps extends RouteComponentProps<{
    challengeId: string;
}>{
    challengeList: Challenge[];
    onSetFinished: (challengeType: string, timelineIndex: number, setIndex: number) => void;
}

const TimelinePage: React.FC<TimelineProps> = ({match, challengeList, onSetFinished}) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [currentChallenge, setCurrentChallenge] = useState<Challenge>();

    // current timeline index for modal
    const [currentTimeline, setCurrentTimeline] = useState<number>(0);

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [listDays, setListDays] = useState<RepsSet[]>([]);
    const history = useHistory();

    async function fetchCampaignData(id: string){
        const campaign = await CampaignProvider.getCampaignById(id);

        if(campaign)
            setCampaign(campaign);

        if(campaign?.days){
            const repsSets = await Promise.all(campaign?.days.map(async (day) => RepsSetProvider.getRepsSetById(day.id)));
            const listDays = repsSets.filter(repsSet => repsSet != undefined);

            setListDays(listDays as RepsSet[]);
        }
    }

    useEffect(() => {
        // get path name
        const challengeType = match.params.challengeId;
        
        fetchCampaignData(challengeType);
    }, []);

    function finishSet(timelineIndex: number, setIndex: number){
        onSetFinished(match.params.challengeId, timelineIndex, setIndex);
    }

    const timelines: Timeline[] | undefined = currentChallenge?.repsData;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="warning">
                <IonTitle >
                    {campaign?.name}
                </IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    {
                        campaign?.days.map((day, index) => (
                            <IonItem>
                                <IonButton 
                                    color="warning"
                                    style={{width: "100%", height: "100%"}}
                                    onClick={() => {
                                        history.push(`../timer/${day.id}`);
                                    }}
                                >
                                    Day - {index + 1}
                                </IonButton>
                            </IonItem>
                        ))
                    }
                </IonList>
                <IonModal 
                    ref={modal} 
                    isOpen={modalIsOpen}
                    onDidDismiss={() => {
                        setModalIsOpen(false);
                    }}
                >
                    <IonHeader>
                        <IonToolbar 
                            slot="start"
                        >
                            <IonTitle>
                                {timelines?.[currentTimeline].name}
                            </IonTitle>
                            <IonButtons slot="start">
                                <IonButton
                                    onClick={() => {
                                        modal.current?.dismiss()
                                    }}
                                >
                                    {"<"} Back
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    {/* <IonContent>
                        {
                            currentTimeline == null ? null : (
                                <Timer 
                                    timelineName={timelines?.[currentTimeline].name ?? ""}
                                    onSetFinished={(index) => {
                                        finishSet(currentTimeline!, index);
                                    }}

                                    sets={timelines?.[currentTimeline].listSet ?? []}
                                />
                            )
                        }
                    </IonContent> */}
                </IonModal>
            </IonContent>
        </IonPage>
    );
}

export default TimelinePage;