const USER_DATA = {
  // 当前是否是已经登录的状态
  isLogin: false,
  name: 'xxx',
  id: '155354',
  email: '???',
  headSculpture: 0,
  score: 100, // 当前分数
  maxScore: 100, // 最大分数
  winCount: 0, // 胜利场数
  loseCount: 0, // 失败场数
  matchCount: 0, // 对局总数
  // 上一次登录时间
  lastOnline: '2023年4月25日',

  // 用户是否在玩游戏
  isPlaying: false,

  // 用户是否选择了静音音效
  isSoundEnabled: false,
  // 用户是否选择了静音音乐
  isMusicEnabled: false,

  // 匹配到的题目
  signalQuestionTitle: '还未进行匹配',
  // 匹配到的题目列表
  questionObjList: [
    {
      title: '标题',
      describe: '题目信息',
      inputDescribe: '输入描述信息',
      outputDescribe: '输出描述信息',
      ioEgg: [{in: '123', out: '456'}],
      tips: '提示信息',
      tags: ['数组', '？？'],
    },
  ],
  // 打字模式遇到的题目
  typewriteTitle: '',

  // 1v1 匹配中匹配到的对手的信息
  opponent: {
    userName: '',
    headSculpture: 0,
    score: 100,
    id: ""
  },

  // 是否屏蔽对局中的表情
  isPreventEmoji: false,

  // 更新函数
  updateFromDict: function (dict) {
    for (let key in dict) {
      if (dict.hasOwnProperty(key)) {
        USER_DATA[key] = dict[key];
      }
    }
  },

  // 能力细胞
  abilityList: [
    {title: '数组', ability: 2},
    {title: '图论', ability: 1},
    {title: '二叉树', ability: 1},
    {title: '字符串', ability: 0},
    {title: '数学', ability: 0},
    {title: '数论', ability: 0},
    {title: '概率', ability: 0},
    {title: '几何', ability: 0},
    {title: '位运算', ability: 1},
    {title: '链表', ability: 1},
    {title: '栈', ability: 1},
    {title: '递归', ability: 1},
    {title: '队列', ability: 1},
    {title: '广度优先搜索', ability: 0},
    {title: '深度优先搜索', ability: 0},
    {title: '动态规划', ability: 1},
    {title: '矩阵', ability: 0},
    {title: '二分查找', ability: 1},
    {title: '贪心', ability: 0},
    {title: '排序', ability: 0},
    {title: '双指针', ability: 0},
    {title: '滑动窗口', ability: 1},
    {title: '前缀和', ability: 1},
    {title: '单调栈', ability: 0},
    {title: '最短路', ability: 1},
    {title: '堆', ability: 1},
    {title: '并查集', ability: 0},
    {title: '字典树', ability: 1},
  ],

  gobangCurrentCode: '',
  autoChessCurrentCode: '',

  // 好友列表
  friend: ['WEHFFS', 'WEHFFS', 'WEHFFS', 'WEHFFS', 'WEHFFS'],

  // 好友请求
  friendRequest: [
    {
      id: 'XXEWWF',
      score: 156,
      remarks: '扫地机佛我E家',
    },
    {
      id: 'XXEWWF',
      score: 156,
      remarks: '扫地机佛我E家',
    },
    {
      id: 'XXEWWF',
      score: 156,
      remarks: '扫地机佛我E家',
    },
  ],

  // 历史对局
  history: [
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
  ],
};

const USER_DATA_DEFAULT = {
  // 当前是否是已经登录的状态
  isLogin: false,
  name: 'xxx',
  id: '155354',
  email: '???',
  headSculpture: 0,
  score: 100, // 当前分数
  maxScore: 100, // 最大分数
  winCount: 0, // 胜利场数
  loseCount: 0, // 失败场数
  matchCount: 0, // 对局总数
  // 上一次登录时间
  lastOnline: '2023年4月25日',

  // 用户是否在玩游戏
  isPlaying: false,

  // 用户是否选择了静音音效
  isSoundEnabled: false,
  // 用户是否选择了静音音乐
  isMusicEnabled: false,

  // 匹配到的题目
  signalQuestionTitle: '还未进行匹配',
  // 匹配到的题目列表
  questionObjList: [
    {
      title: '标题',
      describe: '题目信息',
      inputDescribe: '输入描述信息',
      outputDescribe: '输出描述信息',
      ioEgg: [{in: '123', out: '456'}],
      tips: '提示信息',
      tags: ['数组', '？？'],
    },
  ],
  // 打字模式遇到的题目
  typewriteTitle: '',

  // 1v1 匹配中匹配到的对手的信息
  opponent: {
    // 可以类似数据库中的userDetails里的
    name: 'xxx',
    headSculpture: 0,
    score: 100,
    id: "??"
  },

  // 是否屏蔽对局中的表情
  isPreventEmoji: false,

  // 更新函数
  updateFromDict: function (dict) {
    for (let key in dict) {
      USER_DATA[key] = dict[key];
    }
  },

  // 能力细胞
  abilityList: [
    {title: '数组', ability: 2},
    {title: '图论', ability: 1},
    {title: '二叉树', ability: 1},
    {title: '字符串', ability: 0},
    {title: '数学', ability: 0},
    {title: '数论', ability: 0},
    {title: '概率', ability: 0},
    {title: '几何', ability: 0},
    {title: '位运算', ability: 1},
    {title: '链表', ability: 1},
    {title: '栈', ability: 1},
    {title: '递归', ability: 1},
    {title: '队列', ability: 1},
    {title: '广度优先搜索', ability: 0},
    {title: '深度优先搜索', ability: 0},
    {title: '动态规划', ability: 1},
    {title: '矩阵', ability: 0},
    {title: '二分查找', ability: 1},
    {title: '贪心', ability: 0},
    {title: '排序', ability: 0},
    {title: '双指针', ability: 0},
    {title: '滑动窗口', ability: 1},
    {title: '前缀和', ability: 1},
    {title: '单调栈', ability: 0},
    {title: '最短路', ability: 1},
    {title: '堆', ability: 1},
    {title: '并查集', ability: 0},
    {title: '字典树', ability: 1},
  ],

  gobangCurrentCode: '',
  autoChessCurrentCode: '',

  // 好友列表
  friend: ['WEHFFS', 'WEHFFS', 'WEHFFS', 'WEHFFS', 'WEHFFS'],

  // 好友请求
  friendRequest: [
    {
      id: 'XXEWWF',
      score: 156,
      remarks: '扫地机佛我E家',
    },
    {
      id: 'XXEWWF',
      score: 156,
      remarks: '扫地机佛我E家',
    },
    {
      id: 'XXEWWF',
      score: 156,
      remarks: '扫地机佛我E家',
    },
  ],

  // 历史对局
  history: [
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
    {
      userID: 'KLEWJF',
      isWin: false,
      changeScore: -5,
    },
  ],
};

export default USER_DATA;
export {USER_DATA_DEFAULT};
