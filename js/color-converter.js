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

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 为所有输入框添加事件监听器
    document.getElementById('hexInput').addEventListener('input', function() {
        updateColorFromHex(this.value);
        // 保存hex值到cookie
        setCookie('hexValue', this.value, 30);
    });
    
    document.getElementById('rgbInput').addEventListener('input', function() {
        updateColorFromRgb(this.value);
    });
    
    document.getElementById('cmykInput').addEventListener('input', function() {
        updateColorFromCmyk(this.value);
    });
    
    document.getElementById('hsvInput').addEventListener('input', function() {
        updateColorFromHsv(this.value);
    });
    
    // 从cookie恢复hex值
    const savedHex = getCookie('hexValue');
    if (savedHex) {
        updateColorFromHex(savedHex);
        document.getElementById('hexInput').value = savedHex;
    } else {
        // 初始设置
        updateColorFromHex('FF0000');
    }
});

// 颜色转换函数
function hexToRgb(hex) {
    // 验證十六進制值 - 支援3, 4, 6, 8位
    if (!/^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(hex)) {
        return null;
    }
    
    // 處理3位或4位十六進制
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('') + 'FF';
    } else if (hex.length === 4) {
        hex = hex.split('').map(char => char + char).join('');
    } else if (hex.length === 6) {
        hex = hex + 'FF';
    }
    // 如果是8位，保持不變
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    let a = parseFloat((parseInt(hex.substring(6, 8), 16) / 255).toFixed(3));
    
    // 確保透明度值在正確範圍內
    a = Math.max(0, Math.min(1, a));
    
    return { r, g, b, a };
}

function rgbToHex(r, g, b, a = 1) {
    // 確保值在有效範圍內
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));
    a = Math.max(0, Math.min(1, parseFloat(a.toFixed(3)))); // 標準化透明度值為三位小數
    
    const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
    
    return [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase() + alphaHex;
}

function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;
    
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    
    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: parseFloat((h * 360).toFixed(3)),
        s: parseFloat((s * 100).toFixed(3)),
        v: parseFloat((v * 100).toFixed(3))
    };
}

function hsvToRgb(h, s, v) {
    h /= 360;
    s /= 100;
    v /= 100;
    
    let r, g, b;
    
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function rgbToCmyk(r, g, b) {
    // 轉換為0-1範圍
    r /= 255;
    g /= 255;
    b /= 255;
    
    // 計算黑色分量
    const k = 1 - Math.max(r, g, b);
    
    if (k === 1) {
        // 如果是純黑色
        return { c: 0, m: 0, y: 0, k: 100 };
    }
    
    // 計算CMY值
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    
    return {
        c: parseFloat((c * 100).toFixed(3)),
        m: parseFloat((m * 100).toFixed(3)),
        y: parseFloat((y * 100).toFixed(3)),
        k: parseFloat((k * 100).toFixed(3))
    };
}

function cmykToRgb(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;
    
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// 更新顏色顯示
function updateColorDisplay(r, g, b, a = 1) {
    const rgb = `rgba(${r}, ${g}, ${b}, ${a})`;
    document.body.style.backgroundColor = rgb;
    
    // 計算亮度並設置文字顏色
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    document.body.style.color = brightness > 128 ? 'black' : 'white';
    
    // 同時更新容器的背景色和文字顏色以保持一致性
    document.querySelector('.container').style.backgroundColor = 'white';
    document.querySelector('.container').style.color = 'black';
}

// 從HEX更新顏色
function updateColorFromHex(hexValue) {
    if (!hexValue) return;
    
    const rgba = hexToRgb(hexValue);
    if (!rgba) return; // 如果HEX格式不正確，則不更新
    
    // 標準化透明度值為三位小數
    const normalizedAlpha = parseFloat(rgba.a.toFixed(3));
    
    // 檢查是否是8位十六進制（包含透明度）
    const hasAlpha = hexValue.length === 4 || hexValue.length === 8;
    
    // 更新RGB
    if (hasAlpha) {
        document.getElementById('rgbInput').value = `${rgba.r},${rgba.g},${rgba.b},${normalizedAlpha}`;
    } else {
        document.getElementById('rgbInput').value = `${rgba.r},${rgba.g},${rgba.b}`;
    }
    
    // 更新CMYK
    const cmyk = rgbToCmyk(rgba.r, rgba.g, rgba.b);
    if (hasAlpha) {
        document.getElementById('cmykInput').value = `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k},${normalizedAlpha}`;
    } else {
        document.getElementById('cmykInput').value = `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}`;
    }
    
    // 更新HSV
    const hsv = rgbToHsv(rgba.r, rgba.g, rgba.b);
    if (hasAlpha) {
        document.getElementById('hsvInput').value = `${hsv.h},${hsv.s},${hsv.v},${normalizedAlpha}`;
    } else {
        document.getElementById('hsvInput').value = `${hsv.h},${hsv.s},${hsv.v}`;
    }
    
    // 更新顯示
    updateColorDisplay(rgba.r, rgba.g, rgba.b, normalizedAlpha);
}

// 從RGB更新顏色
function updateColorFromRgb(rgbValue) {
    if (!rgbValue) return;
    
    const parts = rgbValue.split(',').map(part => part.trim());
    const isRgba = parts.length === 4; // 根據逗號個數判斷是否為RGBA
    
    if ((parts.length !== 3 && parts.length !== 4) || parts.some(isNaN)) return; // 檢查格式是否正確
    
    const r = parseInt(parts[0]);
    const g = parseInt(parts[1]);
    const b = parseInt(parts[2]);
    let a = isRgba ? parseFloat(parts[3]) : 1;
    
    // 標準化透明度值為三位小數
    a = parseFloat(a.toFixed(3));
    
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || 
        (isRgba && (isNaN(a) || a < 0 || a > 1))) return; // 檢查值是否在範圍內
    
    // 更新HEX
    document.getElementById('hexInput').value = rgbToHex(r, g, b, a);
    
    // 更新CMYK
    const cmyk = rgbToCmyk(r, g, b);
    if (isRgba) {
        document.getElementById('cmykInput').value = `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k},${a}`;
    } else {
        document.getElementById('cmykInput').value = `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}`;
    }
    
    // 更新HSV
    const hsv = rgbToHsv(r, g, b);
    if (isRgba) {
        document.getElementById('hsvInput').value = `${hsv.h},${hsv.s},${hsv.v},${a}`;
    } else {
        document.getElementById('hsvInput').value = `${hsv.h},${hsv.s},${hsv.v}`;
    }
    
    // 更新顯示
    updateColorDisplay(r, g, b, a);
}

// 從CMYK更新顏色
function updateColorFromCmyk(cmykValue) {
    if (!cmykValue) return;
    
    const parts = cmykValue.split(',').map(part => part.trim());
    const isCmyka = parts.length === 5; // 根據逗號個數判斷是否為CMYKA
    
    if ((parts.length !== 4 && parts.length !== 5) || parts.some(isNaN)) return; // 檢查格式是否正確
    
    const c = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const y = parseFloat(parts[2]);
    const k = parseFloat(parts[3]);
    let a = isCmyka ? parseFloat(parts[4]) : 1;
    
    // 標準化透明度值為三位小數
    a = parseFloat(a.toFixed(3));
    
    if (c < 0 || c > 100 || m < 0 || m > 100 || y < 0 || y > 100 || k < 0 || k > 100 || 
        (isCmyka && (isNaN(a) || a < 0 || a > 1))) return; // 檢查值是否在範圍內
    
    // 轉換為RGB
    const rgb = cmykToRgb(c, m, y, k);
    
    // 更新HEX
    document.getElementById('hexInput').value = rgbToHex(rgb.r, rgb.g, rgb.b, a);
    
    // 更新RGB
    if (isCmyka) {
        document.getElementById('rgbInput').value = `${rgb.r},${rgb.g},${rgb.b},${a}`;
    } else {
        document.getElementById('rgbInput').value = `${rgb.r},${rgb.g},${rgb.b}`;
    }
    
    // 更新HSV
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    if (isCmyka) {
        document.getElementById('hsvInput').value = `${hsv.h},${hsv.s},${hsv.v},${a}`;
    } else {
        document.getElementById('hsvInput').value = `${hsv.h},${hsv.s},${hsv.v}`;
    }
    
    // 更新顯示
    updateColorDisplay(rgb.r, rgb.g, rgb.b, a);
}

// 從HSV更新顏色
function updateColorFromHsv(hsvValue) {
    if (!hsvValue) return;
    
    const parts = hsvValue.split(',').map(part => part.trim());
    const isHsva = parts.length === 4; // 根據逗號個數判斷是否為HSVA
    
    if ((parts.length !== 3 && parts.length !== 4) || parts.some(isNaN)) return; // 檢查格式是否正確
    
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]);
    const v = parseFloat(parts[2]);
    let a = isHsva ? parseFloat(parts[3]) : 1;
    
    // 標準化透明度值為三位小數
    a = parseFloat(a.toFixed(3));
    
    if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || 
        (isHsva && (isNaN(a) || a < 0 || a > 1))) return; // 檢查值是否在範圍內
    
    // 轉換為RGB
    const rgb = hsvToRgb(h, s, v);
    
    // 更新HEX
    document.getElementById('hexInput').value = rgbToHex(rgb.r, rgb.g, rgb.b, a);
    
    // 更新RGB
    if (isHsva) {
        document.getElementById('rgbInput').value = `${rgb.r},${rgb.g},${rgb.b},${a}`;
    } else {
        document.getElementById('rgbInput').value = `${rgb.r},${rgb.g},${rgb.b}`;
    }
    
    // 更新CMYK
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    if (isHsva) {
        document.getElementById('cmykInput').value = `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k},${a}`;
    } else {
        document.getElementById('cmykInput').value = `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}`;
    }
    
    // 更新顯示
    updateColorDisplay(rgb.r, rgb.g, rgb.b, a);
}

// 复制到剪貼板
function copyToClipboard(inputId) {
    const input = document.getElementById(inputId);
    const value = input.value;
    
    // 使用現代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function() {
            // 顯示復制成功的提示
            const originalText = '复制';
            const button = input.parentNode.querySelector('.copy-btn');
            button.textContent = '已复制';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch(function(err) {
            console.error('复制失败: ', err);
            // 降級到舊方法
            fallbackCopyTextToClipboard(inputId);
        });
    } else {
        // 降級到舊方法
        fallbackCopyTextToClipboard(inputId);
    }
}

// 降級方案
function fallbackCopyTextToClipboard(inputId) {
    const input = document.getElementById(inputId);
    input.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // 顯示復制成功的提示
            const originalText = '复制';
            const button = input.parentNode.querySelector('.copy-btn');
            button.textContent = '已复制';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } else {
            console.error('复制失败');
        }
    } catch (err) {
        console.error('复制失败: ', err);
    }
    
    // 取消選擇
    document.getSelection().removeAllRanges();
}