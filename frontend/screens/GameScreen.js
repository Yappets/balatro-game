import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import axios from 'axios';



const GameScreen = ({ route }) => {
  const { deckId } = route.params;
  const [currentCard, setCurrentCard] = useState(null);
  const [revealedCard, setRevealedCard] = useState(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [canGuess, setCanGuess] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fireAnim = useRef(new Animated.Value(0)).current;

  const animateCard = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

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

  const drawCard = async () => {
    try {
      const response = await axios.post('http://10.254.18.240:5001/gameState/draw-card', { deckId });
      setCurrentCard(response.data.card);
      setRevealedCard(null);
      setMessage('');
      setCanGuess(true);
      animateCard();
    } catch (error) {
      console.error('Error drawing cards', error);
    }
  };

  const guessCard = async (guessValue) => {
    try {
      const response = await axios.post('http://10.254.18.240:5001/gameState/guess-card', { guess: guessValue, deckId });
      setMessage(response.data.message);
      setRevealedCard(response.data.revealedCard);
      setScore(response.data.score);
      setCanGuess(false);
      animateCard();
    } catch (error) {
      console.error('Error guessing card', error);
    }
  };

  const getDynamicFrameStyle = (color, pulse = false) => ({
    borderColor: fireAnim.interpolate({
      inputRange: [0, 1],
      outputRange: pulse ? [color, 'orange'] : [color, color]
    }),
    shadowColor: color,
    shadowOpacity: fireAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0.9]
    }),
    shadowRadius: fireAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 14]
    }),
    borderWidth: 3,
    borderRadius: 12,
    padding: 4,
    marginVertical: 10,
    backgroundColor: '#00000050',
    transform: pulse
      ? [{ scale: fireAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }]
      : []
  });

  return (
    <ImageBackground
      source={require('../assets/casino-background.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🎰 Balatro Game 🎰</Text>
        <Text style={styles.score}>Puntaje: {score}</Text>

        <TouchableOpacity style={styles.drawButton} onPress={drawCard}>
          <Text style={styles.drawButtonText}>🎴 DRAW CARD</Text>
        </TouchableOpacity>

        {currentCard && (
          <View style={styles.cardContainer}>
            <Text style={styles.cardLabel}>
              Carta actual: {currentCard.value} de {currentCard.suit}
            </Text>
            <Animated.View style={getDynamicFrameStyle('red', true)}>
              <Animated.Image
                source={{ uri: currentCard.image }}
                style={[styles.cardImage, { opacity: fadeAnim }]}
              />
            </Animated.View>
            <View style={styles.guessButtons}>
              <TouchableOpacity
                style={[styles.guessButton, !canGuess && styles.disabled]}
                disabled={!canGuess}
                onPress={() => guessCard('higher')}
              >
                <Text style={styles.buttonText}>⬆️ Higher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.guessButton, !canGuess && styles.disabled]}
                disabled={!canGuess}
                onPress={() => guessCard('lower')}
              >
                <Text style={styles.buttonText}>⬇️ Lower</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {revealedCard && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{message}</Text>
            <Text style={styles.cardLabel}>
              Próxima carta: {revealedCard.value} de {revealedCard.suit}
            </Text>
            <Animated.View style={getDynamicFrameStyle('cyan', true)}>
              <Animated.Image
                source={{ uri: revealedCard.image }}
                style={[styles.cardImage, { opacity: fadeAnim }]}
              />
            </Animated.View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'gold',
    textShadowColor: '#000',
    textShadowRadius: 5,
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  drawButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  drawButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  cardLabel: {
    color: 'white',
    marginTop: 10,
  },
  cardImage: {
    width: 100,
    height: 150,
  },
  guessButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  guessButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  disabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GameScreen;
