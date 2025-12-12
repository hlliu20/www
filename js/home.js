document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    setDefaultDate();
    
    // 保存按钮事件
    document.getElementById('saveBtn').addEventListener('click', saveInventory);
    
    // 语音按钮事件
    initVoiceRecognition();
});

// 设置默认日期为今天
function setDefaultDate() {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('date').value = today;
}

// 加载品项到下拉选择框
function loadItems() {
    let cookieData = getCookie('milk_items');
    let items = cookieData ? JSON.parse(cookieData) : {};
    
    // 如果没有品项数据，设置默认品项
    if (Object.keys(items).length === 0) {
        items = setDefaultItems();
    }
    
    const itemSelect = document.getElementById('item');
    itemSelect.innerHTML = '<option value="">请选择品项</option>';
    
    for (const [id, name] of Object.entries(items)) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        itemSelect.appendChild(option);
    }
}

// 设置默认品项
function setDefaultItems() {
    const defaultItems = {
        '1': '原味',
        '2': '白桃',
        '3': '菠萝',
        '4': '草莓',
        '5': '哈密瓜',
        '6': '柳叶包原味',
        '7': '柳叶包白桃',
        '8': '柳叶包菠萝',
        '9': '柳叶包草莓',
        '10': '柳叶包哈密瓜',
        '11': '柳叶包3.6',
        '12': '优佳',
        '13': '250特通',
        '14': '3.6A2',
        '15': '昆仑好客',
        '16': '特通',
        '17': '250特通',
        '18': '3.2利乐砖',
        '19': '配餐',
        '20': '视力嘉',
        '21': '牧场250',
        '22': 'A版'
    };
    
    // 保存默认品项到cookie
    setCookie('milk_items', JSON.stringify(defaultItems), 30);
    
    return defaultItems;
}

// 保存库存数据
function saveInventory() {
    const position = document.getElementById('position').value.trim();
    const itemId = document.getElementById('item').value;
    const date = document.getElementById('date').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // 验证输入
    if (!position || !itemId || !date || isNaN(quantity) || quantity < 0) {
        alert('请填写完整的信息，数量必须为非负数');
        return;
    }
    
    // 解析仓位
    const positionParts = position.match(/^([A-Za-z\u4e00-\u9fa5]*)(\d+.*)$/);
    if (!positionParts) {
        alert('仓位格式不正确，应为字母/中文开头 + 数字，如 A1, B17, 二期A1');
        return;
    }
    
    const positionPrefix = positionParts[1];
    const positionSuffix = positionParts[2];
    
    // 构造cookie名称和值
    const cookieName = 'cw_' + positionPrefix;
    const cookieValue = positionSuffix + ':' + itemId + ':' + date + ':' + quantity;
    
    // 获取现有数据
    let existingData = getCookie(cookieName);
    if (existingData) {
        // 追加新数据
        existingData += ';' + cookieValue;
    } else {
        existingData = cookieValue;
    }
    
    // 保存到cookie
    setCookie(cookieName, existingData, 30);
    
    // 仓位顺延
    incrementPosition(position);
    
    // 清空其他表单项（品项、数量），保留仓位和日期
    document.getElementById('item').value = '';
    document.getElementById('quantity').value = '';
    
    alert('保存成功！');
}

// 仓位顺延功能
function incrementPosition(currentPosition) {
    // 解析仓位
    const positionParts = currentPosition.match(/^([A-Za-z\u4e00-\u9fa5]*)(\d+)(.*)$/);
    if (!positionParts) {
        return;
    }
    
    const prefix = positionParts[1];
    const number = parseInt(positionParts[2]);
    const suffix = positionParts[3] || '';
    
    // 顺延1个仓位（A2 -> A3）
    const newNumber = number + 1;
    const newPosition = prefix + newNumber + suffix;
    
    // 更新仓位输入框
    document.getElementById('position').value = newPosition;
}

// 初始化语音识别
function initVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    // 检查浏览器是否支持语音识别
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        voiceBtn.disabled = true;
        voiceBtn.textContent = '浏览器不支持语音';
        voiceBtn.style.opacity = '0.5';
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    let isRecording = false;
    let recognition = null;
    
    // 麦克风按钮点击事件
    voiceBtn.addEventListener('click', function() {
        if (isRecording) {
            stopVoiceRecording();
        } else {
            startVoiceRecognition();
        }
    });
    
    // 开始语音识别
    function startVoiceRecognition() {
        // 检查网络连接
        if (!navigator.onLine) {
            alert('请检查网络连接');
            return;
        }
        
        isRecording = true;
        voiceBtn.classList.add('recording');
        voiceBtn.textContent = '🔴 录音中...';
        
        // 每次都创建新的识别实例
        recognition = new SpeechRecognition();
        
        // 配置语音识别
        recognition.continuous = false;  // 单次识别
        recognition.interimResults = false;  // 不显示中间结果
        recognition.lang = 'zh-CN';  // 中文识别
        
        // 设置超时时间（10秒）
        setTimeout(() => {
            if (isRecording) {
                alert('录音超时，请重试');
                stopVoiceRecording();
            }
        }, 10000);
        
        // 监听识别结果
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('识别结果:', transcript);
            
            // 分析语音结果并填入表单
            analyzeAndFillForm(transcript);
            
            stopVoiceRecording();
        };
        
        // 监听错误
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            let errorMsg = '识别出错: ';
            
            switch(event.error) {
                case 'no-speech':
                    errorMsg += '没有检测到语音，请重试';
                    break;
                case 'audio-capture':
                    errorMsg += '无法访问麦克风，请检查权限设置';
                    break;
                case 'not-allowed':
                    errorMsg += '麦克风权限被拒绝，请在浏览器设置中允许';
                    break;
                case 'network':
                    errorMsg += '网络连接错误，请检查网络连接或使用HTTPS';
                    break;
                case 'service-not-allowed':
                    errorMsg += '语音识别服务不可用，请稍后重试';
                    break;
                default:
                    errorMsg += event.error;
            }
            
            alert(errorMsg);
            stopVoiceRecording();
        };
        
        // 监听识别结束
        recognition.onend = function() {
            console.log('语音识别结束');
            stopVoiceRecording();
        };
        
        try {
            recognition.start();
            console.log('语音识别已启动');
        } catch (error) {
            console.error('启动语音识别失败:', error);
            stopVoiceRecording();
            
            if (error.name === 'NotSupportedError') {
                alert('您的浏览器不支持语音识别功能');
            } else if (error.message.includes('network')) {
                alert('网络连接问题，请检查网络或使用HTTPS访问');
            } else {
                alert('启动语音识别失败: ' + error.message);
            }
        }
    }
    
    // 停止语音录音
    function stopVoiceRecording() {
        if (isRecording && recognition) {
            try {
                recognition.stop();
            } catch (error) {
                console.log('停止语音识别时出错:', error);
            }
        }
        
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.textContent = '🎤 语音输入';
        recognition = null;
    }
}

// 分析语音结果并填入表单
function analyzeAndFillForm(transcript) {
    console.log('分析语音:', transcript);
    
    // 获取品项列表用于匹配
    let cookieData = getCookie('milk_items');
    let items = cookieData ? JSON.parse(cookieData) : {};
    const itemNames = Object.values(items);
    
    // 初始化结果
    let position = '';
    let item = '';
    let date = '';
    let quantity = '';
    
    // 转换为小写便于匹配
    const lowerTranscript = transcript.toLowerCase();
    
    // 提取仓位 - 匹配字母/中文+数字的模式
    const positionPattern = /([a-zA-Z\u4e00-\u9fa5]+\d+)/g;
    const positionMatches = transcript.match(positionPattern);
    if (positionMatches && positionMatches.length > 0) {
        position = positionMatches[0];
    }
    
    // 提取数量 - 匹配数字
    const quantityPattern = /(\d+)[个件箱瓶批份]/g;
    const quantityMatches = transcript.match(quantityPattern);
    if (quantityMatches && quantityMatches.length > 0) {
        quantity = quantityMatches[0].replace(/[个件箱瓶批份]/g, '');
    }
    
    // 如果没有找到数量，尝试匹配纯数字
    /*if (!quantity) {
        const numberPattern = /(\d+)/g;
        const numberMatches = transcript.match(numberPattern);
        if (numberMatches && numberMatches.length > 0) {
            // 取最后一个数字作为数量（假设最后说的是数量）
            quantity = numberMatches[numberMatches.length - 1];
        }
    }*/
    
    // 提取日期 - 匹配年月日或今天/明天等
    const today = new Date();
    const datePatterns = [
        /(\d{4}年\d{1,2}月\d{1,2}日)/,
        /(\d{1,2}月\d{1,2}日)/,
        /(今天|今日)/,
        /(明天|明日)/,
        /(昨天)/
    ];
    
    for (const pattern of datePatterns) {
        const match = transcript.match(pattern);
        if (match) {
            const dateStr = match[0];
            if (dateStr.includes('今天') || dateStr.includes('今日')) {
                date = today.toISOString().slice(0, 10);
            } else if (dateStr.includes('明天') || dateStr.includes('明日')) {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                date = tomorrow.toISOString().slice(0, 10);
            } else if (dateStr.includes('昨天')) {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                date = yesterday.toISOString().slice(0, 10);
            } else if (dateStr.includes('年')) {
                // 完整日期格式
                const yearMatch = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
                if (yearMatch) {
                    const year = yearMatch[1];
                    const month = yearMatch[2].padStart(2, '0');
                    const day = yearMatch[3].padStart(2, '0');
                    date = `${year}-${month}-${day}`;
                }
            } else {
                // 月日格式
                const monthDayMatch = dateStr.match(/(\d{1,2})月(\d{1,2})日/);
                if (monthDayMatch) {
                    const month = monthDayMatch[1].padStart(2, '0');
                    const day = monthDayMatch[2].padStart(2, '0');
                    date = `${today.getFullYear()}-${month}-${day}`;
                }
            }
            break;
        }
    }
    
    // 匹配品项 - 使用模糊匹配
    if (itemNames.length > 0) {
        let bestMatch = '';
        let bestScore = 0;
        
        for (const itemName of itemNames) {
            const score = calculateSimilarity(lowerTranscript, itemName.toLowerCase());
            if (score > bestScore && score > 0.3) {  // 设置相似度阈值
                bestScore = score;
                bestMatch = itemName;
            }
        }
        
        if (bestMatch) {
            // 找到对应的品项ID
            for (const [id, name] of Object.entries(items)) {
                if (name === bestMatch) {
                    item = id;
                    break;
                }
            }
        }
    }
    
    // 填入表单（只填入识别到的项）
    let filledCount = 0;
    
    if (position) {
        document.getElementById('position').value = position;
        filledCount++;
    }
    if (item) {
        document.getElementById('item').value = item;
        filledCount++;
    }
    if (date) {
        document.getElementById('date').value = date;
        filledCount++;
    }
    if (quantity) {
        document.getElementById('quantity').value = quantity;
        filledCount++;
    }
    
    // 显示识别结果
    let resultMessage = '语音识别结果：\n';
    resultMessage += `原文：${transcript}\n`;
    resultMessage += `仓位：${position || '未识别（未修改）'}\n`;
    resultMessage += `品项：${item ? items[item] : '未识别（未修改）'}\n`;
    resultMessage += `日期：${date || '未识别（未修改）'}\n`;
    resultMessage += `数量：${quantity || '未识别（未修改）'}\n`;
    resultMessage += `\n已填入 ${filledCount} 个字段`;
    
    alert(resultMessage);
}

// 计算字符串相似度（使用简单的编辑距离算法）
function calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1;
    
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return 1;
    
    // 简化的相似度计算：检查包含关系
    if (str1.includes(str2) || str2.includes(str1)) {
        return Math.min(len1, len2) / maxLen;
    }
    
    // 检查是否有共同的字符
    let commonChars = 0;
    for (let i = 0; i < Math.min(len1, len2); i++) {
        if (str1[i] === str2[i]) {
            commonChars++;
        }
    }
    
    return commonChars / maxLen;
}