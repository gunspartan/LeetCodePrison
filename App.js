import React, {useState, useEffect, useRef} from 'react';
import {Alert, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './app/screens/HomeScreen';

export default function App() {
  const [counter, setCounter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    getData();
  });

  useEffect(() => {
    getData();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        const today = new Date();
        console.log(today, lastUpdated);
        if (calculateDays(lastUpdated, today) >= 2) {
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
        setLastUpdated(Date.parse(storedDate));
      } else {
        const today = new Date();
        setCounter(0);
        setLastUpdated(today);
        storeData(0, today);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const incrementCounter = () => {
    const today = new Date();
    if (calculateDays(lastUpdated, today) >= 1 || counter === 0) {
      setCounter(counter + 1);
      setLastUpdated(today);
      storeData(counter + 1, today);
    } else {
      Alert.alert("You've already done LeetCode today", 'Good work chump', [
        'OK',
      ]);
    }
  };

  const calculateDays = (date1, date2) => {
    console.log(date2, ' - ', date1);
    const diff = Math.abs(date2 - date1);
    console.log('diff', diff);
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    console.log('daysDiff', daysDiff);
    return daysDiff;
  };

  return <HomeScreen counter={counter} incrementCounter={incrementCounter} />;
}
