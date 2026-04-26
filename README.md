# Joc de Memòria - Treball Individual DDJW

## 1. Introducció
Aquest projecte consisteix en la implementació d'un joc de memòria (Memory) desenvolupat amb **JavaScript**. El joc s'ha construït sobre la base vista a classe, ampliant les seves funcionalitats per incloure nous modes de joc, dificultats dinàmiques i un sistema de rànquing local.

## 2. Descripció del disseny del joc
El joc presenta un disseny modern i coherent amb una interfície d'usuari basada en pantalles gestionades amb jQuery. S'han implementat les següents característiques:

* **Selecció de Mida de Grup:** L'usuari pot triar si vol jugar buscant parelles (2), trios (3) o quartets (4) de cartes.
* **Mode 1 (Partida única):** Un mode on el jugador configura el nombre de cartes, la mida del grup i la penalització per error abans de començar.
* **Mode 2 (Progressiu):** Un mode on la dificultat augmenta automàticament a cada nivell, augmentant el nombre de cartes i la mida del grup de forma contínua.
* **Estètica i Art:** Totes les cartes han estat programades directament en **SVG** dins del codi, evitant l'ús d'imatges externes o programes de dibuix vectorial.

## 3. Implementació rellevant
Les parts més destacades de la programació inclouen:

* **Motor de Canvas:** S'ha utilitzat un `requestAnimationFrame` per gestionar una animació del dors de les cartes, on l'ull de la carta segueix el moviment del ratolí (hover).
* **Gestió de dades:** S'ha utilitzat `localStorage` per persistir el rànquing de les 10 millors puntuacions i per implementar el sistema de guardar i carregar partides.
* **SVG dinàmic:** Les imatges de les cartes es generen mitjançant cadenes de text SVG convertides a Data URLs en temps real per ser dibuixades en el Canvas.

## 4. Conclusions i problemes trobats
El desenvolupament d'aquest projecte ha permès aprofundir en la manipulació de gràfics 2D i en la gestió de branques amb Git. Els principals problemes trobats han estat:

1.  **Renderització de SVG en Canvas:** Inicialment, els patrons complexos i alguns elements dels SVG no es visualitzaven correctament o mostraven fons blancs. Es va resoldre simplificant les formes geomètriques i assegurant un rectangle de fons sòlid en cada definició SVG.
2.  **Conflictes de Git:** En fer el merge amb el repositori base del professor per actualitzar la teoria, van aparèixer nombrosos conflictes. Es van resoldre manualment prioritzant la lògica de modes de joc personalitzada.
3.  **Animacions:** Coordinar el temps d'espera (timeout) entre mostrar les cartes al principi i permetre el clic de l'usuari va requerir una gestió precisa de l'estat `ready` del joc.
