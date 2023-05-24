import React, {Component} from 'react';
import "./index.css";
import GobangBoard from "../../components/GobangBoard";
import GobangPlayerItem from "../../components/GobangPlayerItem";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";
import getUrl from "../../utils/js/getUrl";
import PubSub from "pubsub-js";
import {calculateCodeSize} from "../../utils/js/strTools";
import {changeBackgroundMusic} from "../../utils/js/backgroundMusic";
import CodeInputCasualMode from "../../components/CodeInputCasualMode";
import myAlert from "../../utils/js/alertMassage";
import CodeOutputCasualMode from "../../components/CodeOutputCasualMode";

class Gobang extends Component {
  constructor(props) {
    super(props);
    this.codeNameEle = React.createRef();
    this.state = {
      userCode: "EgCode",
      userList: [],  // [{},{}, ...]
    }
  }

  render() {
    return (
        <div className="page-gobang">
          <div className="left">
            <h2>五子棋排行榜</h2>
            {
              this.state.userList.map((obj, i) => {
                console.log(obj);
                return <GobangPlayerItem {...obj} rank={i + 1} fightFunc={this.fightPerson} key={i}/>
              })
            }
          </div>
          <div className="mid">
            <GobangBoard/>
            <CodeOutputCasualMode/>
          </div>

          <div className="right">
            <CodeInputCasualMode
                gameName={"gobang"}
                codeSubmitFunc={this.handleSubmit}/>
          </div>
        </div>
    );
  }

  // 排序方法
  sortGobangUserList = (userList) => {
    let arr = [...userList];
    arr.sort((a, b) => {
      const scoreA = a.winCount - a.loseCount;
      const scoreB = b.winCount - b.loseCount;

      if (scoreA > scoreB) {
        return -1; // 降序排列
      } else if (scoreA < scoreB) {
        return 1;
      } else {
        if (a.winCount > b.winCount) {
          return -1;
        } else if (a.winCount < b.winCount) {
          return 1;
        } else {
          if (a.codeSize > b.codeSize) {
            return -1;
          } else if (a.codeSize < b.codeSize) {
            return 1;
          } else {
            return 0; // 不做处理
          }
        }
      }
    });
    return arr;
  }
  /**
   * socket发来消息，收到了五子棋排行榜上变化的消息，发来了一整个新的数组
   * @param data
   */
  handleSocketListenGobangRank = data => {
    let arr = data['array'];
    console.log("排序后：", arr);
    this.setState({userList: this.sortGobangUserList(arr)});
  };

  /**
   * socket发来消息
   * errorType，
   * errorDetail，
   * @param data
   */
  handleSocketListenGobangSubmitError = data => {
    PubSub.publish("代码结果框更新状态", {
      isShow: true,
      result: data["errorType"],
      errData: data["errorDetail"],
    });
    PubSub.publish("娱乐模式代码输入界面更改状态", {
      isAllowSubmit: true,
    });
  }

  // 提交井字棋成功了
  handleSocketListenGobangSubmitSuccess = _ => {
    myAlert("提交成功！");
    PubSub.publish("娱乐模式代码输入界面更改状态", {
      isAllowSubmit: true,
    });
  }
  /**
   * 与排行榜上的某个人进行对战
   */
  fightPerson = (opponentId) => {
    SOCKET_OBJ.emit("后端监听五子棋中有用户发起了挑战", {
      challengerId: USER_DATA.id,
      opponentId: opponentId,
    });
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

    SOCKET_OBJ.on("前端监听五子棋榜上变化", this.handleSocketListenGobangRank);
    SOCKET_OBJ.on(`前端${USER_DATA.id}监听五子棋代码提交失败结果`, this.handleSocketListenGobangSubmitError);
    SOCKET_OBJ.on(`前端${USER_DATA.id}监听五子棋代码提交成功`, this.handleSocketListenGobangSubmitSuccess);
    SOCKET_OBJ.on(`前端${USER_DATA.id}监听五子棋挑战其他用户出错`, this.handleSocketListenGobangFightError);
    SOCKET_OBJ.on(`前端${USER_DATA.id}监听五子棋挑战其他用户出结果`, this.handleSocketListenGobangFightResult);

    changeBackgroundMusic("gobang");
  }

  componentWillUnmount() {
    changeBackgroundMusic("main");
    SOCKET_OBJ.off("前端监听五子棋榜上变化", this.handleSocketListenGobangRank);
    SOCKET_OBJ.off(`前端${USER_DATA.id}监听五子棋代码提交失败结果`, this.handleSocketListenGobangSubmitError);
    SOCKET_OBJ.off(`前端${USER_DATA.id}监听五子棋代码提交成功`, this.handleSocketListenGobangSubmitSuccess);
    SOCKET_OBJ.off(`前端${USER_DATA.id}监听五子棋挑战其他用户出错`, this.handleSocketListenGobangFightError);
    SOCKET_OBJ.off(`前端${USER_DATA.id}监听五子棋挑战其他用户出结果`, this.handleSocketListenGobangFightResult);
  }

  /**
   * 监听五子棋挑战其他用户出结果（没出错）
   * @param data {Object} :
   * {
   *      "opponentName": xxx,
   *      "resultString": res["resultString"],
   *      "isFirst": res["isFirst"],
   *      "history": res["history"],
   *      "winLocList": res["winLocList"],
   *      outputMessage: []
   *  }
   */
  handleSocketListenGobangFightResult = data => {
    let title;
    if (data["isFirst"]) {
      title = `${USER_DATA.name}（黑） vs ${data["opponentName"]}（白）（${data["resultString"]}）`;
    } else {
      title = `${USER_DATA.name}（白） vs ${data["opponentName"]}（黑）（${data["resultString"]}）`;
    }
    // data["outputMessage"] 打印出来
    PubSub.publish("娱乐模式代码输出框重新设定消息", data["outputMessage"]);

    PubSub.publish("五子棋棋盘更改状态", {
      history: data["history"],
      winnerLoc: data["winLocList"],
      matchName: title,
      curIndex: 0,
    });

    PubSub.publish("五子棋一条玩家更改状态", {
      isAllowClick: true,
    });
  }

  // 监听五子棋挑战其他用户出错
  handleSocketListenGobangFightError = (data) => {

    PubSub.publish("代码结果框更新状态", {
      isShow: true,
      result: data["errorType"],
      errData: data["errorDetails"],
    });
    PubSub.publish("五子棋一条玩家更改状态", {
      isAllowClick: true,
    });
  }

  handleSubmit = (code, codeName) => {

    SOCKET_OBJ.emit("后端处理用户提交五子棋代码", {
      userDetails: USER_DATA.getShort(),

      code: code,
      codeName: codeName,
      codeSize: calculateCodeSize(code),

      winCount: 0,
      loseCount: 0,
    });

  }
}

export default Gobang;
