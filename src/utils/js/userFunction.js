/**
 * 和用户相关的方法
 * by littlefean
 */

import USER_DATA from "../../globalData/userData";
import getUrl from "./getUrl";

/**
 *
 * @param string {String}
 * @return {string}
 */
function hashString(string) {
  let hashValue = 0;
  for (let i = 0; i < string.length; i++) {
    hashValue += string.charCodeAt(i);
  }
  return String.fromCharCode((hashValue % 20902) + 19968);
}

function getCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 格式化日期和时间为字符串
  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hours}:${minutes}:${seconds}`;

  // 返回格式化后的时间字符串
  return `${dateString}-${timeString}`;
}

console.log(hashString(getCurrentTime()));

/**
 * 发送POST请求 告诉后端自己赢了还是输了
 * @param bool {Boolean} 自己是赢了还是输了
 * @param moodName {String} 模式名称
 * @param finishFunc {Function} 接收后端返回的res json作为唯一参数
 */
export function userContestEnd(bool, moodName, finishFunc) {
  let sendData = {
    // 双方的姓名
    userName: USER_DATA.name,
    opponentName: USER_DATA.opponent.name,
    // 双方当前的分数
    userCurrentScore: USER_DATA.score,
    opponentCurrentScore: USER_DATA.opponent.score,
    opponentHeadSculpture: USER_DATA.opponent.headSculpture,
    mood: moodName,
    isWin: bool,  // 输了
    testCode: (hashString(USER_DATA.name + getCurrentTime())),
  };

  console.log("userContestEnd函数调用了", Date.now(), sendData);
  try {
    fetch(getUrl("userContestOver"), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(sendData),
    }).then(
        res => res.json()
    ).then(
        res => {
          if (res["status"]) {
            finishFunc(res);
          } else {
            console.warn("userContestEnd函数接收到py服务器响应", res["text"]);
          }

        }
    );
  } catch (err) {
    console.log('userContestEnd函数中出现：Fetch Error:', err.message);
  }
}
