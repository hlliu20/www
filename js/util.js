/**
 * 安全计算字符串表达式
 * @param {string} expression - 要计算的数学表达式字符串
 * @returns {object} - 包含计算状态和结果的对象 { success: boolean, result: number }
 */
function safeCalculate(expression) {
    // 检查输入是否为字符串
    if (typeof expression !== 'string') {
        return { success: false, result: 0 };
    }

    // 去除空格
    expression = expression.replace(/\s/g, '');

    // 验证字符串是否只包含数字、小数点、加减乘除符号和括号
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        return { success: false, result: 0 };
    }

    // 检查括号是否匹配
    let parenCount = 0;
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '(') parenCount++;
        else if (expression[i] === ')') parenCount--;
        if (parenCount < 0) return { success: false, result: 0 };
    }
    if (parenCount !== 0) return { success: false, result: 0 };

    try {
        // 使用Function构造器进行计算，但要限制可以执行的操作
        // 首先验证表达式结构，确保不包含危险字符或函数调用
        if (
            /Math|eval|alert|console|window|document|Function|exec|script|<|>|=|;|,|&|\||%|`|\[|\]/i.test(expression)
        ) {
            return { success: false, result: 0 };
        }

        // 简单计算，使用Function构造器但限制范围
        // 构造一个安全的计算函数
        const calcFunction = new Function('return (' + expression + ')');
        const result = calcFunction();

        // 检查结果是否为有效数字
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            return { success: false, result: 0 };
        }

        return { success: true, result: result };
    } catch (e) {
        // 捕获计算错误
        return { success: false, result: 0 };
    }
}

/**
 * 移除字符串开头和结尾的运算符
 * @param {string} expr - 要处理的表达式
 * @returns {string} - 处理后的表达式
 */
function removeLeadingTrailingOperators(expr) {
    // 移除开头和结尾的+、*符号
    expr = expr.replace(/^[+*]+/, ''); // 移除开头的+、*
    expr = expr.replace(/[+*]+$/, ''); // 移除结尾的+、*
    return expr;
}

/**
 * 验证表达式是否合法
 * @param {string} expr - 要验证的表达式
 * @returns {boolean} - 表达式是否合法
 */
function isValidExpression(expr) {
    // 检查是否为空
    if (!expr) return false;
    
    // 去除空格
    expr = expr.replace(/\s/g, '');
    
    // 检查是否只包含数字、小数点、加减乘除符号和括号
    if (!/^[0-9+\-*/.() ]+$/.test(expr)) {
        return false;
    }
    
    // 检查括号是否匹配
    let parenCount = 0;
    for (let i = 0; i < expr.length; i++) {
        if (expr[i] === '(') parenCount++;
        else if (expr[i] === ')') parenCount--;
        if (parenCount < 0) return false;
    }
    if (parenCount !== 0) return false;
    
    // 检查是否以运算符开头或结尾（除了负号）
    if (/^[+\-*/.]+$/.test(expr.charAt(0)) && expr.charAt(0) !== '-') return false;
    if (/^[+\-*/.]+$/.test(expr.charAt(expr.length - 1))) return false;
    
    // 检查是否有连续的运算符
    if (/[+\-*/]{2,}/.test(expr.replace('--', '').replace('+-', '').replace('-+', ''))) return false;
    
    // 检查是否有其他明显错误的模式
    if (/\d*[+\-*/.]{2,}\d*/.test(expr)) {
        // 检查运算符之间是否有数字，但允许负号
        const parts = expr.split(/[\+\*\/]/);
        for (const part of parts) {
            if (part && !/^-?\d*\.?\d*$/.test(part)) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * 设置cookie
 * @param {string} name - cookie名称
 * @param {string} value - cookie值
 * @param {number} days - 有效期天数
 */
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

/**
 * 获取cookie值
 * @param {string} name - cookie名称
 * @returns {string|null} - cookie值或null
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 导出函数（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        safeCalculate,
        removeLeadingTrailingOperators,
        isValidExpression,
        setCookie,
        getCookie
    };
} else if (typeof window !== 'undefined') {
    window.util = window.util || {};
    window.util.safeCalculate = safeCalculate;
    window.util.removeLeadingTrailingOperators = removeLeadingTrailingOperators;
    window.util.isValidExpression = isValidExpression;
    window.util.setCookie = setCookie;
    window.util.getCookie = getCookie;
}