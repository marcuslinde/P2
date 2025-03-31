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
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'auth', 'register.html'));
});

router.get('/joinGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'joinGame', 'joinGame.html'));
});

router.get('/createGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'createGame', 'createGame.html'));
});

router.get('/createBotGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'botGame', 'createBotGame.html'));
});

router.get('/profile', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'profile', 'profile.html'));
});

router.get('/settings', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'settings', 'settings.html'));
});

router.get('/placeShips', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'placeShips', 'placeShips.html'));
});

router.get('/gameLobby', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'gameLobby', 'gameLobby.html'));
});

router.get('/game', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'pages', 'game', 'game.html'));
});




export default router;