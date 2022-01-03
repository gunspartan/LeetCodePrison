import React, {useState, useEffect, useRef} from 'react';
import {Alert, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './app/screens/HomeScreen';

export default function App() {
  const [counter, setCounter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date().getDate());

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    getData();
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        const today = new Date().getDate();
        console.log(today, lastUpdated);
        if (today - lastUpdated > 1) {
          Alert.alert("You didn't do your LeetCode", 'Get back to work scum', [
            'OK',
          ]);
          setCounter(0);
          setLastUpdated(today);
          storeData(0, today);
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Async Storage
  const storeData = async (newCounter, newDate) => {
    try {
      await AsyncStorage.setItem('counter', newCounter.toString());
      await AsyncStorage.setItem('lastUpdated', newDate.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const getData = async () => {
    try {
      const storedCounter = await AsyncStorage.getItem('counter');
      const storedDate = await AsyncStorage.getItem('lastUpdated');
      if (storedCounter !== null && storedDate !== null) {
        // eslint-disable-next-line radix
        setCounter(parseInt(storedCounter));
        // eslint-disable-next-line radix
        setLastUpdated(parseInt(storedDate));
      } else {
        const today = new Date().getDate();
        setCounter(0);
        setLastUpdated(today);
        storeData(0, today);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const incrementCounter = () => {
    const today = new Date().getDate();
    if (today > lastUpdated || counter <= 0) {
      setCounter(counter + 1);
      setLastUpdated(today);
      storeData(counter + 1, today);
    } else {
      Alert.alert("You've already done LeetCode today", 'Good work chump', [
        'OK',
      ]);
    }
  };

  return <HomeScreen counter={counter} incrementCounter={incrementCounter} />;
}
