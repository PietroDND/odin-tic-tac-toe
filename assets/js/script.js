/**
 * Creates a new player object.
 * @param {string} name - The name of the player.
 * @param {string} marker - The player's marker ('X' or 'O').
 * @returns {{name: string, marker: string}} The player object.
 */
const Player = (name, marker) => {
    return { name, marker };
};

const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    /**
     * Returns the current game board state.
     * @returns {string[]} The current board array.
     */
    const getBoard = () => board;

    /**
     * Sets a marker at the specified index if the cell is empty.
     * @param {number} index - The cell index.
     * @param {string} marker - The marker to place ('X' or 'O').
     * @returns {boolean} True if the move is valid and the cell was set, otherwise false.
     */
    const setCell = (index, marker) => {
        if (board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
    };
    
    /**
     * Resets the game board to its initial empty state.
     */
    const reset = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    return { getBoard, setCell, reset };
})();

//Game Controller Module
const GameController = (() => {
    const player1 = Player('Player', 'X');
    const cpu = Player('CPU', 'O');
    let difficulty = 'easy';
    let currentPlayer = player1;
    let gameOver = false;
    let winner = null;
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    /**
    * Sets the difficulty level for the CPU.
    * @param {string} level - The difficulty level ('easy', 'medium', 'hard', 'impossible').
    */
    const setDifficulty = (level) => {
        difficulty = level;
    };

    /**
    * Switches the current player between the human player and the CPU.
    */
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? cpu : player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    const getWinner = () => winner;

    const isTie = () => Gameboard.getBoard().every(cell => cell !== '') && !winner;

    /**
    * Processes a round by placing the current player's marker and checking for win/tie.
    * @param {number} index - The board index where the marker should be placed.
    */
    const playRound = (index) => {
        if (gameOver || !Gameboard.setCell(index, currentPlayer.marker)) return;

        if (checkWin(currentPlayer.marker)) {
            winner = currentPlayer.name;
            gameOver = true;
            return;
        }

        if (isTie()) {
            gameOver = true;
            return;
        }

        switchPlayer();
    };

     /**
     * Makes a move for the CPU based on difficulty level.
     */
    const playCpuMove = () => {
        if (gameOver || currentPlayer !== cpu) return;

        const available = Gameboard.getBoard()
            .map((val, idx) => (val === '' ? idx : null))
            .filter(val => val !== null);

        const randomIndex = available[Math.floor(Math.random() * available.length)];
        const optimalIndex = getMiniMaxMove(Gameboard.getBoard(), currentPlayer.marker);
        const randomValue = Math.random(); //Random value used to choose the move based on the difficulty level selected

        if (difficulty === 'easy') {
            if (randomValue >= 0.25) playRound(randomIndex);
            else playRound(optimalIndex);
        }
        if (difficulty === 'medium') {
            if (randomValue >= 0.5) playRound(randomIndex);
            else playRound(optimalIndex);
        }
        if (difficulty === 'hard') {
            if (randomValue >= 0.75) playRound(randomIndex);
            else playRound(optimalIndex);
        }
        if (difficulty === 'impossible') {
            playRound(optimalIndex);
        }
    };

    const checkWin = (marker) => {
        const board = Gameboard.getBoard();
        return winningCombos.some(combo => 
            combo.every(index => board[index] === marker)
        );
    };

    /**
     * Selects the best move for the CPU using the minimax algorithm.
     * @param {string[]} board - The current board state.
     * @param {string} marker - The current marker ('X' or 'O').
     * @returns {number} The index of the best move.
     */
    const getMiniMaxMove = (board, marker) => {
        const opponent = marker === 'X' ? 'O' : 'X';

        const minimax = (newBoard, currentMarker) => {
            const winner = evaluateBoard(newBoard);
            if (winner !== null) {
                if (winner === marker) return { score: 10 }; //CPU wins
                else if (winner === opponent) return { score: -10 }; //User wins
                else return { score: 0 }; //Tie
            }

            const moves = [];

            newBoard.forEach((cell, idx) => {
                if (cell === '') {
                    const boardCopy = [...newBoard];
                    boardCopy[idx] = currentMarker;
                    const result = minimax(boardCopy, currentMarker === marker ? opponent : marker);
                    moves.push({ index: idx, score: result.score });
                }
            });

            if (currentMarker === marker) {
                //Maximize CPU score
                return moves.reduce((best, move) => move.score > best.score ? move : best);
            } else {
                //Minimize user score
                return moves.reduce((best, move) => move.score < best.score ? move : best);
            }
        };

        const bestMove = minimax(board, marker);
        return bestMove.index;
    };

    //Helper function to evaluate board
    const evaluateBoard = (board) => {
        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (board.every(cell => cell !== '')) {
            return 'tie';
        }
        return null;
    };

    /**
    * Resets the game to its initial state.
    */
    const restart = () => {
        Gameboard.reset();
        currentPlayer = player1;
        gameOver = false;
        winner = null;
    };

    return { playRound, playCpuMove, getCurrentPlayer, getWinner, isTie, setDifficulty, restart };
})();

//Display Controller Module
const DisplayController = (() => {
    const boardContainer = document.getElementById('board');
    const messageDiv = document.getElementById('message');
    const restartBtn = document.getElementById('restart');

      /**
     * Renders the game board and updates event listeners for player moves.
     */
    const renderBoard = () => {
        boardContainer.innerHTML = '';
        const board = Gameboard.getBoard();
        
        board.forEach((cell, index) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            if (cell === '') cellDiv.textContent = cell;
            else if (cell === 'X') cellDiv.innerHTML = `<span class="material-symbols-outlined" style="font-size:80px">close</span>`;
            else cellDiv.innerHTML = `<span class="material-symbols-outlined" style="font-size:64px">circle</span>`;
            cellDiv.dataset.index = index;
            console.log(GameController.getCurrentPlayer().marker);
            if (
                cell === '' && 
                !GameController.getWinner() && 
                !GameController.isTie()
            ) {
                cellDiv.addEventListener('click', handlePlayerMove);
            }

            boardContainer.appendChild(cellDiv);
        });
    };

    const handlePlayerMove = (e) => {
        const index = parseInt(e.target.dataset.index);
        GameController.playRound(index);
        renderBoard();
        updateMessage();

        //CPU turn if not game over
        if (!GameController.getWinner() && !GameController.isTie()) {
            setTimeout(() => {
                const level = document.getElementById('difficulty').value;
                GameController.setDifficulty(level);
                GameController.playCpuMove();
                renderBoard();
                updateMessage();
            }, 300); //Added wait time for realism
        }
    };

    /**
    * Updates the UI message based on the current game state.
    */
    const updateMessage = () => {
        const winner = GameController.getWinner();
        if (winner) {
            messageDiv.textContent = `${winner} won!`;
        } else if (GameController.isTie()) {
            messageDiv.textContent = "It's a tie!";
        } else {
            messageDiv.textContent = `${GameController.getCurrentPlayer().name}'s turn.`
        }
    };

    restartBtn.addEventListener('click', () => {
        GameController.restart();
        renderBoard();
        updateMessage();
    });

    //First render
    renderBoard();
    updateMessage();

    return { renderBoard };
})();