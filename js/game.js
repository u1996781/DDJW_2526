import { clickCard, items, selectCards, startGame } from "./memory.js";

const CARD_W  = 100;
const CARD_H  = 140;
const GAP     = 15;  
const PADDING = 20;  

let canvas, ctx;

let cards = [];

window.addEventListener('DOMContentLoaded', function () {

    canvas = document.getElementById('game');
    ctx    = canvas.getContext('2d');

    selectCards();

    const n    = items.length;
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);

    canvas.width  = PADDING * 2 + cols * CARD_W + (cols - 1) * GAP;
    canvas.height = PADDING * 2 + rows * CARD_H + (rows - 1) * GAP;

    items.forEach(function (_, idx) {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        cards.push({
            x:         PADDING + col * (CARD_W + GAP),
            y:         PADDING + row * (CARD_H + GAP),
            img:       null,    
            clickable: false    
        });
    });

    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const mx   = e.clientX - rect.left;
        const my   = e.clientY - rect.top;

        cards.forEach(function (card, idx) {
            if (card.clickable &&
                mx >= card.x && mx <= card.x + CARD_W &&
                my >= card.y && my <= card.y + CARD_H) {
                clickCard(idx);
            }
        });
    });

    canvas.addEventListener('mousemove', function (e) {
        const rect       = canvas.getBoundingClientRect();
        const mx         = e.clientX - rect.left;
        const my         = e.clientY - rect.top;
        const sobreAlguna = cards.some(function (card) {
            return card.clickable &&
                   mx >= card.x && mx <= card.x + CARD_W &&
                   my >= card.y && my <= card.y + CARD_H;
        });
        canvas.style.cursor = sobreAlguna ? 'pointer' : 'default';
    });

    startGame();
});


export function setValue(idx, src) {
    const img  = new Image();
    img.onload = function () {
        cards[idx].img = img;
        drawAll();
    };
    img.src = src;
}


export function clickOff(idx) {
    cards[idx].clickable = false;
}


export function clickOn(idx) {
    cards[idx].clickable = true;
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cards.forEach(function (card) {
        if (card.img) {
            ctx.save();
            ctx.shadowColor   = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur    = 10;
            ctx.shadowOffsetY = 4;

            drawRoundedImage(card.img, card.x, card.y, CARD_W, CARD_H, 8);

            ctx.restore();
        } else {
            ctx.fillStyle = '#2a2a2a';
            roundRect(card.x, card.y, CARD_W, CARD_H, 8);
            ctx.fill();
        }
    });
}

function drawRoundedImage(img, x, y, w, h, r) {
    ctx.save();
    roundRect(x, y, w, h, r);
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
}

function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,     y + h, x,     y + h - r, r);
    ctx.lineTo(x,     y + r);
    ctx.arcTo(x,     y,     x + r, y,         r);
    ctx.closePath();
}