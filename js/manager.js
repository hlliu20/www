document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    
    // 快速新建品项按钮
    const addBtn = document.getElementById('addNewItem');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const quickInput = document.getElementById('quickAddItem');
            const itemName = quickInput ? quickInput.value.trim() : '';
            
            if (!itemName) {
                // 如果输入框为空，打开模态框
                document.getElementById('addItemModal').style.display = 'block';
            } else {
                // 如果输入框不为空，直接添加品项
                addItem(itemName);
                if (quickInput) {
                    quickInput.value = '';
                }
            }
        });
    }
    
    // 输入框回车事件
    const quickInput = document.getElementById('quickAddItem');
    if (quickInput) {
        quickInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('addNewItem').click();
            }
        });
    }
    
    // 关闭模态框
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('addItemModal').style.display = 'none';
        });
    }
    
    // 保存新品项
    const saveBtn = document.getElementById('saveNewItem');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const itemName = document.getElementById('newItemName').value.trim();
            
            if (!itemName) {
                alert('请输入品项名称');
                return;
            }
            
            addItem(itemName);
            document.getElementById('newItemName').value = '';
            document.getElementById('addItemModal').style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('addItemModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// 加载品项列表
function loadItems() {
    let cookieData = getCookie('milk_items');
    let items = cookieData ? JSON.parse(cookieData) : {};
    
    const itemsList = document.getElementById('itemsList');
    if (!itemsList) {
        return;
    }
    itemsList.innerHTML = '';
    
    for (const [id, name] of Object.entries(items)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-row';
        itemDiv.innerHTML = `
            <span class="item-info">${name} (ID: ${id})</span>
            <button class="btn btn-danger delete-btn" onclick="deleteItem('${id}', '${name}')">删除</button>
        `;
        itemsList.appendChild(itemDiv);
    }
}

// 添加品项
function addItem(itemName) {
    let cookieData = getCookie('milk_items');
    let items = cookieData ? JSON.parse(cookieData) : {};
    
    // 检查是否已存在同名品项
    for (const [id, name] of Object.entries(items)) {
        if (name === itemName) {
            alert('品项 "' + itemName + '" 已存在！');
            return;
        }
    }
    
    // 找到最大的ID
    let maxId = 0;
    for (const id of Object.keys(items)) {
        maxId = Math.max(maxId, parseInt(id));
    }
    
    const newId = (maxId + 1).toString();
    items[newId] = itemName;
    
    setCookie('milk_items', JSON.stringify(items), 30);
    loadItems();
}

// 删除品项
function deleteItem(itemId, itemName) {
    if (confirm(`确定要删除品项 "${itemName}" 吗？`)) {
        let cookieData = getCookie('milk_items');
        let items = cookieData ? JSON.parse(cookieData) : {};
        
        delete items[itemId];
        setCookie('milk_items', JSON.stringify(items), 30);
        loadItems();
    }
}