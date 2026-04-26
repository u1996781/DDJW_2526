import { $ } from '../library/jquery-4.0.0.slim.module.min.js';

function showScreen(id) {
    $('.screen').hide();
    $('#screen-main').hide();
    $('#' + id).show();
}

function loadOpts() {
    const raw = localStorage.getItem('memoryOpts');
    return raw ? JSON.parse(raw) : { cards: 6, group: 2, diff: 25, m2start: 1 };
}

function saveOpts(opts) {
    localStorage.setItem('memoryOpts', JSON.stringify(opts));
}

$(function() {
    const opts = loadOpts();
    // Inicialització de valors als formularis
    $('#opt-cards').val(opts.cards);
    $('#opt-group').val(opts.group);
    $('#opt-diff').val(opts.diff);
    $('#opt-m2start').val(opts.m2start);
    $('#m1-cards').val(opts.cards);
    $('#m1-group').val(opts.group);
    $('#m1-diff').val(opts.diff);
    $('#m2-start').val(opts.m2start);

    // Esdeveniments de navegació
    $('#btn-play').on('click', function() { showScreen('screen-mode'); });
    $('#btn-scores').on('click', function() { renderRanking(); showScreen('screen-scores'); });
    $('#btn-opts').on('click', function() { showScreen('screen-opts'); });
    $('#btn-saves').on('click', function() { renderSaves(); showScreen('screen-saves'); });
    $('#btn-exit').on('click', function() { if (confirm('Vols tancar el joc?')) window.close(); });

    $('#btn-back-mode, #btn-back-mode1, #btn-back-mode2, #btn-back-scores, #btn-back-opts, #btn-back-saves').on('click', function() {
        $('.screen').hide(); 
        $('#screen-main').show();
    });

    $('#btn-mode1').on('click', function() { showScreen('screen-mode1'); });
    $('#btn-mode2').on('click', function() { showScreen('screen-mode2'); });

    // Lògica d'inici de partides
    $('#btn-start-mode1').on('click', function() {
        const config = { 
            mode: 1, 
            alias: $('#alias').val() || 'Jugador', 
            numCards: parseInt($('#m1-cards').val()), 
            groupSize: parseInt($('#m1-group').val()), 
            penalty: parseInt($('#m1-diff').val()) 
        };
        localStorage.setItem('memoryConfig', JSON.stringify(config));
        window.location.assign('./html/game.html');
    });

    $('#btn-start-mode2').on('click', function() {
        const config = { 
            mode: 2, 
            alias: $('#alias').val() || 'Jugador', 
            level: parseInt($('#m2-start').val()), 
            score: 0 
        };
        localStorage.setItem('memoryConfig', JSON.stringify(config));
        window.location.assign('./html/game.html');
    });

    // Gestió de rànquing i opcions
    $('#btn-clear-scores').on('click', function() {
        if (confirm('Estàs segur que vols esborrar tot el rànquing?')) {
            localStorage.removeItem('memoryRanking');
            renderRanking();
        }
    });

    $('#btn-save-opts').on('click', function() {
        const opts = {
            cards: parseInt($('#opt-cards').val()),
            group: parseInt($('#opt-group').val()),
            diff: parseInt($('#opt-diff').val()),
            m2start: parseInt($('#opt-m2start').val())
        };
        saveOpts(opts);
        
        $('#m1-cards').val(opts.cards);
        $('#m1-group').val(opts.group);
        $('#m1-diff').val(opts.diff);
        $('#m2-start').val(opts.m2start);
        
        alert('Opcions desades correctament!');
        $('.screen').hide(); 
        $('#screen-main').show();
    });
});

function renderRanking() {
    const list = JSON.parse(localStorage.getItem('memoryRanking') || '[]');
    const $div = $('#ranking-list'); 
    $div.empty();
    if (list.length === 0) { 
        $div.append('<p class="hint">Encara no hi ha puntuacions.</p>'); 
        return; 
    }
    const $table = $('<table class="ranking-table"><tr><th>#</th><th>Àlies</th><th>Punts</th><th>Nivell</th></tr></table>');
    list.forEach((e, i) => $table.append(`<tr><td>${i+1}</td><td>${e.alias}</td><td>${e.score}</td><td>${e.level}</td></tr>`));
    $div.append($table);
}

function renderSaves() {
    const saves = JSON.parse(localStorage.getItem('memorySaves') || '[]');
    const $div = $('#saves-list'); 
    $div.empty();
    
    if (saves.length === 0) { 
        $('#no-saves').show(); 
        return; 
    }
    $('#no-saves').hide();
    
    saves.forEach((s, i) => {
        const modeLabel = s.mode === 2 ? 'Mode 2' : 'Mode 1';
        const $row = $(
            `<div class="save-row">
                <div class="save-info">
                    <span class="save-alias">${s.alias}</span>
                    <span class="save-detail">${modeLabel} · Nivell ${s.level} · ${s.score} pts</span>
                    <span class="save-date">${s.date || ''}</span>
                </div>
                <button class="btn-load center btn-verd" style="margin-top:0; width:6rem;" data-idx="${i}">Carregar</button>
                <button class="btn-del center btn-vermell" style="margin-top:0; width:6rem;" data-idx="${i}">Esborrar</button>
            </div>`
        );
        $div.append($row);
    });

    $('.btn-load').off('click').on('click', function() {
        const s = JSON.parse(localStorage.getItem('memorySaves'))[$(this).data('idx')];
        localStorage.setItem('memoryConfig', JSON.stringify(s));
        window.location.assign('./html/game.html');
    });

    $('.btn-del').off('click').on('click', function() {
        const idx = $(this).data('idx');
        const savesList = JSON.parse(localStorage.getItem('memorySaves') || '[]');
        savesList.splice(idx, 1);
        localStorage.setItem('memorySaves', JSON.stringify(savesList));
        renderSaves(); 
    });
}