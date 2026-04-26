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
    ready:        0,
    flippedCards: [],
    score:        200,
    matchesLeft:  0,
    groupSize:    2,
    penalty:      25,
    mode:         1,
    level:        1,
    alias:        'Jugador',
    totalScore:   0
};

function shuffle(arr) {
    arr.sort(() => Math.random() - 0.5);
}

function getMode2Config(level) {
    let numCards, groupSize, penalty;
    if (level <= 5) {
        numCards  = Math.min(4 + (level - 1) * 2, 12);
        groupSize = 2;
        penalty   = 10 + (level - 1) * 5;
    } else if (level <= 10) {
        numCards  = 12;
        groupSize = level <= 8 ? 2 : 3;
        penalty   = 30 + (level - 5) * 10;
    } else {
        numCards  = 12;
        groupSize = level <= 13 ? 3 : 4;
        penalty   = 80 + (level - 10) * 15;
    }
    return { numCards, groupSize, penalty };
}

function prepareCards(numUniqueCards, groupSize, penalty) {
    game.groupSize   = groupSize;
    game.penalty     = penalty;

    // Mai podem tenir més cartes úniques que les disponibles
    numUniqueCards = Math.min(numUniqueCards, resources.length);
    game.matchesLeft = numUniqueCards;

    let pool = resources.slice();
    shuffle(pool);
    pool = pool.slice(0, numUniqueCards);

    let deck = [];
    for (let i = 0; i < groupSize; i++) deck = deck.concat(pool);
    shuffle(deck);

    items.length = 0;
    deck.forEach(c => items.push(c));
}

// Cridat des de game.js abans de construir el canvas
export function selectCards(numCards, groupSize, penalty) {
    // Llegim la config real del localStorage per tenir els valors correctes
    const raw    = localStorage.getItem('memoryConfig');
    const config = raw ? JSON.parse(raw) : {};

    game.mode       = config.mode       || 1;
    game.level      = config.level      || 1;
    game.alias      = config.alias      || 'Jugador';
    game.totalScore = config.score      || 0;

    let nc, gs, pen;
    if (game.mode === 2) {
        const cfg = getMode2Config(game.level);
        nc  = cfg.numCards;
        gs  = cfg.groupSize;
        pen = cfg.penalty;
    } else {
        nc  = config.numCards  || numCards  || 6;
        gs  = config.groupSize || groupSize || 2;
        pen = config.penalty   || penalty   || 25;
    }

    game.score = 200 + (game.mode === 2 ? (game.level - 1) * 50 : 0);
    prepareCards(nc, gs, pen);
}

export function startGame() {
    updateHUD();
    game.ready        = 0;
    game.flippedCards = [];

    items.forEach((_, idx) => {
        setValue(idx, items[idx]);
        clickOff(idx);
    });

    setTimeout(() => {
        items.forEach((_, idx) => {
            setTimeout(() => {
                game.ready++;
                setValue(idx, back);
                clickOn(idx);
            }, 100 * idx);
        });
    }, 100);
}

export function clickCard(indx) {
    if (game.ready < items.length || game.flippedCards.includes(indx)) return;

    setValue(indx, items[indx]);
    clickOff(indx);
    game.flippedCards.push(indx);

    if (game.flippedCards.length === game.groupSize) {
        const tipus    = items[game.flippedCards[0]];
        const allMatch = game.flippedCards.every(id => items[id] === tipus);

        if (allMatch) {
            game.matchesLeft--;
            updateHUD();
            if (game.matchesLeft <= 0) setTimeout(onLevelWin, 500);
            game.flippedCards = [];
        } else {
            game.ready = 0;
            setTimeout(() => {
                game.flippedCards.forEach(id => { setValue(id, back); clickOn(id); });
                game.ready        = items.length;
                game.flippedCards = [];
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

        // Guardem al rànquing cada cop que passes un nivell
        saveToRanking(game.alias, game.totalScore, game.level);

        alert(`Nivell ${game.level} superat! +${game.score} punts\nTotal: ${game.totalScore}`);

        const raw    = localStorage.getItem('memoryConfig');
        const config = raw ? JSON.parse(raw) : {};
        config.level  = game.level + 1;
        config.score  = game.totalScore;
        config.isNew  = false;
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

//  Desar al rànquing 
function saveToRanking(alias, score, level) {
    const raw     = localStorage.getItem('memoryRanking');
    const ranking = raw ? JSON.parse(raw) : [];

    // Actualitzem si ja existeix entrada del mateix àlies
    const existing = ranking.findIndex(e => e.alias === alias);
    const entry = { alias, score, level, date: new Date().toLocaleDateString('ca-ES') };

    if (existing >= 0) {
        // Només actualitzem si la puntuació és millor
        if (score > ranking[existing].score) ranking[existing] = entry;
    } else {
        ranking.push(entry);
    }

    ranking.sort((a, b) => b.score - a.score);
    ranking.splice(10);
    localStorage.setItem('memoryRanking', JSON.stringify(ranking));
}

//  Desar partida 
export function saveCurrentGame() {
    const raw    = localStorage.getItem('memoryConfig');
    const config = raw ? JSON.parse(raw) : {};
    const saves  = JSON.parse(localStorage.getItem('memorySaves') || '[]');

    const saveData = {
        ...config,
        score: game.totalScore + game.score,
        level: game.level,
        date:  new Date().toLocaleDateString('ca-ES'),
        isNew: false
    };

    const idx = saves.findIndex(s => s.alias === saveData.alias && s.mode === saveData.mode);
    if (idx >= 0) saves[idx] = saveData;
    else saves.push(saveData);

    localStorage.setItem('memorySaves', JSON.stringify(saves));

    // Al Mode 2 també guardem al rànquing quan guardem partida
    if (game.mode === 2) saveToRanking(game.alias, saveData.score, game.level);

    alert('Partida guardada!');
}

//  Sortir i guardar al rànquing 
export function quitGame() {
    if (game.mode === 2 && game.totalScore + game.score > 0) {
        saveToRanking(game.alias, game.totalScore + game.score, game.level);
    }
    window.location.assign('../');
}

//  HUD 
function updateHUD() {
    const scoreEl = document.getElementById('score-display');
    const levelEl = document.getElementById('level-display');
    if (scoreEl) scoreEl.innerText = `Punts: ${game.score}`;
    if (levelEl) {
        levelEl.innerText = game.mode === 2
            ? `Nivell: ${game.level} | Total: ${game.totalScore}`
            : '';
    }
}
