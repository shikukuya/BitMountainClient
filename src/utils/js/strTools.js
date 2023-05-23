/**
 * 字符串拼接
 * 将两个字符串拼接起来，先按照字典序，
 * 字典序小的在前面。
 * by littlefean
 */
import banKeywords from "./banKeywords";


export function connectStr(aStr, bStr) {
  if (aStr < bStr) {
    return aStr + bStr;
  } else {
    return bStr + aStr;
  }
}

/**
 * 拼接字符串数组
 * @param arr
 */
export function sortAndConcatenateStrings(arr) {
  // 使用Array.sort()方法按字典序升序排列字符串数组
  const sortedArr = arr.sort();
  // 使用Array.join()方法将排好序的字符串数组拼接成一个字符串
  return sortedArr.join('');
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
  const totalCharCount = Object.keys(charCount).length === 0 ? 0 : Object.values(charCount).reduce((a, b) => a + b);
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


class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  startsWith(prefix) {
    let node = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix.charAt(i);
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return true;
  }
}

/**
 * 用于用户输入内容中的字符串包涵关键词的检测
 * @param string {String}
 * @param keywordList {Array[]}
 * @return {boolean}
 */
export function isStringIncludeKeywords(string, keywordList) {
  const trie = new Trie();
  for (const keyword of keywordList) {
    trie.insert(keyword);
  }
  let i = 0;
  while (i < string.length) {
    let j = i;
    let node = trie.root;
    while (j < string.length && node.children[string.charAt(j)]) {
      node = node.children[string.charAt(j)];
      if (node.isEndOfWord) {
        return true;
      }
      j++;
    }
    i++;
  }
  return false;
}

// function encryptStrList(strArray) {
//   const result = [];
//   for (let i = 0; i < strArray.length; i++) {
//     let encrypted = '';
//     for (let j = 0; j < strArray[i].length; j++) {
//       encrypted += String.fromCharCode(strArray[i].charCodeAt(j) + 1);
//     }
//     result.push(encrypted);
//   }
//   return result;
// }

function decryptStrList(strArray) {
  const result = [];
  for (let i = 0; i < strArray.length; i++) {
    let decrypted = '';
    for (let j = 0; j < strArray[i].length; j++) {
      decrypted += String.fromCharCode(strArray[i].charCodeAt(j) - 1);
    }
    result.push(decrypted);
  }
  return result;
}


const PoliticalSensitiveList = decryptStrList(banKeywords);

/**
 * 检测一个字符串中是否含有zz敏感内容
 * @param string
 * @return {boolean}
 */
export function isPoliticalSensitive(string) {
  return isStringIncludeKeywords(string, PoliticalSensitiveList);
}

/**
 * 返回两个字符串的编辑距离
 * @param s1 {String}
 * @param s2 {String}
 * @return {Number}
 * @constructor
 */
export function strDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  // 创建一个二维数组，用于记录动态规划的过程
  const dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));

  // 初始化边界条件
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // 动态规划
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  // 返回最终结果
  return dp[m][n];
}

/**
 * 代码消除注释函数，此函数会让代码无法执行发生错误
 * 仅用于判断编辑距离之类的操作
 * @param code {String}
 * @return {String}
 */
export function compressCode(code) {
  // 删除C语言风格注释
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  // 删除Python风格注释
  code = code.replace(/#[^\n]*\n/g, '');
  // 删除所有空格、分号和换行符
  code = code.replace(/\s|;|\n/g, '');
  return code;
}

/**
 * 获取当前代码占了多少行
 * @param codeString {String}
 * @return  {Number}
 */
export function getNumberOfLines(codeString) {
  const lines = codeString.split('\n');
  return lines.length;
}
