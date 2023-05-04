/**
 * 对js的一些拓展
 * by littlefean
 */


// 数组方法扩展
Array.prototype.removeByIndex = function (i) {
    if (0 <= i && i < this.length) {
        this.splice(i, 1);
    }
}
/**
 * 在数组中插入元素
 * @param i {Number} 插入位置在i位置前面
 * @param item 插入的元素
 */
Array.prototype.insert = function (i, item) {
    if (0 <= i && i <= this.length) {
        this.splice(i, 0, item);
    }
}
// 去除左空格
String.prototype.lStrip = function () {
    let newStr = "";
    let start = 0;
    for (let i = 0; i < this.length; i++) {
        if (this[i] !== " ") {
            break;
        }
        start++;
    }
    for (let i = start; i < this.length; i++) {
        newStr += this[i];
    }
    return newStr;
}
// 统计左侧有多少个空格
String.prototype.lSpaceCount = function () {
    let start = 0;
    for (let i = 0; i < this.length; i++) {
        if (this[i] !== " ") {
            break;
        }
        start++;
    }
    return start;
}
/**
 * 删除指定下标位置的字符，并返回新的字符串
 * @param x {Number}
 * @return {string}
 */
String.prototype.removeChar = function (x) {
    return this.substring(0, x) + this.substring(x + 1, this.length);
}
/**
 * 在下标前面插入字符串并返回新字符串
 * @param char 新插入的字符串
 * @param i 下标
 * @return {string} 插入后的字符串
 */
String.prototype.insertChar = function (char, i) {
    if (char === undefined) console.warn("插入的东西不能是 undefined")
    else
        return this.substring(0, i) + char + this.substring(i, this.length);
}

/**
 * 检测这个数字是否在区间 [0, len)
 * @param len 表示一个序列的意思
 */
Number.prototype.inLength = function (len) {
    if (len === undefined) {
        console.warn("传度的长度数字不是一个数字，是一个未定义")
        return false;
    }
    if (this < 0) {
        console.warn("数字越界<0", this, len.name);
        return false;
    } else if (this >= len) {
        console.warn("数字过大越界", this, ">=", len, len.name);
        return false;
    } else {
        return true;
    }
}


/**
 * div 插入元素 在 i 之前插入元素
 * @param div {HTMLDivElement}
 * @param i {Number}
 */
HTMLDivElement.prototype.insertByIndex = function (div, i) {
    if (this.childElementCount === 0) {
        this.appendChild(div);
    }
    if (i === this.childElementCount) {
        this.appendChild(div);
    }
    if (i > this.childElementCount) {
        console.warn("无法插入这个元素，下标越界了", "插入位置：", i, "元素数量", this.childElementCount);
    } else {
        this.insertBefore(div, this.children[i]);
    }
}
/**
 * 删除这个div元素的最后一个孩子
 */
HTMLDivElement.prototype.pop = function () {
    if (this.childElementCount !== 0) {
        this.removeChild(this.children[this.childElementCount - 1]);
    } else {
        console.warn("已经删空了");
    }
}

