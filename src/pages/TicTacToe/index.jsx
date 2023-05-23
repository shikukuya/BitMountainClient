import React, {Component} from 'react';
import "./index.css";
import Editor from "@monaco-editor/react";
import RankItem from "../../components/RankItem";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";
import myAlert from "../../utils/js/alertMassage";
import getUrl from "../../utils/js/getUrl";
import TicTacToeBoard from "../../components/TicTacToeBoard";
import PubSub from "pubsub-js"
import {changeBackgroundMusic} from "../../utils/js/backgroundMusic";
import ticTacToeTemplateCodeStr from "./ticTacToeTemplateCode";
import {calculateCodeSize} from "../../utils/js/strTools";

const EgCode = ticTacToeTemplateCodeStr;

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCode: EgCode,
      /**
       * [
       *     {
                userDetails: {},
                code: this.state.userCode,
                codeSize: ""
            }
       * ]
       */
      rankList: [],
      resultArray: [],  // 提交代码之后的和其他排行榜上对手打的结果
      /**
       * 该数组中的每一个对象的信息
       * {
            isError: 和这个人的对拼中是否出错了
            errorType: 错误类型
            errorDetails: 错误详细信息
            isWin: bool,  这三局两胜中，自己是否赢了，平局会是False
            opponentName: "xxx",
            firstList: [
              {  history: [{x,y},{x,y},{x,y}...], winnerSymbol: 0?1?2, errorStatus: 0?1?2  },
              {  history: [{x,y},{x,y},{x,y}...], winnerSymbol: 0?1?2, errorStatus: 0?1?2  },
            ]
            secondList: [
              {  history: [{x,y},{x,y},{x,y}...], winnerSymbol: 0?1?2, errorStatus: 0?1?2  },
              {  history: [{x,y},{x,y},{x,y}...], winnerSymbol: 0?1?2, errorStatus: 0?1?2  },
            ]
          },
       */
      allDetailsWithOpponents: [],  // 提交代码之后的和其他排行榜上对手打的结果
      isFirstCheckError: false,
      firstCheckErrorType: "",
      firstCheckErrorDetails: "",

      errorTypeText: "",
      errorDetailText: "",

      isAllowSubmit: true,  // 当前是否允许提交代码
    }
  }

  renderTicTacToeMatchList() {
    return <div className="ticTacToeMatchList">
      {
        this.state.allDetailsWithOpponents.map((curOppFight, i) => {
          console.log("渲染代码执行了")
          if (curOppFight["isError"]) {
            // 和这个人的整体比赛直接报错了
            return <div className="ticTacToeMatchItem" key={i}>
              <h3>第{i + 1}场比赛，对手：{curOppFight.opponentName}</h3>
              <h5>报错：{curOppFight.errorType}</h5>
              <p>{curOppFight["errorDetails"]}</p>
              <div className="finalResult red">废</div>
            </div>
          } else {
            // 和这个人的整体比赛没有报错
            return <div className="ticTacToeMatchItem" key={i}>
              <h3>第{i + 1}场比赛，对手：{curOppFight.opponentName}</h3>
              <p className="littleTitle">先手场</p>

              <div className="itemLine">
                {
                  curOppFight['firstList'].map((firstListItem, j) => {
                    return <div key={j}>
                      <button onClick={
                        this.handleChangeBoard(
                            firstListItem['history'],
                            `与${curOppFight.opponentName}先手第${j + 1}场`
                        )
                      }>第{j + 1}场
                      </button>
                      {this.renderLittleFight(true, firstListItem['winnerSymbol'], firstListItem["errorStatus"])}
                    </div>
                  })
                }
              </div>

              <p className="littleTitle">后手场</p>
              <div className="itemLine">
                {
                  curOppFight['secondList'].map((secondListItem, j) => {
                    return <div key={j}>
                      <button onClick={
                        this.handleChangeBoard(
                            secondListItem['history'],
                            `与${curOppFight.opponentName}后手第${j + 1}场`
                        )
                      }>第{j + 1}场
                      </button>
                      {this.renderLittleFight(false, secondListItem['winnerSymbol'], secondListItem["errorStatus"])}
                    </div>
                  })
                }
              </div>
              <div>{curOppFight["myScore"]}分</div>
              <div className={curOppFight.isWin ? "finalResult green" : "finalResult red"}>
                {curOppFight.isWin ? "胜" : "败"}
              </div>
            </div>
          }
        })
      }
    </div>
  }

  /**
   * 只渲染一个span 内容是这个结局 平局？赢了？输了？谁出bug了？
   * @param isFirst 自己是否是先手
   * @param winnerSymbol 是谁赢了？1 2 0
   * @param errorStatus 是谁发生了错误？1 2 0
   */
  renderLittleFight(isFirst, winnerSymbol, errorStatus) {
    let resultText;
    let self = isFirst ? 1 : 2;
    let op = isFirst ? 2 : 1;
    if (errorStatus === 0) {  // 非错误状态
      if (winnerSymbol === 0) {
        resultText = "平局";
      } else if (winnerSymbol === self) {
        resultText = "胜利";
      } else if (winnerSymbol === op) {
        resultText = "失败";
      }
    } else {  // 发生错误
      if (errorStatus === self) {
        resultText = "我方bug";
      } else if (errorStatus === op) {
        resultText = "对方bug";
      }
    }
    return <span>{resultText}</span>;
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
                  console.log("rankList:", this.state.rankList);
                  console.log("curObj:", curObj)
                  return <RankItem
                      head={curObj["userDetails"]["headSculpture"]}
                      userName={curObj["userDetails"]["userName"]}
                      score={curObj["userDetails"]["score"]}
                      codeSize={curObj["codeSize"]}
                      key={curObj["userDetails"]["id"]}
                      rank={i + 1}/>
                })
              }
            </div>
          </div>
          <div className="mid">
            <TicTacToeBoard/>
            <h2>查看对局</h2>
            {this.renderTicTacToeMatchList()}
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
            <span className="errorTypeSpan">{this.state.errorTypeText}</span>
            <div className="errorDetailDiv">{this.state.errorDetailText}</div>
          </div>
        </div>
    );
  }

  handleOnChange = (value, event) => {
    this.setState({userCode: value});
  }

  handleChangeBoard = (historyArr, boardTitle) => {
    return () => {
      console.log("更改了棋盘", historyArr);
      // 消息发布组件的一个函数中
      PubSub.publish("井字棋棋盘接收更改内容消息", {historyList: historyArr, title: boardTitle});
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
    if (this.state.userCode.length > 16000) {
      myAlert("代码字符数量不能超过1万6");
      return;
    }
    this.setState({isAllowSubmit: false});

    // 经过了nodejs直接传到了python的'/api/apiTicTacToeSubmitCode'
    let sendUserDetails = USER_DATA;
    sendUserDetails.userName = USER_DATA.name;  // 命名不规范，捞出bug
    SOCKET_OBJ.emit("后端处理用户提交井字棋代码", {
      userDetails: sendUserDetails,
      code: this.state.userCode,
      codeSize: calculateCodeSize(this.state.userCode),
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
        data => {
          /**
           * {
              userDetails: {}
              codeSize: int
            }
           */
          console.log("接收到的数据排行榜", data)
          this.setState({rankList: data})
        }
    ).catch(err => myAlert(err));

    SOCKET_OBJ.on("前端监听井字棋排行榜变化", this.socketHandleListenRank);
    SOCKET_OBJ.on(`前端用户${USER_DATA.id}接收提交井字棋结果`, this.socketHandleSubmitResult);
    SOCKET_OBJ.on(`前端用户${USER_DATA.id}接收提交井字棋异常结果`, this.socketHandleSubmitBug);
    changeBackgroundMusic("ticTacToe");
  }

  socketHandleListenRank = data => {
    this.setState({rankList: data});
  }
  /**
   * 接收用户提交井字棋的结果
   * {
        allDetailsWithOpponents: [...],
        "isFirstCheckError": True,  # 是否通过了初次检验？
        "firstCheckErrorType": "",  # 初次检验错误类型
        "firstCheckErrorDetails": "",  # 初次检验没有通过的具体细节
     }
   * @param data
   */
  socketHandleSubmitResult = data => {
    console.log("接收到了提交的结果", data);
    this.setState({isAllowSubmit: true});

    if (data["isFirstCheckError"]) {
      myAlert("没有通过初次检验")
      // 没有通过初次检验
      this.setState({
        errorTypeText: data["firstCheckErrorType"],
        errorDetailText: data["firstCheckErrorDetails"]
      })
    } else {
      console.log("====收到的详细对战信息");
      console.log(data["allDetailsWithOpponents"]);
      this.setState({

        isFirstCheckError: data["isFirstCheckError"],
        firstCheckErrorType: data["firstCheckErrorType"],
        firstCheckErrorDetails: data["firstCheckErrorDetails"],

        allDetailsWithOpponents: data["allDetailsWithOpponents"],


      });
    }

  }

  socketHandleSubmitBug = res => {
    const data = (res);
    myAlert(data["text"]);
    this.setState({
      isAllowSubmit: true,
    });
  }

  componentWillUnmount() {
    changeBackgroundMusic("main");
    SOCKET_OBJ.off("前端监听井字棋排行榜变化", this.socketHandleListenRank);
    SOCKET_OBJ.off(`前端用户${USER_DATA.id}接收提交井字棋结果`, this.socketHandleSubmitResult);
    SOCKET_OBJ.off(`前端用户${USER_DATA.id}接收提交井字棋异常结果`, this.socketHandleSubmitBug);
  }
}

export default TicTacToe;
