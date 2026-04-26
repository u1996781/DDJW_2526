const BLUE    = '#3A7BF7';
const ORANGE  = '#F7903A';

function makeSVG(innerSVG) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="140" viewBox="0 0 100 140">
        <rect x="2" y="2" width="96" height="136" rx="8" ry="8" fill="#1e1e2e" stroke="#44445a" stroke-width="2"/>
        ${innerSVG}
    </svg>`;
}


function svgCercleBlau() {
    return makeSVG(`<circle cx="50" cy="70" r="30" fill="${BLUE}" stroke="#5a9bff" stroke-width="2"/>`);
}

function svgCerclePortocal() {
    return makeSVG(`<circle cx="50" cy="70" r="30" fill="${ORANGE}" stroke="#ffb06a" stroke-width="2"/>`);
}

function svgQuadratBlau() {
    return makeSVG(`<rect x="22" y="42" width="56" height="56" rx="6" ry="6" fill="${BLUE}" stroke="#5a9bff" stroke-width="2"/>`);
}

function svgQuadratPortocal() {
    return makeSVG(`<rect x="22" y="42" width="56" height="56" rx="6" ry="6" fill="${ORANGE}" stroke="#ffb06a" stroke-width="2"/>`);
}

function svgTriangleBlau() {
    return makeSVG(`<polygon points="50,30 84,108 16,108" fill="${BLUE}" stroke="#5a9bff" stroke-width="2" stroke-linejoin="round"/>`);
}

function svgTrianglePortocal() {
    return makeSVG(`<polygon points="50,30 84,108 16,108" fill="${ORANGE}" stroke="#ffb06a" stroke-width="2" stroke-linejoin="round"/>`);
}

function svgDors() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="140" viewBox="0 0 100 140">
        <rect x="2" y="2" width="96" height="136" rx="8" ry="8" fill="#12122a" stroke="#44445a" stroke-width="2"/>
        <rect x="7" y="7" width="86" height="126" rx="6" ry="6" fill="none" stroke="#2a2a5a" stroke-width="1.5"/>

        <g fill="#1a1a40" stroke="#3A7BF7" stroke-width="0.8">
            <polygon points="50,10 58,18 50,26 42,18"/>
            <polygon points="66,10 74,18 66,26 58,18"/>
            <polygon points="34,10 42,18 34,26 26,18"/>
            <polygon points="82,10 90,18 82,26 74,18"/>
            <polygon points="18,10 26,18 18,26 10,18"/>

            <polygon points="50,26 58,34 50,42 42,34"/>
            <polygon points="66,26 74,34 66,42 58,34"/>
            <polygon points="34,26 42,34 34,42 26,34"/>
            <polygon points="82,26 90,34 82,42 74,34"/>
            <polygon points="18,26 26,34 18,42 10,34"/>

            <polygon points="50,100 58,108 50,116 42,108"/>
            <polygon points="66,100 74,108 66,116 58,108"/>
            <polygon points="34,100 42,108 34,116 26,108"/>
            <polygon points="82,100 90,108 82,116 74,108"/>
            <polygon points="18,100 26,108 18,116 10,108"/>

            <polygon points="50,116 58,124 50,132 42,124"/>
            <polygon points="66,116 74,124 66,132 58,124"/>
            <polygon points="34,116 42,124 34,132 26,124"/>
        </g>

        <polygon points="50,48 53,58 64,58 55,64 58,75 50,69 42,75 45,64 36,58 47,58" fill="#3A7BF7" opacity="0.9"/>
        <text x="50" y="108" font-family="serif" font-size="16" font-weight="bold" fill="#3A7BF7" opacity="0.8" text-anchor="middle">M</text>
    </svg>`;
}

function svgAURL(svgString) {  
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

export const CARD_URLS = {
    'cb':   svgAURL(svgCercleBlau()),
    'co':   svgAURL(svgCerclePortocal()),
    'sb':   svgAURL(svgQuadratBlau()),
    'so':   svgAURL(svgQuadratPortocal()),
    'tb':   svgAURL(svgTriangleBlau()),
    'to':   svgAURL(svgTrianglePortocal()),
    'back': svgAURL(svgDors())
};
//  Funció exportada per animar el dors al canvas 

export function drawDorsAnimat(ctx, x, y, w, h, eyeT) {
    // Escalem el sistema de coordenades del SVG (100x100) a la carta
    // centrant l'ull verticalment a la carta
    const sc  = w / 100;
    const ox  = x;                      // origen X
    const oy  = y + (h - w) / 2;       // origen Y centrat

    // Funció per transformar coordenades SVG → canvas
    function px(svgX) { return ox + svgX * sc; }
    function py(svgY) { return oy + svgY * sc; }

    ctx.save();

    //  Fons de la carta 
    ctx.beginPath();
    _roundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#44445a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Retallem dins la carta
    ctx.beginPath();
    _roundRect(ctx, x, y, w, h, 8);
    ctx.clip();

    //  Globus ocular: M10 50 Q50 15 90 50 Q50 85 10 50 Z
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.moveTo(px(10), py(50));
    ctx.quadraticCurveTo(px(50), py(15), px(90), py(50));
    ctx.quadraticCurveTo(px(50), py(85), px(10), py(50));
    ctx.closePath();
    ctx.fill();

    //  Pupil·la: circle cx=50 cy=50 r=15
    ctx.beginPath();
    ctx.fillStyle = '#0f172a';
    ctx.arc(px(50), py(50), 15 * sc, 0, Math.PI * 2);
    ctx.fill();

    //  Brillantor: circle cx=56 cy=44 r=4 
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(px(56), py(44), 4 * sc, 0, Math.PI * 2);
    ctx.fill();

    const bY  = 75  + (20  - 75)  * eyeT;   // bottom Y dels extrems (75→20)
    const cY  = 100 + (-10 - 100) * eyeT;   // control Y de la corba (100→-10)

    // Color: #3b82f6 → #f43f5e
    const r = Math.round(0x3b + (0xf4 - 0x3b) * eyeT);
    const g = Math.round(0x82 + (0x3f - 0x82) * eyeT);
    const b = Math.round(0xf6 + (0x5e - 0xf6) * eyeT);
    ctx.fillStyle = `rgb(${r},${g},${b})`;

    ctx.beginPath();
    ctx.moveTo(px(10), py(40));
    ctx.quadraticCurveTo(px(50), py(10), px(90), py(40));
    ctx.lineTo(px(90), py(bY));
    ctx.quadraticCurveTo(px(50), py(cY), px(10), py(bY));
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// Helper intern
function _roundRect(ctx, x, y, w, h, r) {
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
