import React, {Component} from 'react';
import "./index.css";
import Editor, {DiffEditor, useMonaco, loader} from "@monaco-editor/react";
import GobangBoard from "../../components/GobangBoard";
import GobangPlayerItem from "../../components/GobangPlayerItem";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";
import getUrl from "../../utils/js/getUrl";
import GobangFightItem from "../../components/GobangFightItem";
import PubSub from "pubsub-js";
import {calculateCodeSize, isPoliticalSensitive} from "../../utils/js/strTools";
import {changeBackgroundMusic} from "../../utils/js/backgroundMusic";
import myAlert from "../../utils/js/alertMassage";

const EgCode = `// @ts-check
/**
 * @param {number[][]} board 19x19棋盘 其中0表示空地
 * @param {number} my 自己的棋子（非0数字）
 * @param {number} opponent 对方的棋子（非0数字）
 * @returns {number[]} 例如 [2,1] 表示第三行第二列
 */
(board, my, opponent) => {
  // 在范围 [a, b) 上随机整数
  const randint = (a, b) => {
     return Math.floor(Math.random() * (b - a) + a);
   }
  // 返回[y,x]下标表示你要落子的位置
  // 例如返回[2, 1] 表示
  // [0, 0, 0 ...],
  // [0, 0, 0 ...],
  // [0, x, 0 ...], 你将在x位置下。下标从0开始
  // 如果你返回了错误答案或者越界了
  // 或者该位置已经有棋子了
  // 那么系统会帮你随机下到一个空地上
  return [randint(0, 19), randint(0, 19)];
}
`;

class Gobang extends Component {
  constructor(props) {
    super(props);
    this.codeNameEle = React.createRef();
    this.state = {
      userCode: EgCode,
      userList: [],  // [{},{}, ...]
      fightResult: {
        firstResList: [],
        secondResList: [],
      }
    }
  }

  render() {
    return (
        <div className="gobangPage">
          <div className="left">
            <GobangBoard/>
            <div className="matchList">
              <h2>对局列表</h2>
              <p>我方执黑先手</p>
              {
                this.state.fightResult.firstResList.map((resObj, i) => {
                  return <GobangFightItem key={i} {...resObj} title={`先手第${i + 1}场`}/>
                })
              }
              <p>我方执白后手</p>
              {
                this.state.fightResult.secondResList.map((resObj, i) => {
                  return <GobangFightItem key={i} {...resObj} title={`后手第${i + 1}场`}/>
                })
              }
            </div>
            <div className="bottomArea">
              {
                this.state.userList.map(obj => {
                  return <GobangPlayerItem {...obj} key={obj.name}/>
                })
              }
            </div>
          </div>
          <div className="right">
            <Editor
                height="80vh"
                value={EgCode}
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onChange={this.handleOnChange}
                theme="vs-dark"
            />
            <input type="text"
                   ref={this.codeNameEle}
                   maxLength={5}
                   className="codeNameInput"
                   placeholder="给这份代码起个霸气的名字"/>
            <button
                className="submitBtn"
                onClick={this.handleSubmit}>提交代码到榜上
            </button>

          </div>
        </div>
    );
  }

  componentDidMount() {
    USER_DATA.gobangCurrentCode = this.state.userCode;

    fetch(getUrl("getGobangUserList"), {
      method: 'GET',
    }).then(
        res => res.json()
    ).then(
        data => {
          this.setState({userList: data});
        }
    );

    SOCKET_OBJ.on("前端监听五子棋榜上变化", res => {
      const data = (res);
      this.setState({userList: data["array"]});
    });

    // pubsub监听
    this.token1 = PubSub.subscribe("五子棋界面更新挑战信息", (_, data) => {
      this.setState(data);
    });
    changeBackgroundMusic("gobang");
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
    changeBackgroundMusic("main");
  }

  handleOnChange = (value, event) => {
    this.setState({userCode: value});
    USER_DATA.gobangCurrentCode = value;
  }

  handleSubmit = () => {
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
    console.log(codeName, "准备发送");
    SOCKET_OBJ.emit("后端处理用户提交五子棋代码", {
      name: USER_DATA.name,
      score: USER_DATA.score,
      headSculpture: USER_DATA.headSculpture,
      code: this.state.userCode,
      codeName: codeName,
      codeSize: calculateCodeSize(this.state.userCode),
    });

  }
}

export default Gobang;
