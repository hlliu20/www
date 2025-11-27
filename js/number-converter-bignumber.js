document.addEventListener('DOMContentLoaded', function() {
    // 当前选中的进制
    let currentBase = 10;
    let currentValue = '0';
    
    // DOM元素
    const baseRows = document.querySelectorAll('.base-row');
    const keys = document.querySelectorAll('.key');
    const toast = document.getElementById('toast');
    
    // 各进制显示元素
    const binaryValue = document.getElementById('binary-value');
    const octalValue = document.getElementById('octal-value');
    const decimalValue = document.getElementById('decimal-value');
    const hexValue = document.getElementById('hex-value');
    
    // 初始化
    init();
    
    function init() {
        // 绑定进制行点击事件
        baseRows.forEach(row => {
            row.addEventListener('click', function() {
                const base = parseInt(this.dataset.base);
                switchBase(base);
            });
        });
        
        // 绑定复制功能
        [binaryValue, octalValue, decimalValue, hexValue].forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                copyToClipboard(this.textContent);
            });
        });
        
        // 绑定键盘事件
        keys.forEach(key => {
            key.addEventListener('click', function() {
                handleKeyClick(this);
            });
        });
        
        // 更新键盘状态
        updateKeyboardState();
        
        // 初始化显示
        updateDisplay();
    }
    
    function switchBase(base) {
        // 从点击的进制获取当前值
        const baseValueElement = document.querySelector(`[data-base="${base}"] .base-value`);
        currentValue = baseValueElement.textContent;
        
        currentBase = base;
        
        // 更新活动状态
        baseRows.forEach(row => {
            row.classList.remove('active');
        });
        document.querySelector(`[data-base="${base}"]`).classList.add('active');
        
        // 更新键盘状态
        updateKeyboardState();
    }
    
    function handleKeyClick(key) {
        const value = key.dataset.value;
        const action = key.dataset.action;
        
        if (action === 'delete') {
            deleteLastChar();
        } else if (action === 'clear') {
            clearAll();
        } else if (value) {
            addCharacter(value);
        }
    }
    
    function addCharacter(char) {
        if (currentValue === '0') {
            currentValue = char;
        } else {
            currentValue += char;
        }
        updateDisplay();
        updateKeyboardState();
    }
    
    function deleteLastChar() {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
        updateDisplay();
        updateKeyboardState();
    }
    
    function clearAll() {
        currentValue = '0';
        updateDisplay();
        updateKeyboardState();
    }
    
    function updateDisplay() {
        updateAllBaseValues();
    }
    
    function updateAllBaseValues() {
        try {
            // 使用BigNumber将输入转换为十进制
            let decimal;
            try {
                decimal = new BigNumber(currentValue, currentBase);
            } catch (e) {
                // 如果转换失败，显示默认值
                binaryValue.textContent = '0';
                octalValue.textContent = '0';
                decimalValue.textContent = '0';
                hexValue.textContent = '0';
                return;
            }
            
            // 更新各进制显示
            binaryValue.textContent = decimal.toString(2);
            octalValue.textContent = decimal.toString(8);
            decimalValue.textContent = decimal.toString(10);
            hexValue.textContent = decimal.toString(16).toUpperCase();
            
            // 处理数字过长的显示
            [binaryValue, octalValue, decimalValue, hexValue].forEach(element => {
                if (element.textContent.length > 30) {
                    element.classList.add('truncated');
                    element.title = element.textContent; // 添加完整值的提示
                } else {
                    element.classList.remove('truncated');
                    element.title = '';
                }
            });
        } catch (error) {
            // 如果转换失败，显示默认值
            binaryValue.textContent = '0';
            octalValue.textContent = '0';
            decimalValue.textContent = '0';
            hexValue.textContent = '0';
        }
    }
    
    function updateKeyboardState() {
        keys.forEach(key => {
            const value = key.dataset.value;
            const action = key.dataset.action;
            
            if (action) return; // 跳过功能键
            
            // 根据当前进制启用/禁用按键
            let isValid = false;
            switch (currentBase) {
                case 2:
                    isValid = /^[01]$/.test(value);
                    break;
                case 8:
                    isValid = /^[0-7]$/.test(value);
                    break;
                case 10:
                    isValid = /^[0-9]$/.test(value);
                    break;
                case 16:
                    isValid = /^[0-9A-Fa-f]$/.test(value);
                    break;
            }
            
            if (isValid) {
                key.classList.remove('disabled');
            } else {
                key.classList.add('disabled');
            }
        });
    }
    
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('已复制到剪贴板');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }
    
    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('已复制到剪贴板');
        } catch (err) {
            showToast('复制失败');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
});