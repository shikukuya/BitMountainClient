import React, {Component} from 'react';
import './index.css';
import Editor from '@monaco-editor/react';
import USER_DATA from '../../globalData/userData';
import SOCKET_OBJ from '../../globalData/socketObject';
import {calculateCodeSize, isPoliticalSensitive} from '../../utils/js/strTools';
import myAlert from '../../utils/js/alertMassage';
import AutoChessBoard from '../../components/MechanicalAutoChessBoard';
import MechanicalAutoChessPlayer from '../../components/MechanicalAutoChessPlayer';
import getUrl from '../../utils/js/getUrl';
import {changeBackgroundMusic} from '../../utils/js/backgroundMusic';
import {sha3_256} from 'js-sha3';

let _code = localStorage.getItem(sha3_256(`${USER_DATA.name}机械自走棋代码`));

let initCode = `// @ts-check
/**
 * @param {number[][]} world 19*19的二维数组
 * @param {boolean} isFirst 自己是否是先手
 * @param {boolean} isBegin 当前是否是开局选出生点的阶段
 * @param {number[][]} view 5*5的视野矩阵
 * \`\`\`plain
 * -1: 超出棋盘的禁区
 * 0: 棋盘上的空地
 * 1: 棋盘上的石头、障碍物
 * 2: 先手方机器人的身体
 * 3: 后手方机器人的身体
 * 4: 先手方机器人放置的黑色棋子
 * 5: 后手方机器人放置的白色棋子
 * 最中心的位置一定为2或3
 * \`\`\`
 * @param {{ x: number, y: number }} curLoc 自己当前的位置
 * @param { (a: number, b: number) => number } randint 在a和b之间生成随机整数
 * @param { <E>(arr: E[]) => E } choice 在数组中随机选出一个元素
 * @returns {{
    action: "move" | "put" | "attack",
    direction: "up" | "down" | "left" | "right",
  }}
 */
(world, isFirst, isBegin, view, curLoc, randint, choice) => {
  if (isBegin) {
    // 开局的出生点选择策略
    return { x: randint(0, 19), y: randint(0, 19) };
  }
  // 对手所表示的数字
  const OPPONENT = isFirst ? 3 : 2;
  // 对手所放的方块
  const OPPONENT_PIECE = isFirst ? 5 : 4;
  const AIR = 0;  // 空气方块
  const STONE = 1;  // 岩石方块
  const MY_PIECE = isFirst ? 4 : 5;  // 自己放置的方块

  // 先看视野里有没有敌人
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (view[y][x] === OPPONENT) {
        // 发现敌人，但如果敌人在自己视野里的最角落，那么打不到，要追
        if (x === 0 && y === 0) {
          // 敌人在左上角，往左上角走
          if (Math.random() < 0.5) return { action: "move", direction: "left" };
          else return { action: "move", direction: "up" };
        } else if (x === 0 && y === 4) {
          // 左下角
          if (Math.random() < 0.5) return { action: "move", direction: "left" };
          else return { action: "move", direction: "down" };
        } else if (x === 4 && y === 0) {
          // 右上角
          if (Math.random() < 0.5) return { action: "move", direction: "right" };
          else return { action: "move", direction: "up" };
        } else if (x === 4 && y === 4) {
          // 右下角
          if (Math.random() < 0.5) return { action: "move", direction: "right" };
          else return { action: "move", direction: "down" };
        } else {
          // 可以直接把对手炸死
          if (y < 2) {
            return { action: "attack", direction: "up" };
          } else if (y >= 3) {
            return { action: "attack", direction: "down" };
          } else if (x < 2) {
            return { action: "attack", direction: "left" };
          } else {
            return { action: "attack", direction: "right" };
          }
        }
      }
    }
  }
  const upId = view[1][2];
  const leftId = view[2][1];
  const rightId = view[2][3];
  const downId = view[3][2];

  // 一开始先跑到y = 1的地方上去
  if (curLoc.y > 1) {
    if (upId === STONE) {
      return { action: "attack", direction: "up" };
    } else if (upId === AIR) {
      return { action: "move", direction: "up" };
    }
  } else if (curLoc.y === 1) {
    // 到了
  }
  
  return {
    action: choice(["move", "put", "attack"]),
    direction: choice(["up", "down", "left", "right"]),
  };
}

`;
if (_code) {
  initCode = _code;
}

class MechanicalAutoChess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCode: initCode,
      userList: [],
    };

    this.codeNameEle = React.createRef();
  }

  render() {
    return (
        <div className="MechanicalAutoChessPage">
          <div className="left">
            <div className="leftTop">
              <AutoChessBoard/>
              {/*<div className="dataPanel">*/}
              {/*  <div className="line">*/}
              {/*    先手棋子数量 <span>12</span>*/}
              {/*  </div>*/}
              {/*  <div className="line">*/}
              {/*    后手棋子数量 <span>12</span>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            <div className="leftBottom">
              {this.state.userList.map((userObj) => {
                return (
                    <MechanicalAutoChessPlayer {...userObj} key={userObj.name}/>
                );
              })}
            </div>
          </div>
          <div className="right">
            <Editor
                height="80vh"
                value={initCode}
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onChange={this.handleOnChange}
                theme="vs-dark"
            />
            <input
                type="text"
                ref={this.codeNameEle}
                maxLength={5}
                className="codeNameInput"
                placeholder="给这份代码起个霸气的名字"
            />
            <button className="submitBtn" onClick={this.handleSubmit}>
              提交代码到榜上
            </button>
          </div>
        </div>
    );
  }

  componentDidMount() {
    USER_DATA.autoChessCurrentCode = this.state.userCode;

    fetch(getUrl('getAutoChessUserList'), {
      method: 'GET',
    })
        .then((res) => res.json())
        .then((data) => {
          this.setState({userList: data});
        });

    SOCKET_OBJ.on('前端监听机械自走棋榜上变化', (res) => {
      const data = res;
      this.setState({userList: data['array']});
    });

    changeBackgroundMusic('bigStone');
  }

  componentWillUnmount() {
    changeBackgroundMusic('main');
  }

  handleOnChange = (value, event) => {
    this.setState({userCode: value});
    // 缓存本地
    localStorage.setItem(sha3_256(`${USER_DATA.name}机械自走棋代码`), value);
  };

  handleSubmit = () => {
    if (!USER_DATA.isLogin) {
      myAlert('请您先登录');
    }
    if (this.state.userCode.length > 16000) {
      myAlert("代码字符数量不能超过1万6");
      return;
    }
    if (isPoliticalSensitive(this.state.userCode)) {
      myAlert("代码中不要包涵敏感内容");
      return;
    }
    let codeName = this.codeNameEle.current.value;
    if (isPoliticalSensitive(codeName)) {
      myAlert("代码名称中有敏感内容");
      return;
    }
    SOCKET_OBJ.emit('后端处理用户提交机械自走棋代码', {
      name: USER_DATA.name,
      score: USER_DATA.score,
      headSculpture: USER_DATA.headSculpture,
      code: this.state.userCode,
      codeName: codeName,
      codeSize: calculateCodeSize(this.state.userCode),
    });
  };
}

export default MechanicalAutoChess;
