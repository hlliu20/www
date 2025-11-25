// 从Cookie获取保存的设置
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// 保存设置到Cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// 监听数字开关，控制数字范围选项的显示
document.getElementById('includeNumbers').addEventListener('change', function() {
    const container = document.getElementById('numberSettingsContainer');
    container.style.display = this.checked ? 'block' : 'none';
    
    // 保存设置到cookie
    setCookie('includeNumbers', this.checked ? 'true' : 'false', 30);
});

// 监听数字设置开关，控制数字设置详细选项的显示
document.getElementById('showNumberSettings').addEventListener('change', function() {
    const rangeContainer = document.getElementById('numberRangeContainer');
    rangeContainer.style.display = this.checked ? 'block' : 'none';
    
    // 保存设置到cookie
    setCookie('showNumberSettings', this.checked ? 'true' : 'false', 30);
});

// 监听自定义数字开关，控制自定义数字输入框的显示
document.getElementById('useCustomNumbers').addEventListener('change', function() {
    const customContainer = document.getElementById('customNumberContainer');
    customContainer.style.display = this.checked ? 'block' : 'none';
    
    // 保存设置到cookie
    setCookie('useCustomNumbers', this.checked ? 'true' : 'false', 30);
});

// 监听自定义符号开关，控制自定义符号输入框的显示
document.getElementById('includeCustom').addEventListener('change', function() {
    const customContainer = document.getElementById('customContainer');
    customContainer.style.display = this.checked ? 'block' : 'none';
    
    // 保存设置到cookie
    setCookie('includeCustom', this.checked ? 'true' : 'false', 30);
});

// 监听数字范围滑块，实时显示值
document.getElementById('numberStart').addEventListener('input', function() {
    document.getElementById('numberStartValue').textContent = this.value;
    // 确保开始值不大于结束值
    const endValue = parseInt(document.getElementById('numberEnd').value);
    if (parseInt(this.value) > endValue) {
        document.getElementById('numberEnd').value = this.value;
        document.getElementById('numberEndValue').textContent = this.value;
    }
    
    // 保存设置到cookie
    setCookie('numberStart', this.value, 30);
});

document.getElementById('numberEnd').addEventListener('input', function() {
    document.getElementById('numberEndValue').textContent = this.value;
    // 确保结束值不小于开始值
    const startValue = parseInt(document.getElementById('numberStart').value);
    if (parseInt(this.value) < startValue) {
        document.getElementById('numberStart').value = this.value;
        document.getElementById('numberStartValue').textContent = this.value;
    }
    
    // 保存设置到cookie
    setCookie('numberEnd', this.value, 30);
});

// 监听字符串长度滑块，实时显示值
document.getElementById('length').addEventListener('input', function() {
    document.getElementById('lengthValue').textContent = this.value;
    
    // 保存设置到cookie
    setCookie('length', this.value, 30);
});

// 监听生成数量滑块，实时显示值
document.getElementById('count').addEventListener('input', function() {
    document.getElementById('countValue').textContent = this.value;
    
    // 保存设置到cookie
    setCookie('count', this.value, 30);
});

// 监听自定义数字输入框
document.getElementById('customNumbers').addEventListener('input', function() {
    // 保存设置到cookie
    setCookie('customNumbers', this.value, 30);
});

// 监听自定义符号输入框
document.getElementById('customSymbols').addEventListener('input', function() {
    // 保存设置到cookie
    setCookie('customSymbols', this.value, 30);
});

// 初始化时设置正确的显示状态
window.onload = function() {
    // 从cookie恢复设置
    const savedIncludeNumbers = getCookie('includeNumbers');
    const savedShowNumberSettings = getCookie('showNumberSettings');
    const savedUseCustomNumbers = getCookie('useCustomNumbers');
    const savedIncludeCustom = getCookie('includeCustom');
    const savedNumberStart = getCookie('numberStart');
    const savedNumberEnd = getCookie('numberEnd');
    const savedLength = getCookie('length');
    const savedCount = getCookie('count');
    const savedCustomNumbers = getCookie('customNumbers');
    const savedCustomSymbols = getCookie('customSymbols');
    
    // 恢复包含数字开关
    if (savedIncludeNumbers !== undefined && savedIncludeNumbers !== null) {
        document.getElementById('includeNumbers').checked = savedIncludeNumbers === 'true';
    }
    
    // 恢复数字设置开关
    if (savedShowNumberSettings !== undefined && savedShowNumberSettings !== null) {
        document.getElementById('showNumberSettings').checked = savedShowNumberSettings === 'true';
    }
    
    // 恢复自定义数字开关
    if (savedUseCustomNumbers !== undefined && savedUseCustomNumbers !== null) {
        document.getElementById('useCustomNumbers').checked = savedUseCustomNumbers === 'true';
    }
    
    // 恢复包含自定义符号开关
    if (savedIncludeCustom !== undefined && savedIncludeCustom !== null) {
        document.getElementById('includeCustom').checked = savedIncludeCustom === 'true';
    }
    
    // 恢复数字范围滑块值
    if (savedNumberStart !== undefined && savedNumberStart !== null) {
        document.getElementById('numberStart').value = savedNumberStart;
    }
    if (savedNumberEnd !== undefined && savedNumberEnd !== null) {
        document.getElementById('numberEnd').value = savedNumberEnd;
    }
    
    // 恢复字符串长度
    if (savedLength !== undefined && savedLength !== null) {
        document.getElementById('length').value = savedLength;
    }
    
    // 恢复生成数量
    if (savedCount !== undefined && savedCount !== null) {
        document.getElementById('count').value = savedCount;
    }
    
    // 恢复自定义数字
    if (savedCustomNumbers !== undefined && savedCustomNumbers !== null) {
        document.getElementById('customNumbers').value = savedCustomNumbers;
    }
    
    // 恢复自定义符号
    if (savedCustomSymbols !== undefined && savedCustomSymbols !== null) {
        document.getElementById('customSymbols').value = savedCustomSymbols;
    }
    
    // 根据开关状态更新UI
    const includeNumbers = document.getElementById('includeNumbers');
    const numberSettingsContainer = document.getElementById('numberSettingsContainer');
    numberSettingsContainer.style.display = includeNumbers.checked ? 'block' : 'none';
    
    const showNumberSettings = document.getElementById('showNumberSettings');
    const numberRangeContainer = document.getElementById('numberRangeContainer');
    numberRangeContainer.style.display = showNumberSettings.checked ? 'block' : 'none';
    
    const useCustomNumbers = document.getElementById('useCustomNumbers');
    const customNumberContainer = document.getElementById('customNumberContainer');
    customNumberContainer.style.display = useCustomNumbers.checked ? 'block' : 'none';
    
    const includeCustom = document.getElementById('includeCustom');
    const customContainer = document.getElementById('customContainer');
    customContainer.style.display = includeCustom.checked ? 'block' : 'none';
    
    // 更新滑块显示值
    document.getElementById('numberStartValue').textContent = document.getElementById('numberStart').value;
    document.getElementById('numberEndValue').textContent = document.getElementById('numberEnd').value;
    document.getElementById('lengthValue').textContent = document.getElementById('length').value;
    document.getElementById('countValue').textContent = document.getElementById('count').value;
};

function generateRandomStrings() {
    const length = parseInt(document.getElementById('length').value);
    const count = parseInt(document.getElementById('count').value);
    
    let charset = '';
    
    // 根据开关添加字符集
    if (document.getElementById('includeNumbers').checked) {
        if (document.getElementById('showNumberSettings').checked) {
            // 数字设置开关打开，根据具体设置来确定数字范围
            if (document.getElementById('useCustomNumbers').checked) {
                // 使用自定义数字
                const customNumbers = document.getElementById('customNumbers').value;
                if (customNumbers) {
                    charset += customNumbers;
                }
            } else {
                // 使用滑块选择的范围
                const start = parseInt(document.getElementById('numberStart').value);
                const end = parseInt(document.getElementById('numberEnd').value);
                
                for (let i = start; i <= end; i++) {
                    charset += i.toString();
                }
            }
        } else {
            // 数字设置开关关闭，默认使用0-9
            charset += '0123456789';
        }
    }
    
    if (document.getElementById('includeUppercase').checked) {
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    if (document.getElementById('includeLowercase').checked) {
        charset += 'abcdefghijklmnopqrstuvwxyz';
    }
    
    if (document.getElementById('includeSpecial').checked) {
        charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
    
    if (document.getElementById('includeCustom').checked) {
        charset += document.getElementById('customSymbols').value;
    }
    
    // 检查字符集是否为空
    if (!charset) {
        alert('请至少选择一种字符类型！');
        return;
    }
    
    const results = [];
    for (let i = 0; i < count; i++) {
        let randomString = '';
        for (let j = 0; j < length; j++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
        results.push(randomString);
    }
    
    displayResults(results);
}

function displayResults(strings) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    strings.forEach((str, index) => {
        const stringItem = document.createElement('div');
        stringItem.className = 'string-item';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'string-text';
        textSpan.textContent = str;  // 使用 textContent 避免特殊字符被解释为HTML
        
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.textContent = '复制';
        button.onclick = function() {
            copyToClipboard(str, this);
        };
        
        stringItem.appendChild(textSpan);
        stringItem.appendChild(button);
        
        resultsDiv.appendChild(stringItem);
    });
}

function copyToClipboard(text, button) {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        // 执行复制命令
        document.execCommand('copy');
        
        // 更新按钮文本提示
        const originalText = button.textContent;
        button.textContent = '已复制';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    } catch (err) {
        // 如果复制失败，提示用户
        alert('复制失败，请手动复制: ' + text);
    }
    
    // 移除临时文本区域
    document.body.removeChild(textArea);
}

function clearResults() {
    document.getElementById('results').innerHTML = '';
}