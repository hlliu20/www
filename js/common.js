// 通用Cookie操作函数
function setCookie(name, value, days) {
    // alert('Setting cookie: ' + name + ' = ' + value + ' (days: ' + days + ')'); // 调试信息
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const cookieStr = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/';
    // alert('Cookie string: ' + cookieStr); // 调试信息
    document.cookie = cookieStr;
    // alert('Cookie set. Current cookies: ' + document.cookie); // 调试信息
}

function getCookie(name) {
    // alert('Getting cookie: ' + name); // 调试信息
    // alert('All cookies: ' + document.cookie); // 调试信息
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
            // alert('Found cookie value: ' + value); // 调试信息
            return value;
        }
    }
    // alert('Cookie not found'); // 调试信息
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}

// 获取所有以特定前缀开头的cookie
function getCookiesByPrefix(prefix) {
    const cookies = {};
    const allCookies = document.cookie.split(';');
    
    for (let i = 0; i < allCookies.length; i++) {
        let cookie = allCookies[i].trim();
        if (cookie.startsWith(prefix)) {
            const [name, value] = cookie.split('=');
            cookies[name] = decodeURIComponent(value);
        }
    }
    
    return cookies;
}

// 导出数据
function exportData() {
    const cookieData = getCookie('milk_items');
    const data = {
        items: cookieData ? JSON.parse(cookieData) : {},
        inventory: getCookiesByPrefix('cw_')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'text/plain'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'milk_inventory_' + new Date().toISOString().slice(0, 10) + '.txt';
    link.click();
}

// 导入数据
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                
                // 导入品项数据
                if (data.items) {
                    setCookie('milk_items', JSON.stringify(data.items), 30);
                }
                
                // 导入库存数据
                if (data.inventory) {
                    for (const [key, value] of Object.entries(data.inventory)) {
                        setCookie(key, value, 30);
                    }
                }
                
                alert('数据导入成功！');
                location.reload();
            } catch (error) {
                alert('导入失败：文件格式不正确');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// 清空库存记录
function clearInventoryRecords() {
    // 第一次确认
    if (!confirm('确定要清空所有库存记录吗？\n此操作将删除所有以"cw_"开头的Cookie数据，且无法恢复！')) {
        return;
    }
    
    // 第二次确认
    if (!confirm('再次确认：您真的要清空所有库存记录吗？\n包括所有仓位的品项、日期和数量信息！')) {
        return;
    }
    
    // 获取所有cw_开头的cookie并删除
    const cookies = document.cookie.split(';');
    let deletedCount = 0;
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('cw_')) {
            const name = cookie.split('=')[0];
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
            deletedCount++;
        }
    }
    
    alert(`已成功清空 ${deletedCount} 条库存记录！`);
    
    // 如果当前在结果页面，刷新页面显示
    if (window.location.pathname.includes('cw_result.html')) {
        location.reload();
    }
}