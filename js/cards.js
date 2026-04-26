const BLUE    = '#3A7BF7';
const ORANGE  = '#F7903A';

function makeSVG(innerSVG) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="140" viewBox="0 0 100 140">
        <rect width="100" height="140" fill="#1e1e2e"/>
        <rect x="2" y="2" width="96" height="136" rx="8" ry="8" fill="#1e1e2e" stroke="#44445a" stroke-width="2"/>
        ${innerSVG}
    </svg>`;
}

function svgCercleBlau() { return makeSVG(`<circle cx="50" cy="70" r="30" fill="${BLUE}" stroke="#5a9bff" stroke-width="2"/>`); }
function svgCerclePortocal() { return makeSVG(`<circle cx="50" cy="70" r="30" fill="${ORANGE}" stroke="#ffb06a" stroke-width="2"/>`); }
function svgQuadratBlau() { return makeSVG(`<rect x="22" y="42" width="56" height="56" rx="6" ry="6" fill="${BLUE}" stroke="#5a9bff" stroke-width="2"/>`); }
function svgQuadratPortocal() { return makeSVG(`<rect x="22" y="42" width="56" height="56" rx="6" ry="6" fill="${ORANGE}" stroke="#ffb06a" stroke-width="2"/>`); }
function svgTriangleBlau() { return makeSVG(`<polygon points="50,30 84,108 16,108" fill="${BLUE}" stroke="#5a9bff" stroke-width="2" stroke-linejoin="round"/>`); }
function svgTrianglePortocal() { return makeSVG(`<polygon points="50,30 84,108 16,108" fill="${ORANGE}" stroke="#ffb06a" stroke-width="2" stroke-linejoin="round"/>`); }

function svgDors() {
    return makeSVG(`<g fill="#1a1a40" stroke="#3A7BF7" stroke-width="0.8">
        <rect x="10" y="10" width="80" height="120" rx="4" fill="none" stroke="#2a2a5a" stroke-width="1.5"/>
        <text x="50" y="80" font-family="serif" font-size="40" font-weight="bold" fill="#3A7BF7" opacity="0.2" text-anchor="middle">M</text>
    </g>`);
}

function svgAURL(svgString) {  
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

export const CARD_URLS = {
    'cb': svgAURL(svgCercleBlau()),
    'co': svgAURL(svgCerclePortocal()),
    'sb': svgAURL(svgQuadratBlau()),
    'so': svgAURL(svgQuadratPortocal()),
    'tb': svgAURL(svgTriangleBlau()),
    'to': svgAURL(svgTrianglePortocal()),
    'back': svgAURL(svgDors())
};

export function drawDorsAnimat(ctx, x, y, w, h, eyeT) {
    const sc = w / 100;
    const ox = x;
    const oy = y + (h - w) / 2;
    function px(svgX) { return ox + svgX * sc; }
    function py(svgY) { return oy + svgY * sc; }

    ctx.save();
    ctx.beginPath();
    _roundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#44445a';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.clip();

    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.moveTo(px(10), py(50));
    ctx.quadraticCurveTo(px(50), py(15), px(90), py(50));
    ctx.quadraticCurveTo(px(50), py(85), px(10), py(50));
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#0f172a';
    ctx.arc(px(50), py(50), 15 * sc, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(px(56), py(44), 4 * sc, 0, Math.PI * 2);
    ctx.fill();

    const bY = 75 + (20 - 75) * eyeT;
    const cY = 100 + (-10 - 100) * eyeT;
    const r = Math.round(0x3b + (0xf4 - 0x3b) * eyeT);
    const g = Math.round(0x82 + (0x3f - 0x82) * eyeT);
    const b = Math.round(0xf6 + (0x5e - 0xf6) * eyeT);
    ctx.fillStyle = `rgb(${r},${g},${b})`;

    ctx.beginPath();
    ctx.moveTo(px(10), py(40));
    ctx.quadraticCurveTo(px(50), py(10), px(90), py(40));
    ctx.lineTo(px(90), py(bY));
    ctx.quadraticCurveTo(px(50), py(cY), px(10), py(bY));
    ctx.fill();
    ctx.restore();
}

function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}