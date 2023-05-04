/**
 * 管理背景音乐
 * by littlefean
 */


/**
 * 背景音乐列表
 */
let bgmDic = {
  login: new Audio(require(`../music/比特山登录前界面.mp3`)),
  main: new Audio(require(`../music/比特山主界面.mp3`)),
  ticTacToe: new Audio(require(`../music/比特山井字棋对决.mp3`)),
  gobang: new Audio(require(`../music/比特山五子棋对决.mp3`)),
  bigStone: new Audio(require(`../music/巨石行棋.mp3`)),
  typeWrite: new Audio(require(`../music/比特山打字对决.mp3`)),
}
// 当前正在播放的是哪个背景音乐
let currentBgm = "login";

{
  // 初始化
  // 所有音乐无限循环，音量为0
  for (let key in bgmDic) {
    if (bgmDic.hasOwnProperty(key)) {
      bgmDic[key].loop = true;
      bgmDic[key].volume = 0;
    }
  }
  // 当前播放的音乐音量为1
  bgmDic[currentBgm].volume = 1;
}

export function playBackgroundMusic() {
  for (let key in bgmDic) {
    if (bgmDic.hasOwnProperty(key)) {
      bgmDic[key].play();
    }
  }
}

export function pauseBackgroundMusic() {
  for (let key in bgmDic) {
    if (bgmDic.hasOwnProperty(key)) {
      bgmDic[key].pause();
    }
  }
}

export function changeBackgroundMusic(str) {
  bgmDic[currentBgm].volume = 0;
  currentBgm = str;
  bgmDic[currentBgm].volume = 1;
}
