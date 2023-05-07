/**
 *
 * by littlefean
 */

import myAlert from '../utils/js/alertMassage';
import Array2d from '../utils/js/array2d';
import { choice, randint } from '../utils/js/random';
import Ground2D from '../utils/js/terrain-generation';

/**
 *
 * @param code1 先手代码
 * @param code2 后手代码
 * @return 历史记录列表 [{}{}{}...] 以及地图变化历史三维数组打包成一个对象
 * 列表中前两个元素是位置对象，{x: ?, y: ?}，用来表示两个玩家选择的出生点
 * 其他剩余的对象是每个玩家机器人作出的决策结果，{action: "", direction: ""}
 */
export function compact(code1, code2) {
  try {
    var f1 = eval(code1);
  } catch (e) {
    myAlert('解析你的代码时报错了！' + e);
  }
  try {
    var f2 = eval(code2);
  } catch (e) {
    myAlert('解析对方的代码时报错了！' + e);
  }
  const board = new Array2d(19, 19);
  let ground = new Ground2D(randint(0, 123456789123), 0, [
    { diff: 3, loud: 5 },
    { diff: 2, loud: 5 },
  ]);

  for (let y = 0; y < 19; y++) {
    for (let x = 0; x < 19; x++) {
      let h = ground.getHeight(x, y);
      console.log('height:', h);
      if (h > 0) {
        board.set(x, y, 1);
      }
    }
  }

  let actionHistory = [];
  let worldHistory = [];
  let robot1LocHistory = [{ x: -10, y: -10 }];
  let robot2LocHistory = [{ x: -10, y: -10 }];

  let step = 0;

  // 开始选择出生点
  try {
    var loc1Obj = execUserCode(board.arr, f1, true, true, null, null);
  } catch (e) {
    myAlert('运行你的代码时报错了！' + e);
  }
  actionHistory.push(JSON.parse(JSON.stringify(loc1Obj)));
  board.set(loc1Obj.x, loc1Obj.y, 2);
  worldHistory.push(board.getSnapshot());
  robot1LocHistory[0] = JSON.parse(JSON.stringify(loc1Obj));
  robot1LocHistory.push(JSON.parse(JSON.stringify(loc1Obj)));

  try {
    var loc2Obj = execUserCode(board.arr, f2, false, true, null, null);
  } catch (e) {
    myAlert('运行对方的代码时报错了！' + e);
  }
  actionHistory.push(JSON.parse(JSON.stringify(loc2Obj)));
  board.set(loc2Obj.x, loc2Obj.y, 3);
  worldHistory.push(board.getSnapshot());
  robot2LocHistory.push(JSON.parse(JSON.stringify(loc2Obj)));

  // 开始博弈
  while (true) {
    if (step >= 360) {
      break;
    }
    // 处理用户行为
    if (step % 2 === 0) {
      // 先手
      let user1Res = execUserCode(
        board.arr,
        f1,
        true,
        false,
        getView(board.arr, loc1Obj),
        loc1Obj
      );
      actionHistory.push(user1Res);
      const d = user1Res['direction'];

      if (user1Res['action'] === 'move') {
        dealUserMove(board.arr, loc1Obj, d);
        worldHistory.push(board.getSnapshot());
      } else if (user1Res['action'] === 'put') {
        dealUserPut(board.arr, loc1Obj, d, 4);
        worldHistory.push(board.getSnapshot());
      } else if (user1Res['action'] === 'attack') {
        let isGameEnd = dealUserAttack(board.arr, loc1Obj, d);
        worldHistory.push(board.getSnapshot());
        if (isGameEnd) {
          // 添加移动历史信息
          robot1LocHistory.push(JSON.parse(JSON.stringify(loc1Obj)));
          robot2LocHistory.push(JSON.parse(JSON.stringify(loc2Obj)));
          break;
        }
      }
    } else {
      // 后手
      let user2Res = execUserCode(
        board.arr,
        f2,
        false,
        false,
        getView(board.arr, loc2Obj),
        loc2Obj
      );
      actionHistory.push(user2Res);
      const d = user2Res['direction'];

      if (user2Res['action'] === 'move') {
        dealUserMove(board.arr, loc2Obj, d);
        worldHistory.push(board.getSnapshot());
      } else if (user2Res['action'] === 'put') {
        dealUserPut(board.arr, loc2Obj, d, 5);
        worldHistory.push(board.getSnapshot());
      } else if (user2Res['action'] === 'attack') {
        let isGameEnd = dealUserAttack(board.arr, loc2Obj, d);
        worldHistory.push(board.getSnapshot());
        if (isGameEnd) {
          // 添加移动历史信息
          robot1LocHistory.push(JSON.parse(JSON.stringify(loc1Obj)));
          robot2LocHistory.push(JSON.parse(JSON.stringify(loc2Obj)));
          break;
        }
      }
    }
    // 添加移动历史信息
    robot1LocHistory.push(JSON.parse(JSON.stringify(loc1Obj)));
    robot2LocHistory.push(JSON.parse(JSON.stringify(loc2Obj)));
    step++;
  }
  return {
    actionHistory: actionHistory,
    worldHistory: worldHistory,
    robot1LocHistory: robot1LocHistory,
    robot2LocHistory: robot2LocHistory,
  }; // 前两个元素是一个位置对象.
}

/**
 * 玩家在世界中进行攻击操作，该攻击操作会使得玩家扔出一个炸弹
 * 炸弹爆炸使得玩家当前朝向方向的前方3*3区域内全部变为空气
 * 即对应矩阵中的值抹成0
 * 例如
 * 0 1 0 1 1
 * 2 1 1 1 1
 * 0 1 1 1 1
 * 1 1 1 0 0
 * 其中2表示玩家，1表示石头，此时玩家朝右
 * 当玩家进行攻击时，会把石头炸没，变成这样
 * 0 0 0 0 1
 * 2 0 0 0 1
 * 0 0 0 0 1
 * 1 1 1 0 0
 * 注意，如果爆炸范围内有值为2，或者值为3，表示把另一个玩家给炸死了，导致游戏结束
 * 这时会返回true。如果没有导致游戏结束，返回false。
 *
 * @param wordMatrix {Array} 二维数组表示世界，元素全是整数，其中0表示空气
 * @param userLocObj {Object} 位置对象，具有x属性和y属性，属性值为非负整数
 * @param direction {String} "up", "down", "left", "right"
 */
function dealUserAttack(wordMatrix, userLocObj, direction) {
  const row = userLocObj.y;
  const col = userLocObj.x;
  let targetRow = row;
  let targetCol = col;
  switch (direction) {
    case 'up':
      targetRow = row - 2;
      break;
    case 'down':
      targetRow = row + 2;
      break;
    case 'left':
      targetCol = col - 2;
      break;
    case 'right':
      targetCol = col + 2;
      break;
  }

  let flag = false; // 是否炸死了另一个玩家

  // 修改地图 -1 0 1  ===>  0 1 2
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const rowIdx = targetRow + dy;
      const colIdx = targetCol + dx;

      if (
        rowIdx >= 0 &&
        rowIdx < wordMatrix.length &&
        colIdx >= 0 &&
        colIdx < wordMatrix[0].length
      ) {
        const deleteValue = wordMatrix[rowIdx][colIdx]; // 要被炸碎的东西ID
        if (deleteValue === 2 || deleteValue === 3) {
          flag = true;
        }
        wordMatrix[rowIdx][colIdx] = 0;
      }
    }
  }
  return flag; // 没有导致游戏结束，返回false
}

/**
 * 玩家在世界中朝着一个方向，在自身的旁边放置一个东西
 * 改函数可能会对 wordMatrix 内容造成修改
 * 如果玩家朝向的位置是一个值为0的空气方块，才能在这个位置上放置物品。
 *
 * @param wordMatrix {Array} 二维数组表示世界，元素全是整数，其中0表示空气
 * @param userLocObj {Object} 位置对象，具有x属性和y属性，属性值为非负整数
 * @param direction {String} "up", "down", "left", "right"
 * @param putValue {Number} 放置的物品ID
 */
function dealUserPut(wordMatrix, userLocObj, direction, putValue) {
  const x = userLocObj.x;
  const y = userLocObj.y;
  let nextX = x;
  let nextY = y;
  switch (direction) {
    case 'up':
      nextY--;
      break;
    case 'down':
      nextY++;
      break;
    case 'left':
      nextX--;
      break;
    case 'right':
      nextX++;
      break;
    default:
      break;
  }
  if (
    nextX >= 0 &&
    nextX < wordMatrix[0].length &&
    nextY >= 0 &&
    nextY < wordMatrix.length
  ) {
    if (wordMatrix[nextY][nextX] === 0) {
      wordMatrix[nextY][nextX] = putValue;
    }
  }
}

/**
 * 请你完成以下函数
 * 该函数处理玩家在世界中的移动，可能会修改wordMatrix二维数组
 *
 * worldMatrix是一个二维数组，矩阵，获取(x,y)位置上的元素用
 * worldMatrix[y][x]来获取
 * worldMatrix.length 表示矩阵的高度
 * worldMatrix[0].length 表示矩阵的宽度
 *
 * userLocObj 表示一个位置对象，有属性x和y，
 * 例如 {x: 5, y: 0} 表示一个合法的对象。
 * {x: 0, y: 0} 则表示最左上角的位置
 *
 * 该函数执行后，会获取到 世界数组中userLocObj位置上的表示玩家的元素，并向参数direction方向移动一个格子。
 * 只有在那个位置上是表示空气的0值才能进行移动
 * 如果是其他数字或者导致越界就不会移动。
 * 移动就是修改二维数组wordMatrix
 *
 * @param wordMatrix {Array} 二维数组表示世界，元素全是整数，其中0表示空气
 * @param userLocObj {Object} 位置对象，具有x属性和y属性，属性值为非负整数
 * @param direction {String} 表示用户即将移动的方向字符串，有四种可能的值，"up", "down", "left", "right"
 * @return {Boolean} 是否移动成功
 */
function dealUserMove(wordMatrix, userLocObj, direction) {
  const x = userLocObj.x;
  const y = userLocObj.y;

  // 判断移动方向
  switch (direction) {
    case 'up':
      // 判断是否越界或者目标位置不是空气
      if (y > 0 && wordMatrix[y - 1][x] === 0) {
        // 在目标位置放置玩家，并清空原位置
        wordMatrix[y - 1][x] = wordMatrix[y][x];
        wordMatrix[y][x] = 0;
        // 更新玩家位置
        userLocObj.y = y - 1;
        return true;
      }
      return false;
    case 'down':
      if (y < wordMatrix.length - 1 && wordMatrix[y + 1][x] === 0) {
        wordMatrix[y + 1][x] = wordMatrix[y][x];
        wordMatrix[y][x] = 0;
        userLocObj.y = y + 1;
        return true;
      }
      return false;
    case 'left':
      if (x > 0 && wordMatrix[y][x - 1] === 0) {
        wordMatrix[y][x - 1] = wordMatrix[y][x];
        wordMatrix[y][x] = 0;
        userLocObj.x = x - 1;
        return true;
      }
      return false;
    case 'right':
      if (x < wordMatrix[0].length - 1 && wordMatrix[y][x + 1] === 0) {
        wordMatrix[y][x + 1] = wordMatrix[y][x];
        wordMatrix[y][x] = 0;
        userLocObj.x = x + 1;
        return true;
      }
      return false;
    default:
      return false;
  }
}

/**
 * 请你完成以下函数，worldMatrix是一个二维数组，矩阵，获取(x,y)位置上的元素用
 * worldMatrix[y][x]来获取
 * worldMatrix.length 表示矩阵的高度
 * worldMatrix[0].length 表示矩阵的宽度
 * locObj表示一个位置对象，有属性x和y，
 * 例如 {x: 5, y: 0} 表示一个合法的对象。
 * {x: 0, y: 0} 则表示最左上角的位置
 * 该函数会返回以locObj为中心点，半径向外扩展2格，形成一个5*5的视野矩阵
 * 视野超出二维数组的部分填充 -1 来表示
 */
function getView(worldMatrix, locObj) {
  const view = [];
  for (let i = locObj.y - 2; i <= locObj.y + 2; i++) {
    const row = [];
    for (let j = locObj.x - 2; j <= locObj.x + 2; j++) {
      if (
        i >= 0 &&
        i < worldMatrix.length &&
        j >= 0 &&
        j < worldMatrix[0].length
      ) {
        row.push(worldMatrix[i][j]);
      } else {
        row.push(-1);
      }
    }
    view.push(row);
  }
  return view;
}

/**
 * 执行用户的代码
 * @param board
 * @param func  用户代码所解析成的函数
 * @param isFirst
 * @param isBegin
 * @param view
 * @param userLoc
 */
function execUserCode(board, func, isFirst, isBegin, view, userLoc) {
  let matrix = JSON.parse(JSON.stringify(board));
  userLoc = JSON.parse(JSON.stringify(userLoc));
  let res = func(
    matrix,
    isFirst,
    isBegin,
    view,
    userLoc,
    (a, b) => randint(a, b),
    (arr) => choice(arr)
  );
  if (isBegin) {
    // 开局选出生点
    if (checkSpawnPoint(board, res)) {
      // 正常
      return res;
    } else {
      return getRandomSpawnPoint(board);
    }
  } else {
    if (isUserActionValid(res)) {
      return res;
    } else {
      return {
        action: choice(['move', 'put', 'attack']),
        direction: choice(['up', 'down', 'left', 'right']),
      };
    }
  }
}

// 随机返回一个空气位置
function getRandomSpawnPoint(world) {
  const airBlocks = []; // 用来存储所有空气方块的位置对象
  // 遍历二维数组，找到所有空气方块
  for (let i = 0; i < world.length; i++) {
    for (let j = 0; j < world[i].length; j++) {
      if (world[i][j] === 0) {
        airBlocks.push({ x: j, y: i }); // 将空气方块的位置对象存储到数组中
      }
    }
  }
  // 从数组中随机选取一个元素作为随机出生点
  const randomIndex = Math.floor(Math.random() * airBlocks.length);
  return airBlocks[randomIndex];
}

// 用户行为合法性检测
function isUserActionValid(userAction) {
  function isActionValid(action) {
    return action === 'move' || action === 'put' || action === 'attack';
  }

  function isDirectionValid(direction) {
    return (
      direction === 'up' ||
      direction === 'down' ||
      direction === 'left' ||
      direction === 'right'
    );
  }

  if (!userAction || typeof userAction !== 'object') {
    return false;
  }
  const { action, direction } = userAction;
  return !(!isActionValid(action) || !isDirectionValid(direction));
}

// 位置对象合法性检测
function checkSpawnPoint(world, position) {
  if (!position || typeof position !== 'object') {
    return false;
  }
  if (!('x' in position) || !('y' in position)) {
    return false;
  }
  const { x, y } = position;
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
    return false;
  }
  return !(!world[y] || !world[y][x] || world[y][x] !== 0);
}
