import React, {Component} from 'react';
import {connectStr} from "../../utils/js/strTools";
import USER_DATA from "../../globalData/userData";
import "./index.css";
import Question from "../../components/Question";
import CodeInput from "../../components/CodeInput";
import SOCKET_OBJ from "../../globalData/socketObject";
import CodeSubmitResult from "../../components/CodeSubmitResult";
import MultipleContestTable from "../../components/MultipleContestTable";
import SendEmojiBtn from "../../components/SendEmojiBtn";
import MultipleContestList from "../../components/MultipleContestList";
import PubSub from "pubsub-js";
import {userContestEnd} from "../../utils/js/userFunction";
import GoHomeAlert from "../../components/GoHomeAlert";
import GameStartAnimation from "../../components/GameStartAnimation";
import {louseSound, winSound} from "../../utils/js/playSound";
import myAlert from "../../utils/js/alertMassage";


class MultipleContest extends Component {
  constructor(props) {
    super(props);
    const {hpInit, moodName} = this.props;

    this.moodName = moodName;  // 只有两种可能 "普通模式"  "极限模式"
    this.roomName = connectStr(USER_DATA.id, USER_DATA.opponent.id);

    this.state = {
      // 题目列表
      questionList: USER_DATA.questionObjList,

      // 显示对战表格中的数据
      myHp: hpInit,
      opHp: hpInit,

      // 双方做出来的题目
      myAcList: [false, false, false, false, false], // [t, f, t, f, f]
      opAcList: [false, false, false, false, false],

      myCodeChar: 0,
      opCodeChar: 0,

      myCurQuestion: 0,  // 这个不能删

      // 当前用户的代码，代码随着输入框的改变而改变
      userCode: '',
      // 当前用户选择的语言
      userLanguage: 'cpp',
      // 提交代码按钮状态
      submitDisable: false,

      isEnd: false,  // 对局是否结束了
      isWin: false,  // 结果是输赢
      endReason: "",  // 输赢的原因
    }
  }

  render() {
    const {
      questionList,
      myCurQuestion,
      submitDisable,
      isWin, isEnd, endReason
    } = this.state;

    return (
        <div className="multipleContestPage">
          {/*对战结束框*/}
          <GoHomeAlert isWin={isWin} isShow={isEnd} reason={endReason}/>
          {/*对局开始动画组件*/}
          <GameStartAnimation moodName={this.moodName}/>
          <div className="left">
            <MultipleContestList roomName={this.roomName}/>
          </div>
          <div className="middle">
            {<Question {...questionList[myCurQuestion]}/>}
          </div>
          <div className="right">
            <div className="codeArea">
              <CodeInput roomName={this.roomName}/>
              <CodeSubmitResult/>
            </div>

            <div className="bottomArea">
              <MultipleContestTable
                  team1UserObjList={[
                    {userName: USER_DATA.name, userId: USER_DATA.id}
                  ]}
                  team2UserObjList={[
                    {userName: USER_DATA.opponent.userName, userId: USER_DATA.opponent.id}
                  ]}
                  initHp={this.props.hpInit}
              />
              <div className="userPanel">
                <SendEmojiBtn/>
                <button className={"submitBtn" + (submitDisable ? " disabled" : "")} onClick={this.handleSubmit}>
                  {submitDisable ? "提交运行中" : "提交"}
                </button>
              </div>
            </div>

          </div>
        </div>
    );
  }

  socketHandleUserSurrender = data => {
    if (data["exitPlayerId"] === USER_DATA.opponent.id) {
      // 对方跑了 告诉后端自己赢了
      userContestEnd(true, this.moodName, res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        USER_DATA.updateFromDict(res["updateUserData"]);
        // 展示弹窗
        this.setState({isEnd: true, isWin: true, endReason: "对方逃跑了"})
      });
      winSound();
    } else if (data["exitPlayerId"] === USER_DATA.id) {
      // 跑的人竟是我自己
      // 展示弹窗
      userContestEnd(false, this.moodName, res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        USER_DATA.updateFromDict(res["updateUserData"]);
      });
      louseSound();
    } else {
      console.log("不知道是谁认输了", data["exitPlayerId"]);
    }
  }

  /**
   * res {
          "submitUserId": data["submitUserId"],  # 此变量完全没用到，只借助服务器传输

          "flag": flag,
          "acCount": acCount,

          "language": language,

          "questionId": questionID,
          "questionIndex": data["questionIndex"],

          "errData": errData,
          "errType": flag,
      }
   * @param data
   */
  socketHandleUserAc = data => {
    const questionIndex = data["questionIndex"];
    PubSub.publish("表格行监听用户提交代码通过", data);

    if (data["submitUserId"] === USER_DATA.id) {
      // 通过的人竟是我自己
      let newAcArr = [...this.state.myAcList];
      newAcArr[questionIndex] = true;

      this.setState({
        myAcList: newAcArr,
        submitDisable: false,  // 按钮可以继续按了
      });
      // 告诉左侧小盒子组件我们通过了
      PubSub.publish(`多题图标${questionIndex}更新状态`, {
        stage: 2,
        isMy: true,
      });
      PubSub.publish(`多题图标${questionIndex}增加提交语言图标`, {
        languageName: data["language"],
        isMy: true,
      });

      // 判断是不是赢了
      let winFlag = 0;
      for (const bool of newAcArr) {
        if (bool) {
          winFlag++;
        }
      }
      console.log("自己提交通过后检测输赢状态", winFlag);

      if (winFlag === 5) {
        this.setState({
          isWin: true,
          isEnd: true,
          endReason: "你率先通过了所有题目"
        })
        userContestEnd(true, this.moodName, res => {
          PubSub.publish("导航栏修改模式", {isUserPlaying: false});
          USER_DATA.updateFromDict(res["updateUserData"]);
        });
        winSound();
      } else {
        console.log("你还没赢")
      }
    } else if (data["submitUserId"] === USER_DATA.opponent.id) {
      let newAcArr = [...this.state.opAcList];
      newAcArr[questionIndex] = true;
      this.setState({opAcList: newAcArr});

      // 告诉左侧小盒子组件对方通过了
      PubSub.publish(`多题图标${questionIndex}更新状态`, {
        stage: 2,
        isMy: false,
      });
      PubSub.publish(`多题图标${questionIndex}增加提交语言图标`, {
        languageName: data["language"],
        isMy: false,
      });
      // 判断是不是赢了
      let winFlag = 0;
      for (const bool of newAcArr) {
        if (bool) {
          winFlag++;
        }
      }
      if (winFlag === 5) {
        // 对方通过了，我输了
        this.setState({
          isWin: false,
          isEnd: true,
          endReason: "对方提前通过了所有题目"
        });

        userContestEnd(false, this.moodName, res => {
          PubSub.publish("导航栏修改模式", {isUserPlaying: false});
          USER_DATA.updateFromDict(res["updateUserData"]);
        });
        louseSound();
      }
    } else {
      // 不知道是谁交的
      myAlert(`ERROR：未知用户通过了${data["submitUserId"]}`);
    }
  }
  socketHandleUserWa = res => {
    /**
     * res {
            "submitUserId": data["submitUserId"],  # 此变量完全没用到，只借助服务器传输

            "flag": flag,
            "acCount": acCount,

            "language": language,

            "questionId": questionID,
            "questionIndex": data["questionIndex"],

            "errData": errData,
            "errType": flag,
        }
     * @type {Object}
     */
    let data = (res);

    PubSub.publish(`多题图标${data["questionIndex"]}增加提交语言图标`, {
      languageName: data["language"],
      isMy: data["submitUserId"] === USER_DATA.id,
    });

    PubSub.publish(`多题图标${data["questionIndex"]}更新状态`, {
      stage: 1,
      isMy: data["submitUserId"] === USER_DATA.id,
    });

    PubSub.publish(`多题表格行${data["submitUserId"]}监听掉血`, {});

    if (data["submitUserId"] === USER_DATA.id) {
      // 提交错的人是我自己

      let newHp = this.state.myHp - 1;
      this.setState({
        myHp: newHp,
        submitDisable: false,  // 按钮可以继续按了
      });


      PubSub.publish("代码结果框更新状态", {
        result: data["errType"],
        errData: data["errData"],
        isShow: true
      });

      if (newHp === 0) {
        this.setState({isWin: false, isEnd: true, endReason: "生命值用光了"});

        userContestEnd(false, this.moodName, res => {
          PubSub.publish("导航栏修改模式", {isUserPlaying: false});
          USER_DATA.updateFromDict(res["updateUserData"]);
        });
        louseSound();
      }
    } else if (data["submitUserId"] === USER_DATA.opponent.id) {
      // 对方没通过
      let newHp = this.state.opHp - 1;
      this.setState({
        opHp: newHp,
      });
      if (newHp === 0) {
        this.setState({
          isEnd: true, isWin: true, endReason: "对方生命耗尽"
        });
        userContestEnd(true, this.moodName, res => {
          PubSub.publish("导航栏修改模式", {isUserPlaying: false});
          USER_DATA.updateFromDict(res["updateUserData"]);
        });
        winSound();
      }
    } else {
      // 不知道是谁交的
      myAlert(`ERROR：未知用户通过了${data["submitUserId"]}`);
    }
  }

  componentDidMount() {
    // 监听用户切换题目
    this.token1 = PubSub.subscribe("更新用户正在看题的下标", (_, data) => {
      this.setState({myCurQuestion: data.index});
    });

    // 监听用户输入代码
    this.updateCode = PubSub.subscribe("更新用户输入代码", (_, data) => {
      this.setState(data);
    });

    SOCKET_OBJ.on(`前端${this.roomName}监听对方认输`, this.socketHandleUserSurrender);
    SOCKET_OBJ.on(`前端单挑模式${this.roomName}房间有用户提交代码通过`, this.socketHandleUserAc);
    SOCKET_OBJ.on(`前端单挑模式${this.roomName}房间有用户提交代码未通过`, this.socketHandleUserWa);
  }

  // 多题模式用户提交代码
  handleSubmit = () => {
    const {
      userCode, userLanguage,
      submitDisable, questionList, myCurQuestion
    } = this.state;
    // 如果当前已经是运行中的状态，则不能再点
    if (submitDisable) return;

    SOCKET_OBJ.emit(`单挑模式监听用户提交代码`, {
      submitUserId: USER_DATA.id,
      submitCode: userCode,
      language: userLanguage,
      matchName: this.roomName,
      moodName: this.moodName,
      questionID: questionList[myCurQuestion].id,
      questionIndex: myCurQuestion,  // 后端再返回给前端的时候会在多题模式中标注
    });

    // 把按钮状态更改
    this.setState({submitDisable: true});

    PubSub.publish("单挑模式提交结果面板更改状态", {isShow: true});
  }


  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
    PubSub.unsubscribe(this.updateCode);
    // 取消socket
    SOCKET_OBJ.off(`前端${this.roomName}监听对方认输`, this.socketHandleUserSurrender);
    SOCKET_OBJ.off(`前端单挑模式${this.roomName}房间有用户提交代码通过`, this.socketHandleUserSubmitAc);
    SOCKET_OBJ.off(`前端单挑模式${this.roomName}房间有用户提交代码未通过`, this.socketHandleUserSubmitWa);
  }

}

export default MultipleContest;
