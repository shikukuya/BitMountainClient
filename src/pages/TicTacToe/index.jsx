import React, {Component} from 'react';
import "./index.css";
import Editor, {DiffEditor, useMonaco, loader} from "@monaco-editor/react";
import RankItem from "../../components/RankItem";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";
import myAlert from "../../utils/js/alertMassage";
import getUrl from "../../utils/js/getUrl";
import TicTacToeBoard from "../../components/TicTacToeBoard";
import PubSub from "pubsub-js"
import {changeBackgroundMusic} from "../../utils/js/backgroundMusic";

const EgCode = `// @ts-check
/**
 * 规则说明：请编写井字棋的js代码
 * 以下是一个例子，这个例子实现了随机下棋，你可以改写如下函数内容，让他变得更厉害
 * @param {number[][]} board 棋盘 其中0表示空地
 * @param {number} my 自己的棋子（非0数字）
 * @param {number} opponent 对方的棋子（非0数字）
 * @returns {number[]} 例如 [2,1] 表示第三行第二列
 */
function f(board, my, opponent) {
  /**
   * 在范围 [a, b) 上随机整数
   * @param {number} a 整数
   * @param {number} b 整数
   */
  const randint = (a, b) => {
    return Math.floor(Math.random() * (b - a) + a);
  }
  if (board[1][1] === 0) {
    // 中间位置还没有被抢占
    return [1, 1];  // 抢占中间的位置
  } else if (board[1][1] === my) {
    // 中间位置已经被自己抢占了，自己有优势
    // todo …
  } else if (board[1][1] === opponent) {
    // 中间位置已经被对手抢占了，要悠着点了
    // 这里其实可以写成else。不用else if
    // todo …
  }

  // 返回[y,x]下标表示你要落子的位置
  // 例如返回[2, 1] 表示
  // [0, 0, 0],
  // [0, 0, 0],
  // [0, x, 0], 你将在x位置下。下标从0开始
  // 如果你返回了错误答案或者越界了
  // 或者该位置已经有棋子了
  // 那么系统会帮你随机下到一个空地上
  return [randint(0, 3), randint(0, 3)];
}

`;

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCode: EgCode,
      /**
       * [
       *     {
                name: USER_DATA.name,
                score: USER_DATA.score,
                headSculpture: USER_DATA.headSculpture,
                code: this.state.userCode,
            }
       * ]
       */
      rankList: [],
      resultArray: [],  // 提交代码之后的和其他排行榜上对手打的结果
      isAllowSubmit: true,  // 当前是否允许提交代码
    }
  }

  render() {
    return (
        <div className="TicTacToePage">
          {/*<h2>井字棋脚本</h2>*/}
          <div className="left">
            <div className="topItem">
              <h2>排行榜</h2>
              {
                this.state.rankList.map((curObj, i) => {

                  return <RankItem
                      head={curObj.headSculpture}
                      userName={curObj.name}
                      score={curObj.score}
                      key={curObj.name}
                      rank={i}/>
                })
              }
            </div>
          </div>
          <div className="mid">
            <TicTacToeBoard name={"井字棋盘"} historyList={[]}/>
            <h2>查看对局</h2>
            <div className="ticTacToeMatchList">
              {
                this.state.resultArray.map((curObj, i) => {
                  return (
                      <div className="ticTacToeMatchItem" key={i}>
                        <h3>第{i + 1}场比赛，对手：{curObj.opponentName}</h3>
                        <p className="littleTitle">先手场</p>
                        <div className="itemLine">
                          <button onClick={this.handleChangeBoard(curObj['firstList'][0]['history'])}>
                            第一场
                          </button>
                          <span>{curObj['firstList'][0]['text']}</span>
                          <button onClick={this.handleChangeBoard(curObj['firstList'][1]['history'])}>
                            第二场
                          </button>
                          <span>{curObj['firstList'][1]['text']}</span>
                        </div>
                        <p className="littleTitle">后手场</p>
                        <div className="itemLine">
                          <button onClick={this.handleChangeBoard(curObj['secondList'][0]['history'])}>
                            第一场
                          </button>
                          <span>{curObj['secondList'][0]['text']}</span>
                          <button onClick={this.handleChangeBoard(curObj['secondList'][1]['history'])}>
                            第二场
                          </button>
                          <span>{curObj['secondList'][1]['text']}</span>
                        </div>
                        <div className={curObj.isWin ? "finalResult green" : "finalResult red"}>
                          {curObj["hasErr"] ? "废" :
                              (curObj.isWin ? "胜" : "败")}
                        </div>
                      </div>
                  )
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
            <button
                className="submitBtn"
                onClick={this.handleSubmitCode}>
              {this.state.isAllowSubmit ? "提交代码" : "代码运行中……"}
            </button>
          </div>
          <script src="https://unpkg.com/spacingjs" defer></script>
        </div>
    );
  }

  handleOnChange = (value, event) => {
    this.setState({userCode: value});
  }

  handleChangeBoard = (historyArr) => {
    return () => {
      console.log("更改了棋盘", historyArr);
      // 消息发布组件的一个函数中
      PubSub.publish("井字棋棋盘接收更改内容消息", {"historyList": historyArr});
    }
  };

  /**
   * 提交代码按钮
   */
  handleSubmitCode = () => {
    if (!USER_DATA.isLogin) {
      myAlert("登录才能提交代码");
      return;
    }
    if (!this.state.isAllowSubmit) {
      myAlert("不要频繁提交代码")
      return;
    }
    this.setState({isAllowSubmit: false});

    SOCKET_OBJ.emit("后端处理用户提交井字棋代码", {
      name: USER_DATA.name,
      score: USER_DATA.score,
      headSculpture: USER_DATA.headSculpture,
      code: this.state.userCode,
    });
    myAlert("已发送代码");
  }

  componentDidMount() {
    // 获取排行榜数据
    fetch(getUrl("ticTacToeGetRankList"), {
      method: 'GET',
    }).then(
        res => res.json()
    ).then(
        data => this.setState({rankList: data["rankList"]})
    ).catch(err => myAlert(err));

    SOCKET_OBJ.on("前端监听井字棋排行榜变化", res => {
      const data = (res);
      this.setState({rankList: data["rankList"]});
    });

    SOCKET_OBJ.on(`前端用户${USER_DATA.name}接收提交井字棋结果`, res => {
      const data = (res);
      console.log("接收到了提交的结果", data["resultArr"]);
      this.setState({
        resultArray: data["resultArr"],
        isAllowSubmit: true,
      });
    });

    SOCKET_OBJ.on(`前端用户${USER_DATA.name}接收提交井字棋异常结果`, res => {
      const data = (res);
      myAlert(data["text"]);
      this.setState({
        isAllowSubmit: true,
      });
    });

    changeBackgroundMusic("ticTacToe");
  }

  componentWillUnmount() {
    changeBackgroundMusic("main");
  }
}

export default TicTacToe;
