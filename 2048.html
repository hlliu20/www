<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>2048游戏</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background-color: #faf8ef;
            color: #776e65;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        
        h1 {
            font-size: 48px;
            color: #776e65;
            margin-bottom: 10px;
        }
        
        .score-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        
        .score-box {
            background-color: #bbada0;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
        }
        
        .score-box .score-label {
            font-size: 14px;
            text-transform: uppercase;
        }
        
        .score-box .score-value {
            font-size: 24px;
        }
        
        .game-container {
            position: relative;
            background-color: #bbada0;
            border-radius: 10px;
            width: 100%;
            max-width: 500px;
            height: 0;
            padding-bottom: 100%;
            margin-bottom: 20px;
        }
        
        .grid-container {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            gap: 10px;
        }
        
        .grid-cell {
            background-color: #cdc1b4;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
            font-weight: bold;
            transition: all 0.15s ease-in-out;
        }
        
        .tile-2 { background-color: #eee4da; color: #776e65; }
        .tile-4 { background-color: #ede0c8; color: #776e65; }
        .tile-8 { background-color: #f2b179; color: #f9f6f2; }
        .tile-16 { background-color: #f59563; color: #f9f6f2; }
        .tile-32 { background-color: #f67c5f; color: #f9f6f2; }
        .tile-64 { background-color: #f65e3b; color: #f9f6f2; }
        .tile-128 { background-color: #edcf72; color: #f9f6f2; font-size: 28px; }
        .tile-256 { background-color: #edcc61; color: #f9f6f2; font-size: 28px; }
        .tile-512 { background-color: #edc850; color: #f9f6f2; font-size: 28px; }
        .tile-1024 { background-color: #edc53f; color: #f9f6f2; font-size: 24px; }
        .tile-2048 { background-color: #edc22e; color: #f9f6f2; font-size: 24px; }
        
        .controls {
            margin-top: 20px;
        }
        
        .btn {
            background-color: #8f7a66;
            color: #f9f6f2;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            margin: 0 5px;
        }
        
        .btn:hover {
            background-color: #9f8a76;
        }
        
        .game-message {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            font-size: 48px;
            font-weight: bold;
            color: #776e65;
            display: none;
        }
        
        .game-message.show {
            display: flex;
        }
        
        .instructions {
            margin-top: 20px;
            font-size: 14px;
            line-height: 1.5;
        }
        
        @media (max-width: 520px) {
            .container {
                padding: 10px;
            }
            
            h1 {
                font-size: 36px;
            }
            
            .grid-cell {
                font-size: 24px;
            }
            
            .tile-128, .tile-256, .tile-512 {
                font-size: 20px;
            }
            
            .tile-1024, .tile-2048 {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>2048</h1>
        <div class="score-container">
            <div class="score-box">
                <div class="score-label">得分</div>
                <div class="score-value" id="score">0</div>
            </div>
            <div class="score-box">
                <div class="score-label">最高分</div>
                <div class="score-value" id="best-score">0</div>
            </div>
        </div>
        
        <div class="game-container" id="game-container">
            <div class="grid-container" id="grid-container">
                <!-- 网格将通过JavaScript生成 -->
            </div>
            <div class="game-message" id="game-message">
                <div id="message-text"></div>
                <button class="btn" onclick="game.restart()">重新开始</button>
            </div>
        </div>
        
        <div class="controls">
            <button class="btn" onclick="game.undo()">撤销</button>
            <button class="btn" onclick="game.restart()">新游戏</button>
        </div>
        <div class="controls">
            <button class="btn" onclick="game.toggleAutoPlay(1000)">自动1</button>
            <button class="btn" onclick="game.toggleAutoPlay(50)">自动2</button>
            <button class="btn" onclick="game.stopAutoPlay()">停止</button>
        </div>
        <div class="instructions">
            <p><strong>电脑操作:</strong> 使用 W/A/S/D 键移动方块</p>
            <p><strong>手机操作:</strong> 滑动屏幕移动方块</p>
            <p>合并相同数字的方块，达到2048获胜！</p>
        </div>
    </div>

    <script>
        // 防止浏览器下拉刷新
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        // 防止左右滑动前进后退
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (!e.touches.length) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            // 如果是水平滑动且在页面边缘，阻止默认行为
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if ((deltaX > 0 && startX <= 10) || (deltaX < 0 && startX >= window.innerWidth - 10)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // 阻止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        class Game2048 {
            constructor() {
                this.grid = [];
                this.score = 0;
                this.bestScore = localStorage.getItem('bestScore') || 0;
                this.size = 4;
                this.history = [];
                this.autoPlayInterval = null;
                this.init();
            }
            
            init() {
                this.setupGrid();
                this.setupEventListeners();
                this.restart();
                this.updateBestScore();
            }
            
            setupGrid() {
                const gridContainer = document.getElementById('grid-container');
                gridContainer.innerHTML = '';
                
                for (let i = 0; i < this.size * this.size; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.id = `cell-${i}`;
                    gridContainer.appendChild(cell);
                }
            }
            
            setupEventListeners() {
                // 键盘事件
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'w' || e.key === 'W') {
                        e.preventDefault();
                        this.move('up');
                    } else if (e.key === 'a' || e.key === 'A') {
                        e.preventDefault();
                        this.move('left');
                    } else if (e.key === 's' || e.key === 'S') {
                        e.preventDefault();
                        this.move('down');
                    } else if (e.key === 'd' || e.key === 'D') {
                        e.preventDefault();
                        this.move('right');
                    }
                });
                
                // 触摸事件
                let touchStartX = 0;
                let touchStartY = 0;
                
                const gameContainer = document.getElementById('game-container');
                
                gameContainer.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }, { passive: true });
                
                gameContainer.addEventListener('touchend', (e) => {
                    if (!e.changedTouches.length) return;
                    
                    const touchEndX = e.changedTouches[0].clientX;
                    const touchEndY = e.changedTouches[0].clientY;
                    
                    const dx = touchEndX - touchStartX;
                    const dy = touchEndY - touchStartY;
                    
                    const absDx = Math.abs(dx);
                    const absDy = Math.abs(dy);
                    
                    if (Math.max(absDx, absDy) > 30) {
                        if (absDx > absDy) {
                            this.move(dx > 0 ? 'right' : 'left');
                        } else {
                            this.move(dy > 0 ? 'down' : 'up');
                        }
                    }
                }, { passive: true });
            }
            
            restart() {
                this.stopAutoPlay();
                this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
                this.score = 0;
                this.history = [];
                this.updateScore();
                this.addNewTile();
                this.addNewTile();
                this.updateDisplay();
                this.hideMessage();
            }
            
            addNewTile() {
                const emptyCells = [];
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        if (this.grid[r][c] === 0) {
                            emptyCells.push({ r, c });
                        }
                    }
                }
                
                if (emptyCells.length > 0) {
                    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    this.grid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
                }
            }
            
            move(direction) {
                // 保存当前状态到历史记录
                this.saveState();
                
                const previousGrid = this.grid.map(row => [...row]);
                let moved = false;
                
                if (direction === 'left') {
                    for (let r = 0; r < this.size; r++) {
                        const row = this.grid[r].filter(val => val !== 0);
                        const merged = this.mergeRow(row);
                        this.grid[r] = merged.concat(Array(this.size - merged.length).fill(0));
                    }
                } else if (direction === 'right') {
                    for (let r = 0; r < this.size; r++) {
                        const row = this.grid[r].filter(val => val !== 0);
                        const merged = this.mergeRow(row.reverse()).reverse();
                        this.grid[r] = Array(this.size - merged.length).fill(0).concat(merged);
                    }
                } else if (direction === 'up') {
                    for (let c = 0; c < this.size; c++) {
                        const column = [];
                        for (let r = 0; r < this.size; r++) {
                            column.push(this.grid[r][c]);
                        }
                        const filtered = column.filter(val => val !== 0);
                        const merged = this.mergeRow(filtered);
                        const newColumn = merged.concat(Array(this.size - merged.length).fill(0));
                        for (let r = 0; r < this.size; r++) {
                            this.grid[r][c] = newColumn[r];
                        }
                    }
                } else if (direction === 'down') {
                    for (let c = 0; c < this.size; c++) {
                        const column = [];
                        for (let r = 0; r < this.size; r++) {
                            column.push(this.grid[r][c]);
                        }
                        const filtered = column.filter(val => val !== 0);
                        const merged = this.mergeRow(filtered.reverse()).reverse();
                        const newColumn = Array(this.size - merged.length).fill(0).concat(merged);
                        for (let r = 0; r < this.size; r++) {
                            this.grid[r][c] = newColumn[r];
                        }
                    }
                }
                
                // 检查是否有移动
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        if (this.grid[r][c] !== previousGrid[r][c]) {
                            moved = true;
                            break;
                        }
                    }
                }
                
                if (moved) {
                    this.addNewTile();
                    this.updateDisplay();
                    
                    /*if (this.checkWin()) {
                        this.showMessage('你赢了！');
                    } else */
                    if (this.checkGameOver()) {
                        this.showMessage('游戏结束');
                    }
                }
            }
            
            mergeRow(row) {
                const result = [];
                let i = 0;
                
                while (i < row.length) {
                    if (i < row.length - 1 && row[i] === row[i + 1]) {
                        result.push(row[i] * 2);
                        this.score += row[i] * 2;
                        this.updateScore();
                        i += 2;
                    } else {
                        result.push(row[i]);
                        i++;
                    }
                }
                
                return result;
            }
            
            checkWin() {
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        if (this.grid[r][c] === 2048) {
                            return true;
                        }
                    }
                }
                return false;
            }
            
            checkGameOver() {
                // 检查是否有空格
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        if (this.grid[r][c] === 0) {
                            return false;
                        }
                    }
                }
                
                // 检查是否可以合并
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        const current = this.grid[r][c];
                        if ((r < this.size - 1 && current === this.grid[r + 1][c]) ||
                            (c < this.size - 1 && current === this.grid[r][c + 1])) {
                            return false;
                        }
                    }
                }
                
                return true;
            }
            
            updateDisplay() {
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        const cellIndex = r * this.size + c;
                        const cell = document.getElementById(`cell-${cellIndex}`);
                        const value = this.grid[r][c];
                        
                        cell.textContent = value === 0 ? '' : value;
                        cell.className = 'grid-cell';
                        
                        if (value !== 0) {
                            cell.classList.add(`tile-${value}`);
                        }
                    }
                }
            }
            
            updateScore() {
                document.getElementById('score').textContent = this.score;
                
                if (this.score > this.bestScore) {
                    this.bestScore = this.score;
                    this.updateBestScore();
                }
            }
            
            updateBestScore() {
                document.getElementById('best-score').textContent = this.bestScore;
                localStorage.setItem('bestScore', this.bestScore);
            }
            
            showMessage(text) {
                const messageEl = document.getElementById('game-message');
                const messageText = document.getElementById('message-text');
                messageText.textContent = text;
                messageEl.classList.add('show');
            }
            
            hideMessage() {
                const messageEl = document.getElementById('game-message');
                messageEl.classList.remove('show');
            }
            
            saveState() {
                this.history.push({
                    grid: this.grid.map(row => [...row]),
                    score: this.score
                });
                
                // 只保留最近3次操作的历史记录
                if (this.history.length > 3) {
                    this.history = this.history.slice(-3);
                }
            }
            
            undo() {
                if (this.history.length > 0) {
                    const previousState = this.history.pop();
                    this.grid = previousState.grid.map(row => [...row]);
                    this.score = previousState.score;
                    this.updateDisplay();
                    this.updateScore();
                    this.hideMessage();
                }
            }
            
            toggleAutoPlay(interval) {
                if (this.autoPlayInterval) {
                    this.stopAutoPlay();
                } else {
                    this.startAutoPlay(interval);
                }
            }
            
            startAutoPlay(interval) {
                this.stopAutoPlay(); // 先停止现有的自动运行
                
                this.autoPlayInterval = setInterval(() => {
                    if (this.checkGameOver()) {
                        this.stopAutoPlay();
                        this.showMessage('游戏结束');
                        return;
                    }
                    
                    if (this.checkWin()) {
                        this.stopAutoPlay();
                        this.showMessage('你赢了！');
                        return;
                    }
                    
                    // AI策略：尝试所有方向，选择最佳方向
                    const directions = ['up', 'down', 'left', 'right'];
                    const validDirections = [];
                    let bestDirection = null;
                    let bestScore = -1;
                    let bestEmptyCells = -1;
                    
                    for (const direction of directions) {
                        const testGrid = this.grid.map(row => [...row]);
                        const testScore = this.score;
                        
                        // 模拟移动
                        const moved = this.simulateMove(direction);
                        
                        // 只有当移动确实改变了棋盘时才考虑这个方向
                        if (moved) {
                            validDirections.push(direction);
                            // 评估移动的好坏
                            let currentScore = this.score - testScore; // 得分增加
                            let emptyCells = this.countEmptyCells(); // 空格数量
                            
                            // 综合评分：得分优先，空格数量次之
                            let totalScore = currentScore * 100 + emptyCells;
                            
                            if (totalScore > bestScore || 
                                (totalScore === bestScore && emptyCells > bestEmptyCells)) {
                                bestScore = totalScore;
                                bestDirection = direction;
                                bestEmptyCells = emptyCells;
                            }
                        }
                        
                        // 恢复状态
                        this.grid = testGrid;
                        this.score = testScore;
                    }
                    
                    // 如果找到最佳方向，执行移动
                    if (bestDirection) {
                        this.move(bestDirection);
                    } else {
                        // 否则在真的能移动的方向中随机选择
                        if (validDirections.length > 0) {
                            const randomDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
                            this.move(randomDirection);
                        }
                    }
                }, interval);
            }
            
            simulateMove(direction) {
                const previousGrid = this.grid.map(row => [...row]);
                let moved = false;
                
                if (direction === 'left') {
                    for (let r = 0; r < this.size; r++) {
                        const row = this.grid[r].filter(val => val !== 0);
                        const merged = this.mergeRow(row);
                        this.grid[r] = merged.concat(Array(this.size - merged.length).fill(0));
                    }
                } else if (direction === 'right') {
                    for (let r = 0; r < this.size; r++) {
                        const row = this.grid[r].filter(val => val !== 0);
                        const merged = this.mergeRow(row.reverse()).reverse();
                        this.grid[r] = Array(this.size - merged.length).fill(0).concat(merged);
                    }
                } else if (direction === 'up') {
                    for (let c = 0; c < this.size; c++) {
                        const column = [];
                        for (let r = 0; r < this.size; r++) {
                            column.push(this.grid[r][c]);
                        }
                        const filtered = column.filter(val => val !== 0);
                        const merged = this.mergeRow(filtered);
                        const newColumn = merged.concat(Array(this.size - merged.length).fill(0));
                        for (let r = 0; r < this.size; r++) {
                            this.grid[r][c] = newColumn[r];
                        }
                    }
                } else if (direction === 'down') {
                    for (let c = 0; c < this.size; c++) {
                        const column = [];
                        for (let r = 0; r < this.size; r++) {
                            column.push(this.grid[r][c]);
                        }
                        const filtered = column.filter(val => val !== 0);
                        const merged = this.mergeRow(filtered.reverse()).reverse();
                        const newColumn = Array(this.size - merged.length).fill(0).concat(merged);
                        for (let r = 0; r < this.size; r++) {
                            this.grid[r][c] = newColumn[r];
                        }
                    }
                }
                
                // 检查是否有移动
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        if (this.grid[r][c] !== previousGrid[r][c]) {
                            moved = true;
                            break;
                        }
                    }
                }
                
                if (moved) {
                    // 模拟添加新方块
                    const emptyCells = [];
                    for (let r = 0; r < this.size; r++) {
                        for (let c = 0; c < this.size; c++) {
                            if (this.grid[r][c] === 0) {
                                emptyCells.push({ r, c });
                            }
                        }
                    }
                    
                    if (emptyCells.length > 0) {
                        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                        this.grid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
                    }
                }
                
                return moved;
            }
            
            countEmptyCells() {
                let count = 0;
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        if (this.grid[r][c] === 0) {
                            count++;
                        }
                    }
                }
                return count;
            }
            
            stopAutoPlay() {
                if (this.autoPlayInterval) {
                    clearInterval(this.autoPlayInterval);
                    this.autoPlayInterval = null;
                }
            }
        }
        
        // 初始化游戏
        const game = new Game2048();
    </script>
</body>
</html>