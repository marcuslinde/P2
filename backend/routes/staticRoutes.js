import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your routes
router.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'register.html'));
});

router.get('/joinGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'joinGame.html'));
});

router.get('/createGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'createGame.html'));
});

router.get('/createBotGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'createBotGame.html'));
});

router.get('/profile', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'profile.html'));
});

router.get('/settings', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'settings.html'));
});

router.get('/placeShips', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'placeShips.html'));
});

router.get('/gameLobby', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'gameLobby.html'));
});


router.get('/game', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'game.html'));
});




export default router;