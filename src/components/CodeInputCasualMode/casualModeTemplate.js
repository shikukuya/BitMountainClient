/**
 * 娱乐模式的所有代码模板
 * by littlefean
 */
const _ticTacToeCode = `// @ts-check
export default {
  /**
   * 井字棋的 AI 行为函数简单示例，你可以将这个函数改的更厉害
   * @param {number[][]} board 棋盘 其中0表示空地
   * @returns {object} 例如 {x: 1, y: 2} 表示第三行第二列 注意坐标是从0开始的
   */
  action: function (board) {
    if (board[1][1] === this.tempSymbol) {
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
   * 你可以在action函数中通过 this.randint(?, ?) 来调用
   * 当然这个函数你不喜欢可以直接删掉
   * @param {number} a 整数
   * @param {number} b 整数
   */
  randint: (a, b) => Math.floor(Math.random() * (b - a) + a),
  /**
   * 填写您的用户名，不填也没关系，提交后系统会自动帮你改
   * 这里只是提醒您 this.userName 已经被占用
   */
  userName: "yorUserName",
}
`;

const _goBangCode = `// @ts-check
export default {
  /**
   * 五子棋 AI 行为函数简单示例，你可以将这个函数改的更厉害
   * @param {number[][]} board 棋盘 此五子棋棋盘的大小为15x15 其中0表示空地
   * @returns {object} 例如 {x: 1, y: 2} 表示第三行第二列 注意坐标是从0开始的
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

  /**
   * 获取一个随机的空的位置并返回
   * @param {number[][]} board 棋盘 此五子棋棋盘的大小为15x15 其中0表示空地
   */
  getRandomLoc: function (board) {
    let tempLocList = [];
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        if (board[y][x] === this.tempSymbol) {
          tempLocList.push({"x": x, "y": y});
        }
      }
    }
    return tempLocList[this.randint(0, tempLocList.length)];
  },
  /**
   * 在范围 a~b，但不包括b 上随机整数的函数
   * 你可以在action函数中通过 this.randint(?, ?) 来调用
   * 当然这个函数你不喜欢可以直接删掉
   * @param {number} a 整数
   * @param {number} b 整数
   */
  randint: (a, b) => Math.floor(Math.random() * (b - a) + a),
  /**
   * 填写您的用户名，不填也没关系，提交后系统会自动帮你改
   * 这里只是提醒您 this.userName 已经被占用
   */
  userName: "yorUserName",
}
`;

const casualModeTemplateObj = {
  ticTacToe: _ticTacToeCode,
  gobang: _goBangCode,
  mechanicalAutoChess: ``,
}


export default casualModeTemplateObj;
