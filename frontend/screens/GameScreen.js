import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const GameScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [card, setCard] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');

  const drawCard = async () => {
    try {
      const response = await axios.post(`http://10.128.1.115:5001/gameState/draw-card`);
      setCard(response.data.card);
    } catch (error) {
      console.error('Error drawing card', error);
    }
  };

  const guessCard = async (guessValue) => {
    try {
      const response = await axios.post('http://10.128.1.115:5001/gameState/guess-card', { guess: guessValue });
      setMessage(response.data.message);
      navigation.navigate('Result', { score: response.data.score, message: response.data.message });
    } catch (error) {
      console.error('Error guessing card', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <Button title="Draw a Card" onPress={drawCard} />
      {card && (
        <View style={styles.cardContainer}>
          <Text>Card: {card.value} of {card.suit}</Text>
          <Button title="Higher" onPress={() => guessCard('higher')} />
          <Button title="Lower" onPress={() => guessCard('lower')} />
        </View>
      )}
      {message && <Text>{message}</Text>}
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
  cardContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default GameScreen;
