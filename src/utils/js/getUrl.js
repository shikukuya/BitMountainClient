import SERVER_CONFIG from "./serverConfig";


/**
 *
 * @param string 不需要加前置斜杠的接口名
 * @return {string}
 * @constructor
 */
export default function getUrl(string) {
  function transformString(str) {
    // 去掉所有的正反斜杠字符，并转换成小写字母
    str = str.replace(/[\\/]/g, '').toLowerCase();

    // 将每个字母向后移动9位，并计算前缀的编码值
    let prefixCode = 0;
    let prefix = "";
    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i);
      if (code >= 97 && code <= 122) { // 只对小写字母进行移位操作
        code = (code - 97 + 9) % 26 + 97;
        prefixCode += code;
      }
      prefix += String.fromCharCode(code);
    }

    // 根据编码值计算后缀名的下标
    let extensions = [".gif", ".html", ".png", ".jpg", ".js", ".css", ".svg"];
    let extIndex = prefixCode % 7;
    let extension = extensions[extIndex];

    // 将前缀和后缀拼接成文件名
    return prefix + extension;
  }

  let newString = transformString(string);
  // return `${serverAddress}/${string}`;
  // return `${window.serverAddress}/${string}`;
  return `${SERVER_CONFIG.address}/${newString}`;
}
