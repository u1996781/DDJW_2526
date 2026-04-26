import { setValue, clickOn, clickOff } from './game.js';
import { CARD_URLS } from './cards.js';

const resources = [
    CARD_URLS['cb'], CARD_URLS['co'],
    CARD_URLS['sb'], CARD_URLS['so'],
    CARD_URLS['tb'], CARD_URLS['to']
];
const back = CARD_URLS['back'];

export const items = [];

export var game = {
    ready: 0, flippedCards: [], score: 200, matchesLeft: 0,
    groupSize: 2, penalty: 25, mode: 1, level: 1, alias: 'Jugador', totalScore: 0
};

function shuffle(arr) { arr.sort(() => Math.random() - 0.5); }

function getMode2Config(level) {
    let nc, gs, pen;
    if (level <= 5) {
        nc = Math.min(4 + (level - 1) * 2, 12);
        gs = 2; pen = 10 + (level - 1) * 5;
    } else if (level <= 10) {
        nc = 12; gs = level <= 8 ? 2 : 3;
        pen = 30 + (level - 5) * 10;
    } else {
        nc = 12; gs = level <= 13 ? 3 : 4;
        pen = 80 + (level - 10) * 15;
    }
    return { numCards: nc, groupSize: gs, penalty: pen };
}

export function selectCards() {
    const config = JSON.parse(localStorage.getItem('memoryConfig') || '{}');
    game.mode = config.mode || 1;
    game.level = config.level || 1;
    game.alias = config.alias || 'Jugador';
    game.totalScore = config.score || 0;

    let nc, gs, pen;
    if (game.mode === 2) {
        const cfg = getMode2Config(game.level);
        nc = cfg.numCards; gs = cfg.groupSize; pen = cfg.penalty;
    } else {
        nc = config.numCards || 6; gs = config.groupSize || 2; pen = config.penalty || 25;
    }

    // Mai podem tenir més cartes úniques que els resources disponibles (6)
    nc = Math.min(nc, resources.length);

    game.groupSize = gs; game.penalty = pen; game.matchesLeft = nc;
    game.score = 200 + (game.mode === 2 ? (game.level - 1) * 50 : 0);

    let pool = resources.slice();
    shuffle(pool);
    pool = pool.slice(0, nc);

    let deck = [];
    for (let i = 0; i < gs; i++) deck = deck.concat(pool);
    shuffle(deck);

    items.length = 0;
    deck.forEach(c => items.push(c));
}

export function startGame() {
    updateHUD();
    game.ready = 0; game.flippedCards = [];
    items.forEach((_, idx) => { setValue(idx, items[idx]); clickOff(idx); });
    setTimeout(() => {
        items.forEach((_, idx) => {
            setTimeout(() => { game.ready++; setValue(idx, back); clickOn(idx); }, 100 * idx);
        });
    }, 1500);
}

export function clickCard(indx) {
    if (game.ready < items.length || game.flippedCards.includes(indx)) return;
    setValue(indx, items[indx]); clickOff(indx);
    game.flippedCards.push(indx);

    if (game.flippedCards.length === game.groupSize) {
        const tipus = items[game.flippedCards[0]];
        if (game.flippedCards.every(id => items[id] === tipus)) {
            game.matchesLeft--;
            updateHUD();
            if (game.matchesLeft <= 0) setTimeout(onLevelWin, 500);
            game.flippedCards = [];
        } else {
            game.ready = 0;
            setTimeout(() => {
                game.flippedCards.forEach(id => { setValue(id, back); clickOn(id); });
                game.ready = items.length; game.flippedCards = [];
            }, 1000);
            game.score -= game.penalty;
            if (game.score < 0) game.score = 0;
            updateHUD();
            if (game.score <= 0) setTimeout(onGameOver, 500);
        }
    }
}

function onLevelWin() {
    if (game.mode === 1) {
        alert(`Victòria! Has guanyat amb ${game.score} punts!`); 
        window.location.assign('../');
    } else {
        game.totalScore += game.score;
        saveToRanking(game.alias, game.totalScore, game.level);
        alert(`Nivell ${game.level} superat! +${game.score} punts\nTotal: ${game.totalScore}`);
        let config = JSON.parse(localStorage.getItem('memoryConfig'));
        config.level++; config.score = game.totalScore;
        localStorage.setItem('memoryConfig', JSON.stringify(config));
        window.location.reload();
    }
}

function onGameOver() {
    const finalScore = game.totalScore + game.score;
    if (game.mode === 2) {
        saveToRanking(game.alias, finalScore, game.level);
        alert(`Has perdut al nivell ${game.level}!\nPuntuació total: ${finalScore} punts`);
    } else {
        alert('Has perdut!');
    }
    window.location.assign('../');
}

function saveToRanking(alias, score, level) {
    let ranking = JSON.parse(localStorage.getItem('memoryRanking') || '[]');
    const existing = ranking.findIndex(e => e.alias === alias);
    const entry = { alias, score, level, date: new Date().toLocaleDateString('ca-ES') };

    if (existing >= 0) {
        if (score > ranking[existing].score) ranking[existing] = entry;
    } else {
        ranking.push(entry);
    }
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('memoryRanking', JSON.stringify(ranking.slice(0, 10)));
}

// FUNCIONS DELS BOTONS 
export function saveCurrentGame() {
    const config = JSON.parse(localStorage.getItem('memoryConfig') || '{}');
    const saves = JSON.parse(localStorage.getItem('memorySaves') || '[]');
    const saveData = { ...config, score: game.totalScore + game.score, level: game.level, date: new Date().toLocaleDateString('ca-ES'), isNew: false };
    
    const idx = saves.findIndex(s => s.alias === saveData.alias && s.mode === saveData.mode);
    if (idx >= 0) saves[idx] = saveData;
    else saves.push(saveData);

    localStorage.setItem('memorySaves', JSON.stringify(saves));
    if (game.mode === 2) saveToRanking(game.alias, saveData.score, game.level);
    alert('Partida guardada!');
}

export function quitGame() {
    if (game.mode === 2 && game.totalScore + game.score > 0) {
        saveToRanking(game.alias, game.totalScore + game.score, game.level);
    }
    window.location.assign('../');
}

function updateHUD() {
    const scoreEl = document.getElementById('score-display');
    const levelEl = document.getElementById('level-display');
    if (scoreEl) scoreEl.innerText = `Punts: ${game.score}`;
    if (levelEl) levelEl.innerText = game.mode === 2 ? `Nivell: ${game.level} | Total: ${game.totalScore}` : '';
}