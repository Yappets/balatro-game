import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { score, message } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>
      <Text>{message}</Text>
      <Text>Your Score: {score}</Text>
      <Button title="Back to Game" onPress={() => navigation.navigate('Game')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ResultScreen;
