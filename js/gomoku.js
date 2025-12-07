class GomokuGame {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.winningCells = [];
        this.cellSize = 600 / (this.boardSize - 1);
        this.selectedPosition = null;
        this.previewPiece = null;
        this.isDragging = false;
        
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeGame() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.winningCells = [];
        this.selectedPosition = null;
        this.previewPiece = null;
        this.renderBoard();
        this.updateGameInfo();
    }
    
    renderBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        
        // 动态计算cellSize
        const boardWidth = board.offsetWidth;
        this.cellSize = boardWidth / (this.boardSize - 1);
        
        // 1. 绘制网格线
        for (let i = 0; i < this.boardSize; i++) {
            // 横线
            const horizontalLine = document.createElement('div');
            horizontalLine.className = 'grid-line horizontal';
            horizontalLine.style.top = `${i * this.cellSize}px`;
            board.appendChild(horizontalLine);

            // 竖线
            const verticalLine = document.createElement('div');
            verticalLine.className = 'grid-line vertical';
            verticalLine.style.left = `${i * this.cellSize}px`;
            board.appendChild(verticalLine);
        }

        // 2. 绘制标注点（红圆点）
        const markPoints = [
            {x: 3, y: 3},   // 左上标注点
            {x: 11, y: 3},  // 右上标注点
            {x: 3, y: 11},  // 左下标注点
            {x: 11, y: 11},  // 右下标注点
            {x: 7, y: 7}  // 中心标注点
        ];
        markPoints.forEach(point => {
            const mark = document.createElement('div');
            mark.className = 'mark-point';
            mark.style.left = `${point.x * this.cellSize}px`;
            mark.style.top = `${point.y * this.cellSize}px`;
            board.appendChild(mark);
        });

        // 3. 绘制棋子
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col]) {
                    const piece = document.createElement('div');
                    piece.className = `piece ${this.board[row][col]}`;
                    
                    if (this.isWinningCell(row, col)) {
                        piece.classList.add('highlight');
                    }
                    
                    piece.style.left = `${col * this.cellSize}px`;
                    piece.style.top = `${row * this.cellSize}px`;
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    board.appendChild(piece);
                }
            }
        }
        
        // 4. 绘制选中的位置预览
        if (this.selectedPosition && !this.gameOver) {
            const { row, col } = this.selectedPosition;
            const previewPiece = document.createElement('div');
            previewPiece.className = `piece ${this.currentPlayer} preview`;
            previewPiece.style.left = `${col * this.cellSize}px`;
            previewPiece.style.top = `${row * this.cellSize}px`;
            previewPiece.style.opacity = '0.6';
            board.appendChild(previewPiece);
        }
    }
    
    isWinningCell(row, col) {
        return this.winningCells.some(cell => cell[0] === row && cell[1] === col);
    }
    
    bindEvents() {
        const board = document.getElementById('board');
        
        // 鼠标/触摸事件
        board.addEventListener('mousedown', (e) => this.handleStart(e));
        board.addEventListener('mousemove', (e) => this.handleMove(e));
        board.addEventListener('mouseup', (e) => this.handleEnd(e));
        board.addEventListener('mouseleave', (e) => this.handleEnd(e));
        
        // 触摸事件
        board.addEventListener('touchstart', (e) => this.handleStart(e));
        board.addEventListener('touchmove', (e) => this.handleMove(e));
        board.addEventListener('touchend', (e) => this.handleEnd(e));
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.initializeGame();
        });
    }
    
    handleStart(e) {
        if (this.gameOver) return;
        e.preventDefault();
        
        const position = this.getPositionFromEvent(e);
        if (position) {
            this.isDragging = true;
            this.selectedPosition = position;
            this.renderBoard();
        }
    }
    
    handleMove(e) {
        if (!this.isDragging || this.gameOver) return;
        e.preventDefault();
        
        const position = this.getPositionFromEvent(e);
        if (position) {
            this.selectedPosition = position;
            this.renderBoard();
        }
    }
    
    handleEnd(e) {
        if (!this.isDragging || this.gameOver) return;
        e.preventDefault();
        
        if (this.selectedPosition) {
            const { row, col } = this.selectedPosition;
            // 只有当位置为空时才落子
            if (this.board[row][col] === null) {
                this.makeMove(row, col);
            }
        }
        
        this.isDragging = false;
        this.selectedPosition = null;
        this.renderBoard();
    }
    
    getPositionFromEvent(e) {
        const board = document.getElementById('board');
        const rect = board.getBoundingClientRect();
        
        let x, y;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        // 计算最接近的交叉点
        const col = Math.round(x / (rect.width / (this.boardSize - 1)));
        const row = Math.round(y / (rect.height / (this.boardSize - 1)));
        
        // 确保坐标在有效范围内
        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            return { row, col };
        }
        
        return null;
    }
    
    makeMove(row, col) {
        if (this.board[row][col] !== null) return;
        
        this.board[row][col] = this.currentPlayer;
        this.selectedPosition = null;
        this.renderBoard();
        
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.winningCells = this.getWinningCells(row, col);
            this.renderBoard();
            this.updateGameInfo(`${this.currentPlayer === 'black' ? '黑棋' : '白棋'}获胜！`);
            return;
        }
        
        if (this.checkDraw()) {
            this.gameOver = true;
            this.updateGameInfo('平局！');
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateGameInfo();
    }
    
    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],  // 水平
            [[1, 0], [-1, 0]],  // 垂直
            [[1, 1], [-1, -1]], // 对角线
            [[1, -1], [-1, 1]]  // 反对角线
        ];
        
        for (const direction of directions) {
            let count = 1;
            
            for (const [dr, dc] of direction) {
                let r = row + dr;
                let c = col + dc;
                
                while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize &&
                       this.board[r][c] === this.currentPlayer) {
                    count++;
                    r += dr;
                    c += dc;
                }
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    getWinningCells(row, col) {
        const directions = [
            [[0, 1], [0, -1]],  // 水平
            [[1, 0], [-1, 0]],  // 垂直
            [[1, 1], [-1, -1]], // 对角线
            [[1, -1], [-1, 1]]  // 反对角线
        ];
        
        for (const direction of directions) {
            const cells = [[row, col]];
            
            for (const [dr, dc] of direction) {
                let r = row + dr;
                let c = col + dc;
                
                while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize &&
                       this.board[r][c] === this.currentPlayer) {
                    cells.push([r, c]);
                    r += dr;
                    c += dc;
                }
            }
            
            if (cells.length >= 5) {
                return cells;
            }
        }
        
        return [];
    }
    
    checkDraw() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    updateGameInfo(message = null) {
        const currentPlayerElement = document.getElementById('current-player');
        const gameStatusElement = document.getElementById('game-status');
        
        if (message) {
            currentPlayerElement.textContent = '';
            gameStatusElement.textContent = message;
            gameStatusElement.style.color = '#dc3545';
        } else {
            currentPlayerElement.textContent = this.currentPlayer === 'black' ? '黑棋' : '白棋';
            gameStatusElement.textContent = '游戏进行中';
            gameStatusElement.style.color = '#28a745';
        }
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});