import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [deckId, setDeckId] = useState(null);

  const createDeck = async () => {
    try {
      const response = await axios.post('http://10.128.1.115:5001/gameState/create-deck');
      setDeckId(response.data.deck_id);
      navigation.navigate('Game', { deckId: response.data.deck_id });
    } catch (error) {
      console.error('Error creating deck', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Balatro Game</Text>
      <Button title="Create a New Deck" onPress={createDeck} />
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

export default HomeScreen;
