import {Route} from "react-router-dom";
import {
  IonApp,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { useEffect, useState } from "react";
import UserThemePreference, { ThemePreference } from "./localStorage/userThemePreference";
import { ChallengesRepository } from "./localStorage/challengesRepository";
import { Challenge, Workout } from "./assets/challenges";
import defaultChallenge from "./assets/challenges";
import TimelinePage from "./pages/Timeline";
import { WorkoutRepository } from "./localStorage/workoutRepository";
import BmiCalculator from "./pages/BmiCalculator";
import BmrCalculator from "./pages/BmrCalculator";
import MainTabs from "./pages/MainTabs";

import { useAppDispatch, useAppSelector } from "./hooks";

import storage from "./database";

import {
  setDarkMode
} from "./storage/darkMode";

import LoginPage from "./pages/LoginPage";

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import Timer from "./pages/Timer";

setupIonicReact();


const App: React.FC = () => {
  const [challenge, setChallenge] = useState<Challenge[]>(defaultChallenge.challenges);
  const [workouts, setWorkouts] = useState<Workout[]>(defaultChallenge.workout);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState<number>(0);

  const darkModeRedux = useAppSelector((state) => state.darkModeReducer.value);
  const isLoggedIn = useAppSelector((state) => state.loggingReducer.userEmail !== null);
  const dispatch = useAppDispatch();

  const onSetFinished = (challengeType: string, timelineIndex: number, setIndex: number) => {
    const newChallenge = challenge?.map(ele => ele.type === challengeType ? {
      ...ele,
      repsData: ele.repsData.map((timeline, tIndex) => tIndex === timelineIndex ? {
        ...timeline,
        sets: timeline.listSet.map((set, sIndex) => {
          if(sIndex === setIndex){
            setTotalTimeSpent(totalTimeSpent + set.duration);
            setTotalCaloriesBurned(totalCaloriesBurned + set.kalori);

            return {
              ...set,
              isFinished: true
            }
          }
            
          return set;
        })
      } : timeline)
    } : ele);

    console.log("new challenge", newChallenge);

    if(newChallenge){
      setChallenge(newChallenge);
      // (new ChallengesRepository(storage)).setChallenges(newChallenge);
    }
  }

  useEffect(() => {
    async function decideThemePreference() {
      // create the storage first
      storage.create();

      let themePreference: ThemePreference;

      const userThemePreference = new UserThemePreference(storage);
      const challengesRepository = new ChallengesRepository(storage);
      const workoutRepository = new WorkoutRepository(storage);

      // challengesRepository.setDefaultData();
      // workoutRepository.setDefaultData();
      
      // check if the user has a theme preference
      const storedThemePreference = await userThemePreference.getThemePreference();
      const storedChallenge = await challengesRepository.getChallenges();
      const storedWorkout = await workoutRepository.getWorkouts();
      
      if(storedThemePreference)
        themePreference = storedThemePreference;
      else{
        // if not, check if the user prefers dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        themePreference = prefersDark.matches ? "dark" : "light";

        // save the preference
        await userThemePreference.setThemePreference(themePreference);
      }

      // check if data is available at storage
      if(storedChallenge)
        setChallenge(storedChallenge);
      else
        // if not, then set up a new default data
        await challengesRepository.setDefaultData();

      if(storedWorkout)
        setWorkouts(storedWorkout);
      else
        await workoutRepository.setDefaultData();

      // Initialize the dark palette based on the initial
      // value of the prefers-color-scheme media query
      dispatch(setDarkMode(themePreference === "dark"));
    }

    decideThemePreference();
  }, []);
  
  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/login" component={LoginPage} />
        <Route path="/" component={isLoggedIn ? MainTabs : LoginPage} />
        <Route 
              exact 
              path="/timeline/:challengeId" 
              key="/timeline"
              render={(props) => <TimelinePage {...props} 
                challengeList={challenge ?? []}
                onSetFinished={(challengeType: string, timelineIndex: number, setIndex: number) => onSetFinished(challengeType, timelineIndex, setIndex)}
              />}
            />
            <Route
              exact
              path="/timer/:repSetId"
              key="/timer"
              render={(props) => <Timer {...props} />}
            />
            <Route 
              exact 
              path="/bmiCalculator" 
              key="/bmiCalculator"
              component={BmiCalculator}
            />
            <Route 
              exact 
              path="/bmrCalculator" 
              key="/bmrCalculator"
              component={BmrCalculator}
            >
            </Route>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
