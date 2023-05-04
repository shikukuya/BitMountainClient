/**
 * 字符串拼接
 * 将两个字符串拼接起来，先按照字典序，
 * 字典序小的在前面。
 * by littlefean
 */
export function connectStr(aStr, bStr) {
  if (aStr < bStr) {
    return aStr + bStr;
  } else {
    return bStr + aStr;
  }
}

/**
 * 拼接
 * @param arr
 */
export function sortAndConcatenateStrings(arr) {
  // 使用Array.sort()方法按字典序升序排列字符串数组
  const sortedArr = arr.sort();
  // 使用Array.join()方法将排好序的字符串数组拼接成一个字符串
  return sortedArr.join('');
}

/**
 * 用特殊的方式拼接字符串
 * 前提是ab都不是空字符串
 * @param a
 * @param b
 */
export function zipStr(a, b) {
  let res = "";
  let len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    res += a[i];
    res += b[i];
  }
  return res;
}

export function zip_longest(str1, str2) {
  let maxLength = Math.max(str1.length, str2.length);
  let result = "";
  for (let i = 0; i < maxLength; i++) {
    if (i < str1.length) {
      result += str1.charAt(i);
    }
    if (i < str2.length) {
      result += str2.charAt(i);
    }
  }
  return result;
}

export function isMostlyChinese(str) {
  const chineseRegex = /[\u4e00-\u9fa5]/; // 匹配中文字符的正则表达式
  let count = 0; // 统计中文字符的数量

  // 遍历字符串中的每个字符，判断是否是中文字符
  for (let i = 0; i < str.length; i++) {
    if (chineseRegex.test(str[i])) {
      count++;
    }
  }

  // 判断中文字符的数量是否超过一半
  return count > str.length / 2;
}

/**
 * 这个函数的基本思路是先去掉所有注释，
 * 然后去掉所有空格、制表符、换行符等，最后统计各种字符的数量。
 * 其中，关键字的判断使用了一个简单的正则表达式，
 * 它只会匹配由英文字母组成的单词，而且这些单词必须全部小写，
 * 这样就可以排除掉各种类型的常量、变量名等标识符。
 * @param code
 * @return {number}
 */
export function calculateCodeSize(code) {
  if (code.trim() === "") return 0;
  // 去掉所有注释
  code = code.replace(/(\/\*([\s\S]*?)\*\/|\/\/(.*)$|#(.*$)|\/{2}(.*)$)/gm, '');

  // 去掉所有空格、制表符、换行符等
  code = code.replace(/\s/g, '');

  // 统计各种字符的数量
  const charCount = {};
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (charCount[char]) {
      charCount[char]++;
    } else {
      charCount[char] = 1;
    }
  }

  // 计算代码大小
  const totalCharCount = Object.values(charCount).reduce((a, b) => a + b);
  const totalKeywordCount = Object.keys(charCount).filter(
      keyword => keyword.match(/^[a-zA-Z]+$/) && keyword.toLowerCase() === keyword
  ).length;
  const totalSymbolCount = totalCharCount - totalKeywordCount;

  return totalKeywordCount + totalSymbolCount;
}


/// 现在又有了新的要求，由于我们尽量让每一个变量，每一个关键字 都代表相同的大小
/// 最终的结果大小和所有符号的数量以及所有变量、关键字的数量有关。

/**
 * 数字转大写字母
 * 0 => A  1 => B
 * @param n {Number}
 * @return {string}
 */
export function numberToAlpha(n) {
  return String.fromCharCode(65 + n)
}

