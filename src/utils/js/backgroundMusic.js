/**
 * 管理背景音乐
 * by littlefean
 */


import PubSub from "pubsub-js";

let bgmSrcDic = {
  login: "http://littlefean.gitee.io/bit-mountain-music/music/login.mp3",
  main: "http://littlefean.gitee.io/bit-mountain-music/music/mainTheme.mp3",
  ticTacToe: "http://littlefean.gitee.io/bit-mountain-music/music/ticTacToc.mp3",
  gobang: "http://littlefean.gitee.io/bit-mountain-music/music/gobang.mp3",
  bigStone: "http://littlefean.gitee.io/bit-mountain-music/music/mechanicalAutoChess.mp3",
  typeWrite: "http://littlefean.gitee.io/bit-mountain-music/music/typeWritting.mp3",
}
// 当前正在播放的是哪个背景音乐
let currentBgm = "login";
let currentVolume = 1;


/**
 * 开始播放背景音乐
 */
export function playBackgroundMusic() {
  currentVolume = 1;
  PubSub.publish("背景音乐状态改变", {
    "volume": currentVolume,
    "src": bgmSrcDic[currentBgm],
  });
}

/**
 * 停止播放背景音乐
 */
export function pauseBackgroundMusic() {
  currentVolume = 0;
  PubSub.publish("背景音乐状态改变", {
    "volume": currentVolume,
    "src": bgmSrcDic[currentBgm],
  });
}

/**
 * 切换背景音乐
 * @param str
 */
export function changeBackgroundMusic(str) {
  currentBgm = str;
  PubSub.publish("背景音乐状态改变", {
    "volume": currentVolume,
    "src": bgmSrcDic[currentBgm],
  });

}
