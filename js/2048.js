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
        this.transpositionTable = new Map(); // 转置表缓存
        this.maxCacheSize = 10000; // 最大缓存大小
        this.hasShownWin = false; // 是否已显示过赢了
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
                if (this.autoPlayInterval) return;
                this.move('up');
            } else if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                if (this.autoPlayInterval) return;
                this.move('left');
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                if (this.autoPlayInterval) return;
                this.move('down');
            } else if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                if (this.autoPlayInterval) return;
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
            // 自动运行期间禁用触屏操作
            if (this.autoPlayInterval) return;
            
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
        this.transpositionTable.clear(); // 清空缓存
        this.hasShownWin = false; // 重置赢了标志
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
            
            if (this.checkWin() && !this.hasShownWin) {
                this.showMessage('恭喜！你达到了2048！游戏继续...');
                setTimeout(() => this.hideMessage(), 3000);
                this.hasShownWin = true; // 标记已显示过赢了
            }
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
        }
        this.startAutoPlay(interval);
    }
    
    startAutoPlay(interval) {
        this.stopAutoPlay(); // 先停止现有的自动运行
        
        this.autoPlayInterval = setInterval(() => {
            if (this.checkGameOver()) {
                this.stopAutoPlay();
                this.showMessage('游戏结束');
                return;
            }
            
            if (this.checkWin() && !this.hasShownWin) {
                this.showMessage('恭喜！你达到了2048！游戏继续...');
                setTimeout(() => this.hideMessage(), 3000);
                this.hasShownWin = true; // 标记已显示过赢了
            }
            
            // 使用expectimax算法选择最佳移动
            const bestDirection = this.getBestMoveExpectimax();
            if (bestDirection) {
                this.move(bestDirection);
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
    
    // Expectimax算法实现
    getBestMoveExpectimax() {
        const directions = ['up', 'down', 'left', 'right'];
        let bestDirection = null;
        let bestScore = -Infinity;
        
        for (const direction of directions) {
            const testGrid = this.grid.map(row => [...row]);
            const testScore = this.score;
            
            if (this.simulateMove(direction)) {
                const score = this.expectimax(this.grid, 4, false); // 深度4
                if (score > bestScore) {
                    bestScore = score;
                    bestDirection = direction;
                }
            }
            
            // 恢复状态
            this.grid = testGrid;
            this.score = testScore;
        }
        
        return bestDirection;
    }
    
    expectimax(grid, depth, isChanceNode) {
        // 生成棋盘的唯一键
        const gridKey = this.gridToString(grid);
        const cacheKey = `${gridKey}-${depth}-${isChanceNode}`;
        
        // 检查转置表缓存
        if (this.transpositionTable.has(cacheKey)) {
            return this.transpositionTable.get(cacheKey);
        }
        
        // 检查是否达到深度限制或游戏结束
        if (depth === 0 || this.isGameOver(grid)) {
            const score = this.evaluateBoard(grid);
            this.cacheResult(cacheKey, score);
            return score;
        }
        
        let result;
        if (isChanceNode) {
            // 期望节点：计算机随机放置方块
            result = this.expectNode(grid, depth);
        } else {
            // 最大化节点：玩家选择移动
            result = this.maxNode(grid, depth);
        }
        
        // 缓存结果
        this.cacheResult(cacheKey, result);
        return result;
    }
    
    gridToString(grid) {
        return grid.map(row => row.join(',')).join('|');
    }
    
    cacheResult(key, value) {
        // 如果缓存过大，清理最旧的一半
        if (this.transpositionTable.size >= this.maxCacheSize) {
            const entries = Array.from(this.transpositionTable.entries());
            this.transpositionTable.clear();
            // 保留最新的一半
            for (let i = Math.floor(entries.length / 2); i < entries.length; i++) {
                this.transpositionTable.set(entries[i][0], entries[i][1]);
            }
        }
        this.transpositionTable.set(key, value);
    }
    
    expectNode(grid, depth) {
        let totalScore = 0;
        let count = 0;
        
        // 获取所有空位
        const emptyCells = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        
        if (emptyCells.length === 0) {
            return this.evaluateBoard(grid);
        }
        
        // 对每个空位，考虑放置2或4
        for (const cell of emptyCells) {
            // 放置2（90%概率）
            const grid2 = grid.map(row => [...row]);
            grid2[cell.r][cell.c] = 2;
            totalScore += 0.9 * this.expectimax(grid2, depth - 1, false);
            count++;
            
            // 放置4（10%概率）
            const grid4 = grid.map(row => [...row]);
            grid4[cell.r][cell.c] = 4;
            totalScore += 0.1 * this.expectimax(grid4, depth - 1, false);
            count++;
        }
        
        return totalScore / count;
    }
    
    maxNode(grid, depth) {
        let bestScore = -Infinity;
        const directions = ['up', 'down', 'left', 'right'];
        
        for (const direction of directions) {
            const testGrid = grid.map(row => [...row]);
            const originalGrid = this.grid;
            const originalScore = this.score;
            
            this.grid = testGrid;
            if (this.simulateMove(direction)) {
                const score = this.expectimax(this.grid, depth - 1, true);
                bestScore = Math.max(bestScore, score);
            }
            
            // 恢复状态
            this.grid = originalGrid;
            this.score = originalScore;
        }
        
        return bestScore === -Infinity ? this.evaluateBoard(grid) : bestScore;
    }
    
    isGameOver(grid) {
        // 检查是否有空格
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (grid[r][c] === 0) {
                    return false;
                }
            }
        }
        
        // 检查是否可以合并
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const current = grid[r][c];
                if ((r < this.size - 1 && current === grid[r + 1][c]) ||
                    (c < this.size - 1 && current === grid[r][c + 1])) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    evaluateBoard(grid) {
        let score = 0;
        
        // 1. 空格数量权重
        const emptyCells = this.countEmptyCellsInGrid(grid);
        score += emptyCells * 100;
        
        // 2. 单调性权重
        score += this.calculateMonotonicity(grid) * 10;
        
        // 3. 平滑度权重（相邻相同数字）
        score += this.calculateSmoothness(grid) * 5;
        
        // 4. 最大值位置权重（角落优先）
        score += this.calculateCornerBonus(grid) * 50;
        
        // 5. 合并可能性权重
        score += this.calculateMergePotential(grid) * 3;
        
        return score;
    }
    
    countEmptyCellsInGrid(grid) {
        let count = 0;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (grid[r][c] === 0) {
                    count++;
                }
            }
        }
        return count;
    }
    
    calculateMonotonicity(grid) {
        let score = 0;
        
        // 检查行单调性
        for (let r = 0; r < this.size; r++) {
            let increasing = 0;
            let decreasing = 0;
            for (let c = 0; c < this.size - 1; c++) {
                if (grid[r][c] !== 0 && grid[r][c + 1] !== 0) {
                    if (grid[r][c] > grid[r][c + 1]) {
                        increasing += Math.log2(grid[r][c]) - Math.log2(grid[r][c + 1]);
                    } else {
                        decreasing += Math.log2(grid[r][c + 1]) - Math.log2(grid[r][c]);
                    }
                }
            }
            score += Math.max(increasing, decreasing);
        }
        
        // 检查列单调性
        for (let c = 0; c < this.size; c++) {
            let increasing = 0;
            let decreasing = 0;
            for (let r = 0; r < this.size - 1; r++) {
                if (grid[r][c] !== 0 && grid[r + 1][c] !== 0) {
                    if (grid[r][c] > grid[r + 1][c]) {
                        increasing += Math.log2(grid[r][c]) - Math.log2(grid[r + 1][c]);
                    } else {
                        decreasing += Math.log2(grid[r + 1][c]) - Math.log2(grid[r][c]);
                    }
                }
            }
            score += Math.max(increasing, decreasing);
        }
        
        return -score; // 返回负值，因为单调性越好分数越高
    }
    
    calculateSmoothness(grid) {
        let score = 0;
        
        // 检查水平相邻
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size - 1; c++) {
                if (grid[r][c] !== 0 && grid[r][c + 1] !== 0) {
                    score -= Math.abs(Math.log2(grid[r][c]) - Math.log2(grid[r][c + 1]));
                }
            }
        }
        
        // 检查垂直相邻
        for (let r = 0; r < this.size - 1; r++) {
            for (let c = 0; c < this.size; c++) {
                if (grid[r][c] !== 0 && grid[r + 1][c] !== 0) {
                    score -= Math.abs(Math.log2(grid[r][c]) - Math.log2(grid[r + 1][c]));
                }
            }
        }
        
        return score;
    }
    
    calculateCornerBonus(grid) {
        let maxValue = 0;
        let maxPos = { r: 0, c: 0 };
        
        // 找到最大值及其位置
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (grid[r][c] > maxValue) {
                    maxValue = grid[r][c];
                    maxPos = { r, c };
                }
            }
        }
        
        // 如果最大值在角落，给予奖励
        if ((maxPos.r === 0 || maxPos.r === this.size - 1) && 
            (maxPos.c === 0 || maxPos.c === this.size - 1)) {
            return Math.log2(maxValue);
        }
        
        return 0;
    }
    
    calculateMergePotential(grid) {
        let potential = 0;
        
        // 水平相邻相同数字
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size - 1; c++) {
                if (grid[r][c] !== 0 && grid[r][c] === grid[r][c + 1]) {
                    potential += Math.log2(grid[r][c]);
                }
            }
        }
        
        // 垂直相邻相同数字
        for (let r = 0; r < this.size - 1; r++) {
            for (let c = 0; c < this.size; c++) {
                if (grid[r][c] !== 0 && grid[r][c] === grid[r + 1][c]) {
                    potential += Math.log2(grid[r][c]);
                }
            }
        }
        
        return potential;
    }
}

// 初始化游戏
const game = new Game2048();