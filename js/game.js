import { clickCard, items, selectCards, startGame } from "./memory.js";
import { drawDorsAnimat } from "./cards.js";
import { CARD_URLS } from "./cards.js";
const CARD_W  = 100;
const CARD_H  = 140;
const GAP     = 15;
const PADDING = 20;
let canvas, ctx;
let cards = [];
let animRunning = false;
window.addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('game');
    ctx    = canvas.getContext('2d');
    const savedConfig = localStorage.getItem('memoryConfig');
    const config = savedConfig ? JSON.parse(savedConfig) : { numCards: 6, groupSize: 2, difficulty: 25 };
    selectCards(config.numCards, config.groupSize, config.difficulty);
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
            clickable: false,
            isBack:    false,
            eyeT:      1,
            eyeDir:    -1,
            eyeWaiting: false
        });
    });
    drawAll();
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
        const rect = canvas.getBoundingClientRect();
        const mx   = e.clientX - rect.left;
        const my   = e.clientY - rect.top;

        let sobreAlguna = false;
        cards.forEach(function(card) {
            const sobre = mx >= card.x && mx <= card.x + CARD_W &&
                          my >= card.y && my <= card.y + CARD_H;
            // Obrim l'ull si fem hover sobre una carta de dors clicable
            if (card.isBack) card.eyeTarget = (sobre && card.clickable) ? 1 : 0;
            if (sobre && card.clickable) sobreAlguna = true;
        });
        canvas.style.cursor = sobreAlguna ? 'pointer' : 'default';
    });

    // Quan el ratolí surt del canvas, tanquem tots els ulls
    canvas.addEventListener('mouseleave', function() {
        cards.forEach(function(card) { if (card.isBack) card.eyeTarget = 0; });
    });
    startGame();
    startEyeAnim();
});

// ─── Animació dels ulls per hover ────────────────────────────────────────────
// Cada carta té eyeTarget: 0 = tancat (sense hover), 1 = obert (amb hover)
function startEyeAnim() {
    if (animRunning) return;
    animRunning = true;

    // Totes les cartes comencen tancades
    cards.forEach(function(card) { card.eyeT = 0; card.eyeTarget = 0; });

    function loop() {
        const hasBack = cards.some(c => c.isBack);
        if (!hasBack) { animRunning = false; return; }

        let changed = false;
        cards.forEach(function(card) {
            if (!card.isBack) return;
            // Animem suaument cap al target (obert o tancat)
            const diff = card.eyeTarget - card.eyeT;
            if (Math.abs(diff) > 0.01) {
                card.eyeT += diff * 0.15;
                changed = true;
            } else {
                card.eyeT = card.eyeTarget;
            }
        });

        if (changed) drawAll();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

export function setValue(idx, src) {
    // Detectem si és la carta de dors per animar-la
    cards[idx].isBack = (src === CARD_URLS['back']);
    if (cards[idx].isBack) {
        cards[idx].img = null;
        drawAll();
        startEyeAnim();
        return;
    }
    const img  = new Image();
    img.onload = function () {
        cards[idx].img = img;
        cards[idx].isBack = false;
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
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cards.forEach(function (card) {
        ctx.save();
        ctx.shadowColor   = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur    = 10;
        ctx.shadowOffsetY = 4;
        if (card.isBack) {
            // Dors animat: dibuix directe amb l'ull
            drawDorsAnimat(ctx, card.x, card.y, CARD_W, CARD_H, card.eyeT);
        } else if (card.img) {
            // Cara de la carta: imatge normal
            drawRoundedImage(card.img, card.x, card.y, CARD_W, CARD_H, 8);
        } else {
            // Placeholder mentre carrega
            ctx.fillStyle = '#1e1e2e';
            roundRect(card.x, card.y, CARD_W, CARD_H, 8);
            ctx.fill();
        }
        ctx.restore();
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