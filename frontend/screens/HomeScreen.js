import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  ImageBackground
} from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [deckId, setDeckId] = useState(null);
  const fireAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fireAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(fireAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const createDeck = async () => {
    try {
      const response = await axios.post('http://10.254.18.240:5001/gameState/create-deck');
      setDeckId(response.data.deck_id);
      navigation.navigate('Game', { deckId: response.data.deck_id });
    } catch (error) {
      console.error('Error creating deck', error);
    }
  };

  const animatedButtonStyle = {
    borderColor: fireAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ff3c00', '#ffa500'],
    }),
    shadowColor: '#ffcc00',
    shadowOpacity: fireAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.9],
    }),
    shadowRadius: fireAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 15],
    }),
    transform: [
      {
        scale: fireAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
  };

  return (
    <ImageBackground
      source={require('../assets/balatro-logo.png')} // imagen usada como fondo
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.animatedButton, animatedButtonStyle]}>
          <TouchableOpacity onPress={createDeck}>
            <Text style={styles.buttonText}>🃏 Comenzar Juego</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // oscurece un poco para mejorar contraste del texto
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedButton: {
    borderWidth: 3,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#1e1e1e',
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
