import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

let gameState = {
  deck_id: '',
  currentCard: null,
  nextCard: null,
  remaining: 52,
  playerScore: 0
};

const valueMap = {
  'ACE': 14, 'KING': 13, 'QUEEN': 12, 'JACK': 11,
  '10': 10, '9': 9, '8': 8, '7': 7,
  '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

// Crear mazo nuevo
app.post('/gameState/create-deck', async (req, res) => {
  try {
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();
    gameState.deck_id = data.deck_id;
    gameState.remaining = data.remaining;
    gameState.currentCard = null;
    gameState.nextCard = null;
    gameState.playerScore = 0;
    res.json({ success: true, deck_id: gameState.deck_id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/gameState/draw-card', async (req, res) => {
  try {
    const count = gameState.currentCard ? 1 : 2; // Si no hay carta previa, sacar 2

    const response = await fetch(`https://deckofcardsapi.com/api/deck/${gameState.deck_id}/draw/?count=${count}`);
    const data = await response.json();

    if (count === 2) {
      gameState.currentCard = data.cards[0];
      gameState.nextCard = data.cards[1];
    } else {
      gameState.nextCard = data.cards[0]; // actualiza solo la carta futura
    }

    gameState.remaining = data.remaining;

    res.json({
      success: true,
      card: gameState.currentCard,
      remaining: gameState.remaining
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Evaluar adivinanza
app.post('/gameState/guess-card', (req, res) => {
  const { guess } = req.body;

  if (!gameState.currentCard || !gameState.nextCard) {
    return res.status(400).json({ success: false, message: 'Draw cards first.' });
  }

  const currentVal = valueMap[gameState.currentCard.value];
  const nextVal = valueMap[gameState.nextCard.value];

  let correct = false;

  if (guess === 'higher' && nextVal > currentVal) {
    correct = true;
  } else if (guess === 'lower' && nextVal < currentVal) {
    correct = true;
  }

  if (correct) {
    gameState.playerScore += 1;
  }

  // Actualizar: la nextCard ahora será la nueva current, y sacar otra para continuar
  gameState.currentCard = gameState.nextCard;
  gameState.nextCard = null;  // se saca en el siguiente draw-card

  res.json({
    success: correct,
    message: correct ? '✅ ¡Correcto!' : '❌ Incorrecto',
    revealedCard: gameState.currentCard, // mostrar esta imagen
    score: gameState.playerScore,
    debug: {
      guess,
      currentValue: currentVal,
      nextValue: nextVal,
      comparison: nextVal > currentVal ? 'higher' : nextVal < currentVal ? 'lower' : 'equal'
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
