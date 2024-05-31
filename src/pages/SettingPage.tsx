import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
} from "@ionic/react";
import {
  heart,
  water,
  settings,
  mic,
  earth,
  heartCircle,
  moon,
} from "ionicons/icons";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toggleDarkMode } from "../storage/darkMode";

interface Setting{
  name: string;
  icon: string;
  toggle?: {
    slot?: string;
    checked?: boolean;
    onChange?: () => void;
  }
}

const SettingPage: React.FC = () => {
  const darkModeRedux = useAppSelector((state) => state.darkModeReducer.value);
  const dispatch = useAppDispatch();

  const settingList: Setting[] = [
    {
      name: "Pengaturan latihan", 
      icon: water
    },
    {
      name: "Setelan Umum", 
      icon: settings
    },
    {
      name: "Opsi Suara", 
      icon: mic
    },
    {
      name: "Opsi Bahasa", 
      icon: earth
    },
    {
      name: "Sinkronisasi dengan google fit", 
      icon: heart,
      toggle: {
        slot: "end"
      }
    },
    {
      name: "Sinkronisasi dengan Health Connect", 
      icon: heartCircle,
      toggle: {
        slot: "end"
      }
    },
    {
      name: "Dark Mode",
      icon: moon,
      toggle: {
        slot: "end",
        onChange: () => dispatch(toggleDarkMode()),
        checked: darkModeRedux
      }
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="warning">
          <IonTitle>Pengaturan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar></IonToolbar>
        </IonHeader>
        <IonList>
          {settingList.map((setting, index) => (
            <IonItem key={index}>
              <IonIcon icon={setting.icon} slot="start" />
              <IonLabel>{setting.name}</IonLabel>
              {setting.toggle && <IonToggle slot={setting.toggle.slot} onIonChange={setting.toggle?.onChange} checked={setting.toggle.checked}/>}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingPage;
