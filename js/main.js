import { $ } from '../library/jquery-4.0.0.slim.module.min.js';


function showScreen(id) {
    $('.screen').hide();
    $('#' + id).show();
}

// Opcions globals (localStorage)

function loadOpts() {
    const raw = localStorage.getItem('memoryOpts');
    return raw ? JSON.parse(raw) : { cards: 6, group: 2, diff: 25, m2start: 1 };
}

function saveOpts(opts) {
    localStorage.setItem('memoryOpts', JSON.stringify(opts));
}

//Ranking (localStorage) 

function loadRanking() {
    const raw = localStorage.getItem('memoryRanking');
    return raw ? JSON.parse(raw) : [];
}

function renderRanking() {
    const list = loadRanking();
    const $div = $('#ranking-list');
    $div.empty();

    if (list.length === 0) {
        $div.append('<p class="hint">Encara no hi ha puntuacions.</p>');
        return;
    }

    const $table = $('<table class="ranking-table"></table>');
    $table.append('<tr><th>#</th><th>Àlies</th><th>Punts</th><th>Nivell</th></tr>');

    list.slice(0, 10).forEach(function(entry, i) {
        $table.append(
            `<tr>
                <td>${i + 1}</td>
                <td>${entry.alias}</td>
                <td>${entry.score}</td>
                <td>${entry.level}</td>
            </tr>`
        );
    });

    $div.append($table);
}

// Partides guardades (localStorage) 

function loadSaves() {
    const raw = localStorage.getItem('memorySaves');
    return raw ? JSON.parse(raw) : [];
}

function renderSaves() {
    const saves = loadSaves();
    const $div  = $('#saves-list');
    $div.empty();

    if (saves.length === 0) {
        $('#no-saves').show();
        return;
    }

    $('#no-saves').hide();

    saves.forEach(function(save, i) {
        const modeLabel = save.mode === 2 ? 'Mode 2' : 'Mode 1';
        const $row = $(
            `<div class="save-row">
                <div class="save-info">
                    <span class="save-alias">${save.alias}</span>
                    <span class="save-detail">${modeLabel} · Nivell ${save.level} · ${save.score} pts</span>
                    <span class="save-date">${save.date}</span>
                </div>
                <button class="btn-load center btn-verd" data-idx="${i}">Continuar</button>
                <button class="btn-del center btn-vermell" data-idx="${i}">Eliminar</button>
            </div>`
        );
        $div.append($row);
    });

    // Clic a Continuar
    $div.find('.btn-load').on('click', function() {
        const idx  = parseInt($(this).data('idx'));
        const save = loadSaves()[idx];
        localStorage.setItem('memoryConfig', JSON.stringify(save));
        window.location.assign('./html/game.html');
    });

    // Clic a Eliminar
    $div.find('.btn-del').on('click', function() {
        const idx   = parseInt($(this).data('idx'));
        const saves = loadSaves();
        saves.splice(idx, 1);
        localStorage.setItem('memorySaves', JSON.stringify(saves));
        renderSaves();
    });
}

//  Inicialització quan la pàgina carrega

$(function() {

    // Apliquem opcions guardades als selects d'opcions
    const opts = loadOpts();
    $('#opt-cards').val(opts.cards);
    $('#opt-group').val(opts.group);
    $('#opt-diff').val(opts.diff);
    $('#opt-m2start').val(opts.m2start);

    // Apliquem opcions als selects de Mode 1
    $('#m1-cards').val(opts.cards);
    $('#m1-group').val(opts.group);
    $('#m1-diff').val(opts.diff);

    // Apliquem opcions a Mode 2
    $('#m2-start').val(opts.m2start);

    //  Navegació des de la pantalla principal 

    $('#btn-play').on('click', function() {
        showScreen('screen-mode');
    });

    $('#btn-scores').on('click', function() {
        renderRanking();
        showScreen('screen-scores');
    });

    $('#btn-opts').on('click', function() {
        showScreen('screen-opts');
    });

    $('#btn-saves').on('click', function() {
        renderSaves();
        showScreen('screen-saves');
    });

    $('#btn-exit').on('click', function() {
        if (confirm('Vols tancar el joc?')) window.close();
    });

    //  Pantalla tria de mode 

    $('#btn-mode1').on('click', function() {
        showScreen('screen-mode1');
    });

    $('#btn-mode2').on('click', function() {
        showScreen('screen-mode2');
    });

    $('#btn-back-mode').on('click', function() {
        showScreen('screen-main');
    });

    //  Mode 1: Iniciar partida 

    $('#btn-start-mode1').on('click', function() {
        const config = {
            mode:      1,
            alias:     $('#alias').val().trim() || 'Jugador',
            numCards:  parseInt($('#m1-cards').val()),
            groupSize: parseInt($('#m1-group').val()),
            penalty:   parseInt($('#m1-diff').val()),
            level:     1,
            score:     0,
            isNew:     true
        };
        localStorage.setItem('memoryConfig', JSON.stringify(config));
        window.location.assign('./html/game.html');
    });

    $('#btn-back-mode1').on('click', function() {
        showScreen('screen-mode');
    });

    //  Mode 2: Iniciar partida 

    $('#btn-start-mode2').on('click', function() {
        const startLevel = parseInt($('#m2-start').val());
        const config = {
            mode:      2,
            alias:     $('#alias').val().trim() || 'Jugador',
            level:     startLevel,
            score:     0,
            isNew:     true
        };
        localStorage.setItem('memoryConfig', JSON.stringify(config));
        window.location.assign('./html/game.html');
    });

    $('#btn-back-mode2').on('click', function() {
        showScreen('screen-mode');
    });

    //  Puntuacions 

    $('#btn-clear-scores').on('click', function() {
        if (confirm('Esborrar tot el rànquing?')) {
            localStorage.removeItem('memoryRanking');
            renderRanking();
        }
    });

    $('#btn-back-scores').on('click', function() {
        showScreen('screen-main');
    });

    //  Opcions 

    $('#btn-save-opts').on('click', function() {
        const opts = {
            cards:   parseInt($('#opt-cards').val()),
            group:   parseInt($('#opt-group').val()),
            diff:    parseInt($('#opt-diff').val()),
            m2start: parseInt($('#opt-m2start').val())
        };
        saveOpts(opts);
        // Actualitzem també els selects de Mode 1 i Mode 2
        $('#m1-cards').val(opts.cards);
        $('#m1-group').val(opts.group);
        $('#m1-diff').val(opts.diff);
        $('#m2-start').val(opts.m2start);
        alert('Opcions desades!');
        showScreen('screen-main');
    });

    $('#btn-back-opts').on('click', function() {
        showScreen('screen-main');
    });

    //  Carregar 

    $('#btn-back-saves').on('click', function() {
        showScreen('screen-main');
    });

});
