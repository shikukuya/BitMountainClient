import React, {Component} from 'react';
import "./index.css";
import "../../utils/css/icon.css";
import Question from "../../components/Question";
import CodeInput from "../../components/CodeInput";
import USER_DATA from "../../globalData/userData";
import SOCKET_OBJ from "../../globalData/socketObject";
import {connectStr} from "../../utils/js/strTools";
import PubSub from "pubsub-js"
import GoHomeAlert from "../../components/GoHomeAlert";
import {userContestEnd} from "../../utils/js/userFunction";
import SendEmojiBtn from "../../components/SendEmojiBtn";
import ContestTable from "../../components/ContestTable";
import CodeSubmitResult from "../../components/CodeSubmitResult";
import GameStartAnimation from "../../components/GameStartAnimation";
import {louseSound, winSound} from "../../utils/js/playSound";


class NormalContest extends Component {
  constructor(props) {
    super(props);
    const {hpInit, moodName} = this.props;
    this.moodName = moodName;  // 只有两种可能 "普通模式"  "极限模式"
    console.log("当前模式为", this.moodName, moodName);
    this.roomName = connectStr(USER_DATA.name, USER_DATA.opponent.name);

    this.team1NameArr = [USER_DATA.name];
    this.team2NameArr = [USER_DATA.opponent.name];

    this.state = {
      question: USER_DATA.questionObjList[0],

      // 显示对战表格中的数据
      myHp: hpInit,
      opHp: hpInit,

      myCodeChar: 0,
      opCodeChar: 0,

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
      question,
      // 结果
      isEnd, isWin, endReason,
      submitDisable,
    } = this.state;
    return (
        <div className="normalContestPage">
          {/*对战结束的弹窗*/}
          <GoHomeAlert isWin={isWin} isShow={isEnd} reason={endReason}/>
          {/*对局开始动画组件*/}
          <GameStartAnimation moodName={this.moodName}/>
          {/*左右分屏布局*/}
          <div className="left">
            <Question {...question}/>
          </div>

          <div className="right">
            <div className="codeArea">
              <CodeInput roomName={this.roomName}/>
              <CodeSubmitResult/>
            </div>
            <div className="bottomArea">
              <ContestTable
                  team1={this.team1NameArr}
                  team2={this.team2NameArr}
                  initHp={this.props.hpInit}/>

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

  socketHandleUserSubmitAc = (res) => {
    let data = (res);

    PubSub.publish("表格行监听用户提交代码通过", data);

    if (data["submitUser"] === USER_DATA.name) {
      // 通过的人竟是我自己
      this.setState({
        isWin: true, isEnd: true,
        endReason: "你率先通过了这道题",
        submitDisable: false,  // 按钮可以继续按了
      });
      userContestEnd(true, this.moodName, res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        USER_DATA.updateFromDict(res["updateUserData"]);
      });
      winSound();
    } else {
      // 对方通过了，我输了
      this.setState({
        isWin: false, isEnd: true,
        endReason: "对方提前通过了这道题"
      });

      userContestEnd(false, this.moodName, res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        USER_DATA.updateFromDict(res["updateUserData"]);
      });
      louseSound();
    }
  }

  socketHandleUserSubmitWa = (res) => {
    /**
     * submitUser
     * errType
     * errData
     * language
     * @type {Object}
     */
    let data = (res);

    // 告诉表格行
    // 消息发布组件的一个函数中
    PubSub.publish("表格行监听用户提交代码错误", data);

    if (data["submitUser"] === USER_DATA.name) {

      // 我没通过
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
    } else {
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
    }
  }

  socketHandleUserSurrender = (res) => {
    let data = (res);
    if (data.exitPlayerName === USER_DATA.opponent.name) {
      // 对方跑了 告诉后端自己赢了

      userContestEnd(true, this.moodName, res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        USER_DATA.updateFromDict(res["updateUserData"]);
        // 展示弹窗
        this.setState({isEnd: true, isWin: true, endReason: "对方逃跑了"});
      });
      winSound();
    } else if (data.exitPlayerName === USER_DATA.name) {
      // 跑的人竟是我自己
      // 展示弹窗
      userContestEnd(false, this.moodName, res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        USER_DATA.updateFromDict(res["updateUserData"]);
        // 展示弹窗
      });
      louseSound();
    } else {
      console.log("不知道是谁认输了", data.exitPlayerName);
    }
  }

  componentDidMount() {
    // 用户输入代码，会影响table组件和codeInput组件
    this.updateCode = PubSub.subscribe("更新用户输入代码", (_, data) => {
      this.setState(data);
    });
    // 监听有用户提交成功
    SOCKET_OBJ.on(`前端单挑模式${this.roomName}房间有用户提交代码通过`, this.socketHandleUserSubmitAc);
    // 监听有用户提交失败
    SOCKET_OBJ.on(`前端单挑模式${this.roomName}房间有用户提交代码未通过`, this.socketHandleUserSubmitWa);
    // 监听有用户认输
    SOCKET_OBJ.on(`前端${this.roomName}监听对方认输`, this.socketHandleUserSurrender);
  }

  /**
   * 提交代码按钮
   */
  handleSubmit = () => {
    const {userCode, userLanguage, submitDisable, question} = this.state;
    // 如果当前已经是运行中的状态，则不能再点
    if (submitDisable) return;

    SOCKET_OBJ.emit(`单挑模式监听用户提交代码`, {
      submitUserName: USER_DATA.name,
      submitCode: userCode,
      language: userLanguage,
      matchName: this.roomName,
      moodName: this.moodName,
      questionID: question.id,
      questionIndex: 0,  // 后端再返回给前端的时候会在多题模式中标注
    });

    // 把按钮状态更改
    this.setState({submitDisable: true});
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.updateCode);
    // 取消socket
    SOCKET_OBJ.off(`前端单挑模式${this.roomName}房间有用户提交代码通过`, this.socketHandleUserSubmitAc);
    SOCKET_OBJ.off(`前端单挑模式${this.roomName}房间有用户提交代码未通过`, this.socketHandleUserSubmitWa);
    SOCKET_OBJ.off(`前端${this.roomName}监听对方认输`, this.socketHandleUserSurrender);
  }
}

export default NormalContest;
