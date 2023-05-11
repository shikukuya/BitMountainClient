import SERVER_CONFIG from "./serverConfig";

function shiftString(str, shift) {
  // 将shift变量规范化，保证它在 [0, 26) 之间
  shift = shift % 26;

  // 将字符串转换为小写形式，便于处理
  str = str.toLowerCase();

  // 将字符串转换为字符数组
  let chars = str.split('');

  // 对于每个字符，将它往后移位 shift 个位置
  for (let i = 0; i < chars.length; i++) {
    let charCode = chars[i].charCodeAt(0);
    if (charCode >= 97 && charCode <= 122) {
      charCode = ((charCode - 97 + shift) % 26) + 97;
    }
    chars[i] = String.fromCharCode(charCode);
  }
  // 将字符数组转换回字符串形式，并返回结果
  return chars.join('');
}

/**
 *
 * @param string 不需要加前置斜杠的接口名
 * @return {string}
 * @constructor
 */
export default function getUrl(string) {
  // return `${serverAddress}/${string}`;
  // return `${window.serverAddress}/${string}`;
  return `${SERVER_CONFIG.address}/${string}`;
}
