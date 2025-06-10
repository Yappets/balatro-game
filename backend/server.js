    import express from 'express';  // Cambiar 'require' por 'import'
    import fetch from 'node-fetch'; // Cambiar 'require' por 'import'
    import cors from 'cors';  // Importa CORS



    const app = express();
    const port = 5001;

    app.use(express.json());
    app.use(cors());  // Habilita CORS para todas las rutas



    let gameState = {
    deck_id: '',
    card: '',
    remaining: 52,
    playerScore: 0
    };

    // Crear un mazo nuevo y barajarlo
    app.post('/gameState/create-deck', async (req, res) => {
    try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        gameState.deck_id = data.deck_id;
        gameState.remaining = data.remaining;
        res.json({ success: true, deck_id: gameState.deck_id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
    });

    // Sacar una carta del mazo
    app.post('/gameState/draw-card', async (req, res) => {
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${gameState.deck_id}/draw/?count=1`);
        const data = await response.json();
        gameState.card = data.cards[0];
        gameState.remaining = data.remaining;
        res.json({ success: true, card: gameState.card, remaining: gameState.remaining });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
    });

    // Adivinar la carta
    app.post('/gameState/guess-card', (req, res) => {
    const { guess } = req.body;
    if (gameState.card) {
        let correct = false;
        const cardValue = parseInt(gameState.card.value, 10);
        const guessValue = parseInt(guess, 10);

        if (guess === 'higher' && cardValue > guessValue) {
        correct = true;
        } else if (guess === 'lower' && cardValue < guessValue) {
        correct = true;
        }

        if (correct) {
        gameState.playerScore += 1;
        res.json({ success: true, message: 'Correct!', score: gameState.playerScore });
        } else {
        res.json({ success: false, message: 'Incorrect!', score: gameState.playerScore });
        }
    } else {
        res.status(400).json({ success: false, message: 'No card drawn yet.' });
    }
    });

    app.listen(port, () => {
    console.log(`Server running on http://10.128.1.115:${port}`);
    });
