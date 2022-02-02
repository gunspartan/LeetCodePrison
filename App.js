import React, {useState, useEffect, useRef} from 'react';
import {Alert, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './app/screens/HomeScreen';

export default function App() {
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  const lastUpdated = useRef(new Date());
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    setLoading(true);
    getData();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const today = new Date();
        if (calculateDays(lastUpdated.current, today) >= 2) {
          Alert.alert("You didn't do your LeetCode", 'Get back to work scum', [
            'OK',
          ]);
          setCounter(0);
          lastUpdated.current = today;
          console.log('lastUpdated', lastUpdated.current);
          storeData(0, lastUpdated.current);
        }
      }

      appState.current = nextAppState;
    });
    setLoading(false);
    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        lastUpdated.current = Date.parse(storedDate);
      } else {
        const today = new Date();
        setCounter(0);
        lastUpdated.current = today;
        storeData(0, today);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const incrementCounter = () => {
    const today = new Date();
    if (calculateDays(lastUpdated.current, today) >= 1 || counter === 0) {
      setCounter(counter + 1);
      lastUpdated.current = today;
      storeData(counter + 1, today);
    } else {
      Alert.alert("You've already done LeetCode today", 'Good work chump', [
        'OK',
      ]);
    }
  };

  const calculateDays = (date1, date2) => {
    const diff = Math.abs(date2 - date1);
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    console.log('daysDiff', daysDiff);
    return daysDiff;
  };

  return (
    <HomeScreen
      counter={counter}
      incrementCounter={incrementCounter}
      loading={loading}
    />
  );
}
