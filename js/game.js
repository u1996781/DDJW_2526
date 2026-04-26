import { clickCard, items, selectCards, startGame, saveCurrentGame, quitGame } from "./memory.js";
import { drawDorsAnimat, CARD_URLS } from "./cards.js";

const CARD_W = 100, CARD_H = 140, GAP = 15, PADDING = 20;
let canvas, ctx, cards = [];

window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    selectCards();
    
    const n = items.length, cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
    canvas.width = PADDING * 2 + cols * CARD_W + (cols - 1) * GAP;
    canvas.height = PADDING * 2 + rows * CARD_H + (rows - 1) * GAP;

    items.forEach((_, idx) => {
        const col = idx % cols, row = Math.floor(idx / cols);
        cards.push({ x: PADDING + col * (CARD_W + GAP), y: PADDING + row * (CARD_H + GAP), img: null, clickable: false, isBack: false, eyeT: 0, eyeTarget: 0 });
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        cards.forEach((c, i) => { if (c.clickable && mx >= c.x && mx <= c.x + CARD_W && my >= c.y && my <= c.y + CARD_H) clickCard(i); });
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        let sobreAlguna = false;
        cards.forEach(c => {
            const over = mx >= c.x && mx <= c.x + CARD_W && my >= c.y && my <= c.y + CARD_H;
            if (c.isBack) c.eyeTarget = over ? 1 : 0;
            if (over && c.clickable) sobreAlguna = true;
        });
        canvas.style.cursor = sobreAlguna ? 'pointer' : 'default';
    });

    requestAnimationFrame(function loop() {
        cards.forEach(c => {
            const diff = c.eyeTarget - c.eyeT;
            if (Math.abs(diff) > 0.01) c.eyeT += diff * 0.1;
            else c.eyeT = c.eyeTarget;
        });
        drawAll();
        requestAnimationFrame(loop);
    });

    startGame();

    // CONNECTAR BOTONS DEL HUD (Guardar i Sortir)
    const btnSave = document.getElementById('btn-save') || document.getElementById('save');
    const btnQuit = document.getElementById('btn-quit') || document.getElementById('quit') || document.getElementById('btn-exit');
    
    if (btnSave) btnSave.addEventListener('click', saveCurrentGame);
    if (btnQuit) btnQuit.addEventListener('click', quitGame);
});

export function setValue(idx, src) {
    if (!cards[idx]) return;
    cards[idx].isBack = (src === CARD_URLS['back']);
    if (cards[idx].isBack) { cards[idx].img = null; return; }
    const img = new Image();
    img.onload = () => { cards[idx].img = img; drawAll(); };
    img.src = src;
}

export function clickOn(idx) { if (cards[idx]) cards[idx].clickable = true; }
export function clickOff(idx) { if (cards[idx]) cards[idx].clickable = false; }

function drawAll() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cards.forEach(c => {
        ctx.save();
        if (c.isBack) drawDorsAnimat(ctx, c.x, c.y, CARD_W, CARD_H, c.eyeT);
        else if (c.img) {
            ctx.beginPath();
            _roundRect(ctx, c.x, c.y, CARD_W, CARD_H, 8);
            ctx.clip();
            ctx.drawImage(c.img, c.x, c.y, CARD_W, CARD_H);
        } else {
            ctx.fillStyle = '#1e1e2e';
            _roundRect(ctx, c.x, c.y, CARD_W, CARD_H, 8);
            ctx.fill();
        }
        ctx.restore();
    });
}

function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}