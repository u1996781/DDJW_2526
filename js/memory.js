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
    ready: 0,
    flippedCards: [],
    score: 200,
    matchesLeft: 0,
    groupSize: 2,
    penalty: 25
}
function shuffe(arr){
    arr.sort(() => Math.random() - 0.5);
}
export function selectCards(numUniqueCards = 6, groupSize = 2, penalty = 25){
    game.groupSize = groupSize;
    game.matchesLeft = numUniqueCards;
    game.penalty = penalty;
    let tempItems = resources.slice();
    shuffe(tempItems);
    tempItems = tempItems.slice(0, numUniqueCards);
    let deck = [];
    for(let i = 0; i < groupSize; i++) {
        deck = deck.concat(tempItems);
    }
    shuffe(deck);
    items.length = 0;
    deck.forEach(c => items.push(c));
}
export function startGame(){
    game.ready = 0;
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
export function clickCard(indx){
    if (game.ready < items.length || game.flippedCards.includes(indx)) return;
    setValue(indx, items[indx]);
    clickOff(indx);
    game.flippedCards.push(indx);
    if (game.flippedCards.length === game.groupSize) {
        const firstCardType = items[game.flippedCards[0]];
        const allMatch = game.flippedCards.every(id => items[id] === firstCardType);
        if (allMatch) {
            game.matchesLeft--;
            if (game.matchesLeft <= 0) {
                setTimeout(() => {
                    alert(`Victòria! Punts: ${game.score}`);
                    window.location.assign("../");
                }, 500);
            }
            game.flippedCards = [];
        }
        else {
            game.ready = 0;
            setTimeout(() => {
                game.flippedCards.forEach(id => {
                    setValue(id, back);
                    clickOn(id);
                });
                game.ready = items.length;
                game.flippedCards = [];
            }, 1000);
            game.score -= game.penalty;
            const scoreDisplay = document.getElementById('score-display');
            if(scoreDisplay) scoreDisplay.innerText = `Punts: ${game.score}`;
            if (game.score <= 0) {
                setTimeout(() => {
                    alert("Has perdut!");
                    window.location.assign("../");
                }, 500);
            }
        }
    }
}