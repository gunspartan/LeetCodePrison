import React from 'react';
import {StyleSheet, Image, Text, View, TouchableOpacity} from 'react-native';

const HomeScreen = ({counter, incrementCounter}) => {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Days Since</Text>
        <Image
          resizeMode="contain"
          style={styles.logoImg}
          source={require('../assets/leetcodelogo.png')}
        />
        <Text style={styles.headingText}>Prison</Text>
      </View>
      <Text style={styles.counter}>{counter}</Text>
      <TouchableOpacity onPress={incrementCounter} style={styles.btn}>
        <View style={styles.btnView}>
          <Text style={styles.plus}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    padding: 60,
    justifyContent: 'space-between',
  },
  logoImg: {
    width: 200,
    height: 100,
  },
  heading: {
    alignItems: 'center',
  },
  headingText: {
    fontSize: 34,
  },
  counter: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  btn: {
    width: 100,
    height: 60,
  },
  btnView: {
    backgroundColor: 'orange',
    borderRadius: 100 / 2,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 50,
  },
});

export default HomeScreen;
