/**
 * 和用户相关的方法
 * by littlefean
 */

import USER_DATA from "../../globalData/userData";
import getUrl from "./getUrl";

/**
 * 告诉后端自己赢了还是输了
 * @param bool {Boolean}
 * @param moodName {String}
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
  };

  fetch(getUrl("userContestOver"), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(sendData),
  }).then(
      res => res.json()
  ).then(
      res => {
        finishFunc(res);
      }
  );

}
