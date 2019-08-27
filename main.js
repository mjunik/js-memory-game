const memoryGame = {
    tilesNumber: 20,
    movesCount: 0,
    timer: 0,
    tiles: [],
    timerInterval: null,

    gameBoard: document.getElementById('js_gameBoard'),
    congratulationsOverlay: document.getElementById('js_gameBoardOverlay'),
    movesCountHolder: document.getElementById('js_movesCount'),
    timerHolder: document.getElementById('js_timer'),

    startGame() {
        this.resetGame();

        this.generateTiles();

        this.displayBoard();

        this.startTimer();
    },

    resetGame() {
        this.tiles = [];
        this.movesCount = 0;
        this.timer = 0;
        this.gameBoard.innerHTML = '';
        this.congratulationsOverlay.classList.add('hidden');
        this.movesCountHolder.innerText = this.movesCount;
        this.timerHolder.innerText = this.timer;
    },

    generateTiles() {
        // generate an array with pairs of numbers [0, 0, 1, 1, 2, 2, ..., 7, 7]
        for (let i = 0; i < this.tilesNumber; i++) {
            this.tiles.push(Math.floor(i / 2));
        }

        // shuffle array items
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const swap = Math.floor(Math.random() * i);
            const tmp = this.tiles[i];
            this.tiles[i] = this.tiles[swap];
            this.tiles[swap] = tmp;
        }
    },

    displayBoard() {
        // add tiles to the board
        this.tiles.forEach((tile) => {
            this.gameBoard.innerHTML += `<div class="tile" data-tile="${tile}" style="background-image: url('./tile-images/question-mark.png')"></div>`;
        });

        // add on click action to every tile
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.addEventListener('click', (e) => this.clickTile(e)));
    },

    clickTile(e) {
        const tile = e.target;

        // do nothing if already matched or active tile has been clicked
        if (tile.classList.contains('match') || tile.classList.contains('active')) {
            return;
        }

        // show clicked tile
        this.showTile(tile);

        // if a second tile is clicked:
        const activeTiles = document.querySelectorAll('.active');
        if (activeTiles.length === 2) {
            this.increaseMoveCount();

            this.checkMatch(activeTiles);

            this.finishGame();
        }
    },

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timerHolder.innerText = this.timer;
        }, 1000);
    },

    stopTimer() {
        clearInterval(this.timerInterval);
    },

    showTile(tile) {
        const tileNumber = tile.dataset.tile;
        tile.classList.add('active');
        tile.style.backgroundImage = `url('./tile-images/tile_${tileNumber}.png')`;
    },

    hideTile(tile) {
        setTimeout(() => {
            tile.style.backgroundImage = "url('./tile-images/question-mark.png')";
            tile.classList.remove('active');
        }, 750);
    },

    removeTiles(tiles) {
        tiles.forEach(tile => {
            tile.classList.add('match');
            setTimeout(() => {
                tile.classList.remove('active');
                tile.style.backgroundImage = 'none';
            }, 250);
        });

    },

    checkMatch(tiles) {
        if (tiles[0].dataset.tile === tiles[1].dataset.tile) {
            this.removeTiles(tiles);
        } else {
            tiles.forEach(tile => this.hideTile(tile));
        }
    },

    increaseMoveCount() {
        this.movesCount++;
        this.movesCountHolder.innerText = this.movesCount;
    },

    finishGame() {
        const matchedTiles = document.querySelectorAll('.match');
        if (matchedTiles.length === this.tilesNumber) {
            this.stopTimer();
            setTimeout(() => {
                this.congratulationsOverlay.innerHTML = `<p>Congratulations!<br/><br/>You've finished the game<br/>with ${this.movesCount} moves in ${this.timer} seconds</p>`;
                this.congratulationsOverlay.classList.remove('hidden');
            }, 250);
        }
    }
};

const startGameBtn = document.getElementById('js_startGameBtn');
startGameBtn.addEventListener('click', () => memoryGame.startGame());