import { time, home, statsChartOutline, settingsSharp, people } from "ionicons/icons";
import ForumPage from "./ForumPage";
import LatihanPage from "./LatihanPage";
import ProgressPage from "./ProgressPage";
import SettingPage from "./SettingPage";
import { ReactNode } from "react";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { Redirect, Route } from "react-router";
import OldAndNew from "./OldAndNew";

interface CustomRoute{
  path: string;
  name: string;
  component: ReactNode;
  icon: string;
}

const routes: CustomRoute[] = [
    {
      path: "/latihan",
      name: "Latihan",
      component: (
        <LatihanPage 
          key="a"
        />
      ),
      icon: time
    },
    {
      path: "/forum",
      name: "Forum",
      component: <ForumPage key="b"/>,
      icon: home
    },
    {
      path: "/progress",
      name: "Progress",
      component: (
        <ProgressPage 
          totalCalories={0}
          totalWorkout={0}
          totalTimeSecond={0}
          key="c"
        />
      ),
      icon: statsChartOutline
    },
    {
      path: "/setting",
      name: "Pengaturan",
      component: <SettingPage key="d" />,
      icon: settingsSharp
    },
    {
      path: "/oldandnew",
      name: "Old & New",
      component: <OldAndNew />,
      icon: people
    }
  ];

const MainTabs: React.FC = () => {
    return (
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/latihan" />
            {
              routes.map(route => (
                <Route 
                  exact
                  path={route.path} 
                  key={route.path} 
                  render={(_) => {
                      return route.component;
                  }}
                />
              ))
            }
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            {
              routes.map(route => (
                <IonTabButton tab={route.path} href={route.path}>
                  <IonIcon aria-hidden="true" icon={route.icon} />
                  <IonLabel>{route.name}</IonLabel>
                </IonTabButton>
              ))
            }
          </IonTabBar>
        </IonTabs>
    );
}

export default MainTabs;