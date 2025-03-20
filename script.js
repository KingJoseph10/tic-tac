const boardElement = document.getElementById("board");
        const statusElement = document.getElementById("status");
        const winsElement = document.getElementById("wins");
        const lossesElement = document.getElementById("losses");
        const drawsElement = document.getElementById("draws");
        let board, currentPlayer, gameMode;
        let wins = 0, losses = 0, draws = 0;
        
        function startGame(mode) {
            gameMode = mode;
            board = ["", "", "", "", "", "", "", "", ""];
            currentPlayer = "X";
            renderBoard();
            statusElement.textContent = `Player X's turn`;
        }

        function renderBoard() {
            boardElement.innerHTML = "";
            board.forEach((cell, index) => {
                const div = document.createElement("div");
                div.classList.add("cell");
                if (cell) div.classList.add("taken");
                div.textContent = cell;
                div.onclick = () => makeMove(index);
                boardElement.appendChild(div);
            });
        }

        function makeMove(index) {
            if (board[index] || checkWinner()) return;
            board[index] = currentPlayer;
            renderBoard();
            let winner = checkWinner();
            if (winner) {
                statusElement.textContent = `${winner} wins!`;
                updateScore(winner);
                return;
            }
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusElement.textContent = `Player ${currentPlayer}'s turn`;
            if (currentPlayer === "O" && gameMode !== "player") setTimeout(aiMove, 500);
        }

        function aiMove() {
            let move;
            if (gameMode === "easy") move = easyAIMove();
            else if (gameMode === "hard") move = minimax(board, "O").index;
            if (move !== undefined) makeMove(move);
        }

        function easyAIMove() {
            const available = board.map((cell, i) => cell === "" ? i : null).filter(i => i !== null);
            return available[Math.floor(Math.random() * available.length)];
        }

        function minimax(newBoard, player) {
            let availableSpots = newBoard.map((cell, i) => cell === "" ? i : null).filter(i => i !== null);
            if (checkWinner(newBoard)) return { score: player === "X" ? -10 : 10 };
            if (availableSpots.length === 0) return { score: 0 };
            let moves = [];
            availableSpots.forEach(spot => {
                let move = {}; move.index = spot;
                newBoard[spot] = player;
                move.score = minimax(newBoard, player === "O" ? "X" : "O").score;
                newBoard[spot] = "";
                moves.push(move);
            });
            return moves.reduce((best, move) => player === "O" ? (move.score > best.score ? move : best) : (move.score < best.score ? move : best));
        }

        function checkWinner(boardState = board) {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            for (let pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                    return boardState[a];
                }
            }
            return boardState.includes("") ? null : "Draw";
        }

        function updateScore(winner) {
            if (winner === "X") wins++;
            else if (winner === "O") losses++;
            else draws++;
            winsElement.textContent = wins;
            lossesElement.textContent = losses;
            drawsElement.textContent = draws;
        }

        startGame("player");