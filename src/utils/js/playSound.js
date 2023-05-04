import USER_DATA from "../../globalData/userData";

/**
 * 播放音效的封装
 * by littlefean
 */

export function winSound() {
  if (USER_DATA.isSoundEnabled) {
    let sound = new Audio(require(`../sound/战斗胜利.mp3`));
    sound.volume = 0.4;
    sound.play().then(() => {
      sound = null;
    });
  }
}

export function louseSound() {
  if (USER_DATA.isSoundEnabled) {
    let sound = new Audio(require(`../sound/战斗失败.mp3`));
    sound.volume = 0.4;
    sound.play().then(() => {
      sound = null;
    });
  }
}

export function startSound() {
  if (USER_DATA.isSoundEnabled) {
    let sound = new Audio(require(`../sound/战斗开始.mp3`));
    sound.volume = 0.4;
    sound.play().then(() => {
      sound = null;
    });
  }
}

export function startGameSound() {
  if (USER_DATA.isSoundEnabled) {
    let sound = new Audio(require(`../sound/饱满和弦.mp3`));
    sound.volume = 0.4;
    sound.play().then(() => {
      sound = null;
    });
  }
}

export function putPieceSound() {
  if (USER_DATA.isSoundEnabled) {
    let sound = new Audio(require(`../sound/放置棋子.mp3`));
    sound.volume = 0.4;
    sound.play().then(() => {
      sound = null;
    });
  }
}
