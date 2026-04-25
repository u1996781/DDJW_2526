import { $ } from '../library/jquery-4.0.0.slim.module.min.js';
$(function() {
    $('#play').on('click', function() {
        $('#main-buttons').hide();
        $('#menu-config').show();
    });
    $('#start-game').on('click', function() {
        const config = {
            alias: $('#alias').val() || 'Jugador',
            numCards: parseInt($('#num-cards').val()),
            groupSize: parseInt($('#group-size').val()),
            difficulty: parseInt($('#difficulty').val())
        };
        localStorage.setItem('memoryConfig', JSON.stringify(config));
        window.location.assign("./html/game.html");
    });
    $('#options, #saves').on('click', function() {
        alert("Opció no disponible en aquesta versió.");
    });
    $('#exit').on('click', function() {
        if(confirm("Vols tancar el joc?")) {
            window.close();
        }
    });
});