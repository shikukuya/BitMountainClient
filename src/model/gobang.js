import Array2d from "../utils/js/array2d";
import {choice} from "../utils/js/random";

/**
 * 五子棋对决
 * @param code1 先手代码
 * @param code2 后手代码
 * @return {Object} {
 *    history 历史记录, [{x:?,y:?},{x:?,y:?},{x:?,y:?}....]
 *    result 黑胜、白胜、平局 三种字符串
 *    winnerLoc 五个胜利子的位置组成数组，有可能平局，就是空数组
 * }
 */
export function fight(code1, code2) {
  let f1 = eval(code1);
  let f2 = eval(code2);
  const board = new Array2d(15, 15);
  let res = {
    history: [],  // {x:1,y:1}
    result: "",  // 黑胜、白胜、平局 三种字符串
    winnerLoc: [], // 赢了的五个点的位置 {x,y} 有可能平局，就是空数组
  };
  let step = 0;
  while (true) {
    let tempArr = getTempLocList(board.arr);
    if (tempArr.length === 0) {
      res.result = "平局";
      break;
    }
    let loc, putValue;
    if (step % 2 === 0) {
      putValue = 1;
      loc = execUserCode(board.arr, f1, 1, 2);
    } else {
      putValue = 2;
      loc = execUserCode(board.arr, f2, 2, 1);
    }
    // 开始放置
    board.set(loc.x, loc.y, putValue);
    // 加入历史记录
    res.history.push(loc);
    // 查看输赢
    let winArr = checkWinner(board.arr);
    if (winArr.length !== 0) {
      if (step % 2 === 0) {
        res.result = "黑胜"
      } else {
        res.result = "白胜"
      }
      res.winnerLoc = winArr;
      break;
    }
    step++;
  }
  return res;
}

/**
 * 执行用户下一步棋的方法
 * @param board 二维数组 棋盘
 * @param codeFunc {Function} 用户代码
 * @param execNumber {Number} 执行方的棋子数字
 * @param opNumber {Number}   对手方的棋子数字
 * @return {Object} 例如 {x: 1, y:3}
 */
function execUserCode(board, codeFunc, execNumber, opNumber) {
  let matrix = JSON.parse(JSON.stringify(board));
  let res = codeFunc(matrix, execNumber, opNumber);
  let flag = false;
  if (Array.isArray(res)) {
    if (res.length === 2) {
      let [x, y] = res;
      if (0 <= x && x < 15 && 0 <= y && y < 15) {
        if (matrix[y][x] === 0) {
          flag = true;
        }
      }
    }
  }
  // 检测完毕。
  if (flag) {
    return {x: res[0], y: res[1]};
  } else {
    let tempArr = getTempLocList(matrix);
    return choice(tempArr);
  }
}

// 获取棋盘上所有的空位置点集合
function getTempLocList(board) {
  let res = [];
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      if (board[y][x] === 0) {
        res.push({x: x, y: y});
      }
    }
  }
  return res;
}

/**
 * 检测是否有赢了
 * @param board
 * @return {[{x: *, y: *}]|*[]} 这个列表中若为空表示没有人获得胜利
 * 如果有人赢了，返回一个长度为 5 的数组
 */
function checkWinner(board) {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1]
  ];
  const size = board.length;

  function checkLine(x, y, dx, dy) {
    const color = board[x][y];
    const line = [{x: y, y: x}];
    for (let i = 1; i < 5; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size || board[nx][ny] !== color) {
        return null;
      }
      line.push({y: nx, x: ny});
    }
    return line;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] !== 0) {
        for (const [dx, dy] of directions) {
          const line = checkLine(i, j, dx, dy);
          if (line) {
            return line;
          }
        }
      }
    }
  }

  return [];
}
