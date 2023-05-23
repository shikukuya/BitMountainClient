/**
 * 模板代码
 * by littlefean
 */

const ticTacToeTemplateCodeStr = `// @ts-check
export default {
  /**
   * AI 行为函数，需要你来改写
   * @param {number[][]} board 棋盘 其中0表示空地
   * @returns {object} 例如 {x: 1, y: 2} 表示第三行第二列
   */
  action: function (board) {
    if (board[1][1] === 0) {
      // 中间位置还是空的，抢占中间位置
      return {x: 1, y: 1};
    } else if (board[1][1] === this.mySymbol) {
      // 中间位置已经被我自己占领了
      return this.getRandomLoc(board);
    } else {
      // 随机一个位置
      return this.getRandomLoc(board);
    }
  },
  tempSymbol: 0,  // 绝对为0，表示棋盘上的空位置
  mySymbol: 1, // 不绝对，有可能会改成2表示后手
  opSymbol: 2, // 不绝对，有可能在运行时系统会帮你改成1表示先手
  /**
   * 此函数意在提醒你 this.printf 已被占用
   * @param {string} str 要打印的字符串
   */
  printf: function (str) {
    // 此处无需填写，此模板意在提醒您使用 this.printf("xxx"); 来打印
    // 千万不要写 console.log() 等其他方式来打印，否则会导致报错
    return this.userName + ": " + str;
  },

  // 获取一个随机的空的位置并返回
  getRandomLoc: function (board) {
    let tempLocList = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (board[y][x] === this.tempSymbol) {
          tempLocList.push({"x": x, "y": y});
        }
      }
    }
    return tempLocList[this.randint(0, tempLocList.length)];
  },
  /**
   * 在范围 a~b，但不包括b 上随机整数的函数
   * @param {number} a 整数
   * @param {number} b 整数
   */
  randint: (a, b) => Math.floor(Math.random() * (b - a) + a),
  /**
   * 填写您的用户名，不填也没关系，提交后系统会自动帮你改
   * 这里只是提醒您 this.userName 已经被占用
   */
  userName: "yorUserName",
}`;
export default ticTacToeTemplateCodeStr;
