import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Midnight from 'react-native-midnight';
import HomeScreen from './app/screens/HomeScreen';

export default function App() {
  const [counter, setCounter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date().getDate());

  useEffect(() => {
    getData();
  });

  useEffect(() => {
    const listener = Midnight.addListener(() => {
      console.log('New day');
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
    });
    return () => listener.remove();
  }, [lastUpdated]);

  // RESET LOGIC
  // if (todayDate - lastUpdated > 1) {
  //   console.log('reseting counter...');
  //   Alert.alert("You didn't do your LeetCode", 'Get Back to work scum.', [
  //     'OK',
  //   ]);
  //   setCounter(0);
  //   storeData(counter, todayDate);
  // }

  // Async Storage
  const storeData = async (newCounter, newDate) => {
    try {
      console.log(`storeDate >> newCounter: ${newCounter} newDate: ${newDate}`);
      await AsyncStorage.setItem('counter', newCounter.toString());
      await AsyncStorage.setItem('lastUpdated', newDate.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const storedCounter = await AsyncStorage.getItem('counter');
      const storedDate = await AsyncStorage.getItem('lastUpdated');
      console.log(
        `getDate >> storedCounter: ${storedCounter} storedDate: ${storedDate}`,
      );
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
      console.log(e);
    }
  };

  const incrementCounter = () => {
    const today = new Date().getDate();
    if (today > lastUpdated || counter <= 0) {
      console.log(`storeData(${counter},${today})`);
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
