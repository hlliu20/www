/**
 * 排班数据
 * 0 - 休息
 * 9, 11 - 白班
 * 13 - 夜班
 * 17, 20 - 特殊班次
 */
let ban = null;
let currentDataYearMonth = null; // 当前加载数据的年月，格式：YYYY-MM

// 从JSON文件加载排班数据
async function loadBanData() {
    try {
        // 获取当前年月
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const fileName = `static/pb_${year}_${month}.json`;
        
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        ban = await response.json();
        currentDataYearMonth = `${year}-${month}`; // 保存当前数据的年月
        
        // 数据加载完成后初始化页面
        fillSelectPeople();
        // 设置默认日期为今天
        const today = new Date();
        const formattedDate = formatDate(today);
        dateInput.value = formattedDate;
        getDatePB(formattedDate);
    } catch (error) {
        console.error('加载排班数据失败:', error);
        // 如果加载失败，可以使用默认数据或显示错误信息
        resultDiv.innerHTML = '加载排班数据失败，请稍后重试';
    }
}

// 初始化数据
loadBanData();

// DOM元素引用
const personSelect = document.getElementById('personSelect');
const dateInput = document.getElementById('date');
const resultDiv = document.getElementById('result');

// 事件监听器
personSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        getPeoplePB(e.target.value);
    }
});

dateInput.addEventListener('change', (e) => {
    if (e.target.value) {
        getDatePB(e.target.value);
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    fillSelectPeople();
    // 设置默认日期为今天
    const today = new Date();
    const formattedDate = formatDate(today);
    dateInput.value = formattedDate;
    getDatePB(formattedDate);
});

/**
 * 根据人员查询排班
 * @param {string} people - 人员姓名
 */
function getPeoplePB(people) {
    if (!ban[people]) return;
    
    const schedule = ban[people];
    let result = `<h3>${people} 本月排班</h3><div class="schedule-grid">`;
    
    for (let i = 0; i < schedule.length; i++) {
        const day = i + 1;
        const shift = schedule[i];
        let shiftText, shiftClass;
        
        if (shift === 0) {
            shiftText = '休';
            shiftClass = 'shift-off';
        } else if (shift === 9 || shift === 11) {
            shiftText = '白班';
            shiftClass = 'shift-day';
        } else if (shift === 13) {
            shiftText = '夜班';
            shiftClass = 'shift-night';
        } else {
            shiftText = `${shift}小时`;
            shiftClass = 'shift-special';
        }
        
        result += `<div class="schedule-item"><span class="day">${day}号</span><span class="shift ${shiftClass}">${shiftText}</span></div>`;
    }
    
    result += '</div>';
    
    // 将换行符替换为<br>标签以在HTML中正确显示
    resultDiv.innerHTML = result;
}

/**
 * 根据日期查询排班
 * @param {string} date - 日期字符串 (YYYY-MM-DD)
 */
async function getDatePB(date) {
    document.getElementById("bai-title").innerHTML = date + " 白班";
    document.getElementById("ye-title").innerHTML = date + " 夜班";
    
    const selectDay = new Date(date);
    const ind = selectDay.getDate() - 1;
    
    // 获取选择日期的年月
    const year = selectDay.getFullYear();
    const month = String(selectDay.getMonth() + 1).padStart(2, '0');
    const selectedYearMonth = `${year}-${month}`;
    const fileName = `static/pb_${year}_${month}.json`;
    
    // 检查是否需要加载新的数据文件
    if (currentDataYearMonth !== selectedYearMonth) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newBan = await response.json();
            ban = newBan; // 更新数据
            currentDataYearMonth = selectedYearMonth; // 更新当前数据的年月
            fillSelectPeople(); // 更新人员选择列表
        } catch (error) {
            console.error(`加载${fileName}失败:`, error);
            resultDiv.innerHTML = `无法加载${year}年${month}月的排班数据，请稍后重试`;
            return;
        }
    }

    let res_bai = date + " 白班：\n";
    let res_ye = "\n\n" + date + " 夜班：\n";
    let res_xiu = "\n\n休：\n";
    const bai = [];
    const ye = [];
    
    for (const [name, arr] of Object.entries(ban)) {
        const val = arr[ind];
        if (val === 0) {
            res_xiu += name + " ";
        } else if (val === 9 || val === 11) {
            res_bai += name + " ";
            bai.push(name);
        } else if (val === 13) {
            res_ye += name + " ";
            ye.push(name);
        }
    }
    
    // 执行填充
    fillKG('bai', bai);
    fillKG('ye', ye);

    // 将换行符替换为<br>标签以在HTML中正确显示
    resultDiv.innerHTML = res_bai.replace(/\n/g, '<br>') + 
                          res_ye.replace(/\n/g, '<br>') + 
                          res_xiu.replace(/\n/g, '<br>')
}

/**
 * 填充人员选择下拉框
 */
function fillSelectPeople() {
    // 清空现有选项（保留默认选项）
    while (personSelect.children.length > 1) {
        personSelect.removeChild(personSelect.lastChild);
    }

    // 遍历排班数据的键，动态插入选项
    Object.keys(ban).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        personSelect.appendChild(opt);
    });
}

/**
 * 填充网格数据
 * @param {string} id - 网格ID前缀 (如 'bai' 或 'ye')
 * @param {Array} arr - 人员数组
 */
function fillKG(id, arr) {
    // 第一行 5 个
    const r1 = document.getElementById(id + '-1');
    if (r1) {
        r1.querySelectorAll('div').forEach((d, i) => {
            d.textContent = arr[i] !== undefined ? arr[i] : '';
        });
    }
    // 第二行 5 个
    const r2 = document.getElementById(id + '-2');
    if (r2) {
        r2.querySelectorAll('div').forEach((d, i) => {
            d.textContent = arr[i + 5] !== undefined ? arr[i + 5] : '';
        });
    }
    // 第三行 5 个
    const r3 = document.getElementById(id + '-3');
    if (r3) {
        r3.querySelectorAll('div').forEach((d, i) => {
            d.textContent = arr[i + 10] !== undefined ? arr[i + 10] : '';
        });
    }
    // 第四行 5 个
    const r4 = document.getElementById(id + '-4');
    if (r4) {
        r4.querySelectorAll('div').forEach((d, i) => {
            d.textContent = arr[i + 15] !== undefined ? arr[i + 15] : '';
        });
    }
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化后的日期字符串
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
