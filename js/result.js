document.addEventListener('DOMContentLoaded', function() {
    loadResults();
    
    // 收起详情按钮
    document.getElementById('closeDetail').addEventListener('click', function() {
        document.getElementById('detailContainer').style.display = 'none';
    });
    
    // 编辑所有按钮
    document.getElementById('editAllBtn').addEventListener('click', function() {
        enterEditMode();
    });
    
    // 保存所有按钮
    document.getElementById('saveAllBtn').addEventListener('click', function() {
        saveAllChanges();
    });
    
    // 取消编辑按钮
    document.getElementById('cancelEditBtn').addEventListener('click', function() {
        exitEditMode();
    });
});

// 当前显示的详情数据
let currentDetailData = [];
let currentItemName = '';
let currentDate = '';

// 加载并显示结果
function loadResults() {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';
    
    // 获取品项数据
    let cookieData = getCookie('milk_items');
    let items = cookieData ? JSON.parse(cookieData) : {};
    
    // 获取所有库存数据
    const inventoryCookies = getCookiesByPrefix('cw_');
    
    // 按品项和日期统计数量
    const statistics = {};
    // 存储详细信息用于展开显示
    const detailData = {};
    
    for (const [cookieName, cookieValue] of Object.entries(inventoryCookies)) {
        const entries = cookieValue.split(';');
        
        for (const entry of entries) {
            const parts = entry.split(':');
            if (parts.length !== 4) continue;
            
            const [positionSuffix, itemId, date, quantity] = parts;
            const itemName = items[itemId] || '未知品项';
            const qty = parseInt(quantity);
            
            // 重构仓位名称
            const positionPrefix = cookieName.substring(3); // 去掉 "cw_" 前缀
            const fullPosition = positionPrefix + positionSuffix;
            
            const key = itemName + '|' + date;
            if (!statistics[key]) {
                statistics[key] = 0;
                detailData[key] = [];
            }
            statistics[key] += qty;
            detailData[key].push({
                position: fullPosition,
                quantity: qty,
                cookieName: cookieName,
                originalEntry: entry
            });
        }
    }
    
    // 按品项名称和日期排序
    const sortedKeys = Object.keys(statistics).sort();
    
    // 生成表格内容
    for (const key of sortedKeys) {
        const [itemName, date] = key.split('|');
        const totalQuantity = statistics[key];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${itemName}</td>
            <td>${date}</td>
            <td>${totalQuantity}</td>
        `;
        row.style.cursor = 'pointer';
        row.addEventListener('click', function() {
            showDetail(itemName, date, detailData[key]);
        });
        resultsBody.appendChild(row);
    }
    
    // 如果没有数据，显示提示
    if (sortedKeys.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3" style="text-align: center;">暂无数据</td>
        `;
        resultsBody.appendChild(row);
    }
}

// 显示详情
function showDetail(itemName, date, positionData) {
    const detailContainer = document.getElementById('detailContainer');
    const detailTitle = document.getElementById('detailTitle');
    const detailContent = document.getElementById('detailContent');
    
    currentItemName = itemName;
    currentDate = date;
    currentDetailData = [...positionData]; // 复制数据
    
    detailTitle.textContent = `${itemName} - ${date}`;
    detailContent.innerHTML = '';
    
    renderPositionItems(positionData, false);
    
    detailContainer.style.display = 'block';
    
    // 重置编辑状态
    exitEditMode();
}

// 渲染仓位项目
function renderPositionItems(positionData, showAddButton) {
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = '';
    
    for (const item of positionData) {
        const positionDiv = document.createElement('div');
        positionDiv.className = 'position-item';
        positionDiv.innerHTML = `
            <div class="position-name">${item.position}</div>
            <div class="position-quantity" data-quantity="${item.quantity}" data-cookie="${item.cookieName}" data-entry="${item.originalEntry}">${item.quantity}</div>
        `;
        detailContent.appendChild(positionDiv);
    }
    
    // 只在编辑模式下显示新增按钮
    if (showAddButton) {
        const addDiv = document.createElement('div');
        addDiv.className = 'position-item add-position-item';
        addDiv.innerHTML = `
            <div class="add-icon">+</div>
            <div class="add-text">新增仓位</div>
        `;
        addDiv.addEventListener('click', function() {
            addNewPosition();
        });
        detailContent.appendChild(addDiv);
    }
}

// 进入编辑模式
function enterEditMode() {
    const detailContent = document.getElementById('detailContent');
    const quantityDivs = detailContent.querySelectorAll('.position-quantity');
    
    quantityDivs.forEach(function(div) {
        const currentQuantity = div.textContent;
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'edit-input';
        input.value = currentQuantity;
        input.min = '0';
        input.dataset.originalValue = currentQuantity;
        
        div.innerHTML = '';
        div.appendChild(input);
    });
    
    // 重新渲染，显示新增按钮
    renderPositionItems(currentDetailData, true);
    
    // 再次进入编辑模式，将现有数量改为输入框
    const newQuantityDivs = detailContent.querySelectorAll('.position-quantity');
    newQuantityDivs.forEach(function(div) {
        const currentQuantity = div.textContent;
        if (currentQuantity && !div.querySelector('input')) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'edit-input';
            input.value = currentQuantity;
            input.min = '0';
            input.dataset.originalValue = currentQuantity;
            
            div.innerHTML = '';
            div.appendChild(input);
        }
    });
    
    // 切换按钮显示
    document.getElementById('editAllBtn').style.display = 'none';
    document.getElementById('saveAllBtn').style.display = 'inline-block';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

// 退出编辑模式
function exitEditMode() {
    const detailContent = document.getElementById('detailContent');
    
    // 重新渲染，不显示新增按钮
    renderPositionItems(currentDetailData, false);
    
    // 切换按钮显示
    document.getElementById('editAllBtn').style.display = 'inline-block';
    document.getElementById('saveAllBtn').style.display = 'none';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

// 保存所有更改
function saveAllChanges() {
    const detailContent = document.getElementById('detailContent');
    
    // 获取品项数据
    let cookieData = getCookie('milk_items');
    let items = cookieData ? JSON.parse(cookieData) : {};
    
    // 找到对应品项的ID
    let itemId = null;
    for (const [id, name] of Object.entries(items)) {
        if (name === currentItemName) {
            itemId = id;
            break;
        }
    }
    
    if (!itemId) {
        alert('品项ID未找到');
        return;
    }
    
    // 收集所有需要更新的数据
    const updates = {};
    const deletions = [];
    let hasError = false;
    
    // 处理现有仓位的编辑
    const positionItems = detailContent.querySelectorAll('.position-item:not(.add-position-item)');
    positionItems.forEach(function(itemDiv) {
        const quantityDiv = itemDiv.querySelector('.position-quantity');
        const input = quantityDiv ? quantityDiv.querySelector('input') : null;
        
        if (input) {
            const newQuantity = parseInt(input.value);
            const cookieName = quantityDiv.dataset.cookie;
            const originalEntry = quantityDiv.dataset.entry;
            
            if (isNaN(newQuantity) || newQuantity < 0) {
                alert('请输入有效的数量（非负整数）');
                hasError = true;
                return;
            }
            
            if (newQuantity === 0) {
                // 数量为0，删除该条目
                deletions.push({ cookieName, entry: originalEntry });
            } else {
                // 更新数量
                if (!updates[cookieName]) {
                    updates[cookieName] = [];
                }
                updates[cookieName].push({
                    oldEntry: originalEntry,
                    newQuantity: newQuantity
                });
            }
        }
    });
    
    if (hasError) return;
    
    // 处理新增仓位
    const newPositions = detailContent.querySelectorAll('.new-position-item');
    newPositions.forEach(function(div) {
        const positionInput = div.querySelector('.new-position-input');
        const quantityInput = div.querySelector('.edit-input');
        
        if (positionInput && quantityInput) {
            const position = positionInput.value.trim();
            const quantity = parseInt(quantityInput.value);
            
            if (position && !isNaN(quantity) && quantity > 0) {
                // 解析仓位
                const positionParts = position.match(/^([A-Za-z\u4e00-\u9fa5]*)(\d+.*)$/);
                if (!positionParts) {
                    alert('仓位格式不正确：' + position);
                    hasError = true;
                    return;
                }
                
                const positionPrefix = positionParts[1];
                const positionSuffix = positionParts[2];
                const cookieName = 'cw_' + positionPrefix;
                const newEntry = positionSuffix + ':' + itemId + ':' + currentDate + ':' + quantity;
                
                if (!updates[cookieName]) {
                    updates[cookieName] = [];
                }
                updates[cookieName].push({
                    newEntry: newEntry
                });
            }
        }
    });
    
    if (hasError) return;
    
    // 执行更新
    for (const [cookieName, changeList] of Object.entries(updates)) {
        let cookieData = getCookie(cookieName);
        if (!cookieData) {
            cookieData = '';
        }
        
        let entries = cookieData ? cookieData.split(';') : [];
        
        for (const change of changeList) {
            if (change.oldEntry) {
                // 更新现有条目
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i] === change.oldEntry) {
                        const parts = change.oldEntry.split(':');
                        if (parts.length === 4) {
                            entries[i] = parts[0] + ':' + parts[1] + ':' + parts[2] + ':' + change.newQuantity;
                        }
                        break;
                    }
                }
            } else if (change.newEntry) {
                // 添加新条目
                entries.push(change.newEntry);
            }
        }
        
        // 过滤空条目并保存
        entries = entries.filter(entry => entry.trim());
        setCookie(cookieName, entries.join(';'), 30);
    }
    
    // 执行删除
    for (const deletion of deletions) {
        let cookieData = getCookie(deletion.cookieName);
        if (cookieData) {
            let entries = cookieData.split(';');
            entries = entries.filter(entry => entry !== deletion.entry);
            
            if (entries.length > 0) {
                setCookie(deletion.cookieName, entries.join(';'), 30);
            } else {
                // 如果cookie为空，删除整个cookie
                document.cookie = deletion.cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
            }
        }
    }
    
    // 刷新显示
    loadResults();
    
    // 重新加载当前详情数据
    const inventoryCookies = getCookiesByPrefix('cw_');
    const updatedDetailData = [];
    
    for (const [cookieName, cookieValue] of Object.entries(inventoryCookies)) {
        const entries = cookieValue.split(';');
        
        for (const entry of entries) {
            const parts = entry.split(':');
            if (parts.length !== 4) continue;
            
            const [positionSuffix, entryItemId, date, quantity] = parts;
            const qty = parseInt(quantity);
            
            if (entryItemId === itemId && date === currentDate && qty > 0) {
                const positionPrefix = cookieName.substring(3);
                const fullPosition = positionPrefix + positionSuffix;
                
                updatedDetailData.push({
                    position: fullPosition,
                    quantity: qty,
                    cookieName: cookieName,
                    originalEntry: entry
                });
            }
        }
    }
    
    currentDetailData = updatedDetailData;
    showDetail(currentItemName, currentDate, currentDetailData);
    
    alert('保存成功！');
}

// 添加新仓位
function addNewPosition() {
    const detailContent = document.getElementById('detailContent');
    const addButton = detailContent.querySelector('.add-position-item');
    
    const newPositionDiv = document.createElement('div');
    newPositionDiv.className = 'position-item new-position-item';
    newPositionDiv.innerHTML = `
        <input type="text" class="new-position-input" placeholder="输入仓位">
        <div class="position-quantity">
            <input type="number" class="edit-input" placeholder="数量" min="0" value="1">
        </div>
    `;
    
    // 在新增按钮前插入
    detailContent.insertBefore(newPositionDiv, addButton);
    
    // 自动聚焦仓位输入框
    newPositionDiv.querySelector('.new-position-input').focus();
}