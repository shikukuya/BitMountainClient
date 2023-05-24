import React, {Component} from 'react';
import "./index.css";
import Array2d from "../../utils/js/array2d";
import SOCKET_OBJ from "../../globalData/socketObject";
import {connectStr, isMostlyChinese} from "../../utils/js/strTools";
import USER_DATA from "../../globalData/userData";
import ProgressBar from "../../components/ProgressBar";
import GoHomeAlert from "../../components/GoHomeAlert";
import {userContestEnd} from "../../utils/js/userFunction";
import PubSub from "pubsub-js";
import getUrl from "../../utils/js/getUrl";
import myAlert from "../../utils/js/alertMassage";
import {changeBackgroundMusic} from "../../utils/js/backgroundMusic";

class TypeWritingContest extends Component {

  constructor(props) {
    super(props);

    this.lineMaxChar = 50;  // 一行最多50个中文字符

    this.curY = 0;  // 当前正在输入第几行
    this.inputEleRefArr = [];  //

    this.spanEleRefMatrix = new Array2d(this.lineMaxChar, 100, React.createRef());
    this.title = USER_DATA.typewriteTitle;
    this.content = "content......";


    this.myLineLocRef = React.createRef();
    this.opLineLocRef = React.createRef();
    this.myLocRef = React.createRef();
    this.opLocRef = React.createRef();

    this.totalTime = 120;  // 默认两分钟，120秒

    this.state = {
      wordArr: [],
      title: USER_DATA.typewriteTitle,

      remainingTime: this.totalTime,  // 秒
      opCharCount: 0,  // 我当前打的字符量
      myCharCount: 0,  // 对方当前打的字符量

      isWin: false,
      isEnd: false,
      endReason: "??",
      isEnglish: false, // 这篇文章是否是英文文章
    }
  }


  render() {
    const {
      wordArr, title,
      remainingTime,
      opCharCount,
      myCharCount,
      isWin, isEnd, endReason
    } = this.state;

    return (
        <div className="page-type-writing-contest">
          {/*右上角的小面板*/}
          <div className="rightTopPanel">
            <div className="line">
              <span>您当前进度：</span>
              <ProgressBar w={100} h={20}
                           rate={myCharCount / this.content.length}
                           color={[0, 255, 0]}/>
              <span>{((myCharCount / this.content.length) * 100).toFixed(1)}</span>%
            </div>
            <div className="line">
              <span>对方的进度：</span>
              <ProgressBar w={100} h={20}
                           rate={opCharCount / this.content.length}
                           color={[255, 0, 0]}/>
              <span>{((opCharCount / this.content.length) * 100).toFixed(1)}</span>%
            </div>
            <div className="line">
              <span>剩余的时间：</span>
              <ProgressBar
                  w={100} h={20} rate={remainingTime / this.totalTime}
                  color={[0, 0, 255]}/>
              <span>{remainingTime}</span>s
            </div>
          </div>

          <GoHomeAlert reason={endReason} isShow={isEnd} isWin={isWin}/>
          {/*文章部分*/}
          <h1>{title}</h1>
          <div className="article">
            <div className="myLineLoc" ref={this.myLineLocRef}>您的位置=></div>
            <div className="opponentLineLoc" ref={this.opLineLocRef}>对手位置=></div>
            <div className="myCharLoc" ref={this.myLocRef}/>
            <div className="opponentCharLoc" ref={this.opLocRef}/>
            {
              wordArr.map((word, y) => {
                return (
                    <div className="line" key={y}>
                      <div className="lineOrigin">
                        {
                          this._stringToArrayFill50(word).map((char, x) => {
                            return (
                                <span
                                    className="default"
                                    key={x}
                                    ref={this.spanEleRefMatrix.get(x, y)}
                                >{char === " " ? `\u00A0` : char}</span>
                            )
                          })
                        }
                      </div>
                      <input
                          type="text"
                          ref={this.inputEleRefArr[y]}
                          onChange={this.handleChange}
                          style={{letterSpacing: this.state.isEnglish ? "8px" : "0"}}
                          maxLength={50}/>
                    </div>
                )
              })
            }
          </div>

        </div>
    );
  }

  _stringToArrayFill50 = str => {
    let arr = str.split("");
    while (arr.length < 50) {
      arr.push(" ");
    }
    return arr;
  }
  handleChange = (event) => {
    const value = event.target.value;
    event.target.value = value.replace(/ /g, "\u00A0");
  }
  // 获取当前光标所在行的元素
  getCurInputEle = () => {
    return this.inputEleRefArr[this.curY].current;
  }

  // 获取某一个位置上的字符Span元素
  getSpanEle = (x, y) => {
    return this.spanEleRefMatrix.get(x, y).current;
  }

  componentDidMount() {
    // 房间名
    let roomName = connectStr(USER_DATA.id, USER_DATA.opponent.id);

    // 获取文章内容
    fetch(getUrl("getArticleContentByTitle"), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: USER_DATA.typewriteTitle
      }),
    }).then(
        res => res.json()
    ).then(
        res => {
          this.content = res.content;
          this.updateContent(this.content);
          this.bindKeyboardEvent();
        }
    );


    // 开启定时器更新剩余时间
    this.tick = setInterval(() => {
      let n = this.state.remainingTime;
      n--;
      this.setState({remainingTime: n});
      if (n === 0) {
        // 游戏结束
        if (this.state.opCharCount < this.state.myCharCount) {
          // 告诉后端说自己赢了
          userContestEnd(true, "打字对决", res => {
            // 前端更新
            this.setState({isEnd: true, isWin: true, endReason: "您的进度优于对手"});
            USER_DATA.updateFromDict(res["updateUserData"]);
            PubSub.publish("导航栏修改模式", {isUserPlaying: false});
          })
        } else if (this.state.opCharCount > this.state.myCharCount) {
          // 输了
          userContestEnd(false, "打字对决", res => {
            // 前端更新
            this.setState({isEnd: true, isWin: false, endReason: "对手的进度优于您"});
            USER_DATA.updateFromDict(res["updateUserData"]);
            PubSub.publish("导航栏修改模式", {isUserPlaying: false});
          })
        } else {
          // 平局
          userContestEnd(false, "打字对决", res => {
            // 前端更新
            this.setState({isEnd: true, isWin: false, endReason: "您和对手的进度恰好一样"});
            USER_DATA.updateFromDict(res["updateUserData"]);
            PubSub.publish("导航栏修改模式", {isUserPlaying: false});
          })
        }
        clearInterval(this.tick);
      }
    }, 1000);

    // 开启定时器检查打字是否正确，更新文字颜色显示，同时刷新进度数据
    this.checkAni = setInterval(() => {
      let myCurrentCharCount = 0;  // 自己目前打对了多少个字符

      for (let y = 0; y < this.inputEleRefArr.length; y++) {
        let inputEle = this.inputEleRefArr[y].current;
        let inputStr = inputEle.value;

        let flag = false;  // 表示用户输入的部分是否已经结束
        for (let x = 0; x < this.lineMaxChar; x++) {
          let spanEle = this.getSpanEle(x, y);

          if (x === inputStr.length) {
            flag = true;
          }
          if (flag) {
            spanEle.classList.remove("correct");
            spanEle.classList.remove("wrong");
            spanEle.classList.add("default");
            continue;
          }
          let char = inputStr[x];

          if (char === spanEle.innerText) {
            // 文字相等
            spanEle.classList.remove("default");
            spanEle.classList.remove("wrong");
            spanEle.classList.add("correct");
            myCurrentCharCount++;
          } else {
            // 文字不相等
            spanEle.classList.remove("default");
            spanEle.classList.remove("correct");
            spanEle.classList.add("wrong");
          }
        }
      }
      this.setState({myCharCount: myCurrentCharCount});
      if (myCurrentCharCount >= this.content.length) {
        // 自己的进度已经满了
        if (this.state.isEnd) {
          return;
        }
        // 告诉后端自己打完了
        SOCKET_OBJ.emit(`后端处理玩家打完文章`, {
          finishPlayer: USER_DATA.name,
          anotherPlayer: USER_DATA.opponent.userName,
          contestName: roomName,
        });
        myAlert("您已经打完了文章");
        clearInterval(this.checkAni);
      }
    }, 500);

    // 开启定时器，更新自己的位置 以及自己的进度
    this.moveAni = setInterval(() => {
      let x = this.getCurInputEle().value.length;
      let ele = this.myLocRef.current;
      ele.style.left = `${20 * x}px`;
      ele.style.top = `${80 * this.curY}px`;
      // 顺便转手发给服务器
      SOCKET_OBJ.emit("后端监听打字对决位置进度改变", {
        selfName: USER_DATA.name,
        opponentName: USER_DATA.opponent.userName,
        selfCharCount: this.state.myCharCount,
        location: {
          x: x,
          y: this.curY
        }
      })
    }, 500);

    SOCKET_OBJ.on(`前端${roomName}监听有人打完了文章`, this.socketHandleOver);
    SOCKET_OBJ.on(`前端${USER_DATA.name}更新对手位置`, this.socketHandleUpdateLoc);
    SOCKET_OBJ.on(`前端${roomName}监听对方认输`, this.socketHandleUserSurrender);

    changeBackgroundMusic("typeWrite");
  }

  /**
   * data : {
   *    "exitPlayerId": data["exitPlayerId"]
   * }
   * @param data
   */
  socketHandleUserSurrender = data => {
    if (data["exitPlayerId"] === USER_DATA.opponent.id) {
      // 对方跑了 告诉后端自己赢了
      userContestEnd(true, "打字对决", res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        // 展示弹窗
        this.setState({isEnd: true, isWin: true, endReason: "对方被吓跑了，你赢了"});
        USER_DATA.updateFromDict(res["updateUserData"]);
      });
    } else if (data["exitPlayerId"] === USER_DATA.id) {
      // 跑的人竟是我自己
      // 展示弹窗
      userContestEnd(false, "打字对决", res => {
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
        USER_DATA.updateFromDict(res["updateUserData"]);
      });
    } else {
      console.log("不知道是谁认输了", data["exitPlayerId"] );
    }
  }

  socketHandleUpdateLoc = res => {
    let data = (res);
    let {x, y} = data["opponentLoc"];
    let ele = this.opLocRef.current;
    ele.style.left = `${x * 20}px`;
    ele.style.top = `${80 * y}px`;

    let LineEle = this.opLineLocRef.current;
    LineEle.style.top = `${80 * y}px`;
    // 更新对手进度
    this.setState({opCharCount: data["opponentCharCount"]})
  }

  socketHandleOver = res => {
    let data = (res);
    let finishPlayer = data["finishPlayer"];

    if (finishPlayer === USER_DATA.opponent.userName) {
      // 对手赢了
      userContestEnd(false, "打字对决", res => {
        // 前端更新
        this.setState({isEnd: true, isWin: false, endReason: "对手率先打完了文章"});
        USER_DATA.updateFromDict(res["updateUserData"]);
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
      })
    } else {
      // 自己赢了
      userContestEnd(true, "打字对决", res => {
        // 前端更新
        this.setState({isEnd: true, isWin: true, endReason: "恭喜您打完了这个文章"});
        USER_DATA.updateFromDict(res["updateUserData"]);
        PubSub.publish("导航栏修改模式", {isUserPlaying: false});
      })
    }
  }

  componentWillUnmount() {
    // 房间名
    let roomName = connectStr(USER_DATA.id, USER_DATA.opponent.id);
    SOCKET_OBJ.off(`前端${roomName}监听有人打完了文章`, this.socketHandleOver);
    SOCKET_OBJ.off(`前端${USER_DATA.name}更新对手位置`, this.socketHandleUpdateLoc);
    SOCKET_OBJ.off(`前端${roomName}监听对方认输`, this.socketHandleUserSurrender);

    clearInterval(this.checkAni);
    clearInterval(this.moveAni);
    clearInterval(this.tick);

    // 移除键盘事件
    window.removeEventListener("keyup", this.keyboardEvent);
    changeBackgroundMusic("main");
  }

  _updateMyLineLoc = () => {
    this.myLineLocRef.current.style.top = `${80 * this.curY}px`;
  }

  // 把文章转化成50个字符一个句子的数组
  updateContent = (string) => {
    let arr = [];
    let curWord = ""
    if (isMostlyChinese(string)) {
      string = this.transChinese(string);
      this.setState({isEnglish: false});
    } else {
      this.setState({isEnglish: true});
    }
    for (let char of string) {
      if (curWord.length === this.lineMaxChar) {
        arr.push(curWord);
        curWord = ""
      }
      curWord += char;
    }
    if (curWord !== "") {
      arr.push(curWord)
    }
    // 更新inputRef 数组
    this.inputEleRefArr = [];
    for (let i = 0; i < arr.length; i++) {
      this.inputEleRefArr.push(React.createRef());
    }

    // 更新lineRef 二维数组
    this.spanEleRefMatrix.reshapeByFunc(this.lineMaxChar, arr.length, React.createRef);

    // 驱动更新页面渲染
    this.setState({wordArr: arr});

  }

  // 把一个字符串转化成中文
  transChinese = str => {
    let res = str.replaceAll(" ", "");
    res = res.replaceAll("\n", "");
    res = res.replaceAll(",", "，");
    res = res.replaceAll(".", "。");
    res = res.replaceAll("?", "？");
    res = res.replaceAll("!", "！");
    res = res.replaceAll(":", "：");
    return res
  }

  bindKeyboardEvent = () => {
    this.keyboardEvent = (e) => {
      // 处理光标移动
      if (e.key === "ArrowDown" || e.key === "Enter") {
        if (this.curY === this.inputEleRefArr.length - 1) {
          return;
        }
        this.curY++;
        this._updateMyLineLoc();
        this.getCurInputEle().focus();
      }
      if (e.key === "ArrowUp") {
        if (this.curY === 0) {
          return;
        }
        this.curY--;
        this._updateMyLineLoc();
        this.getCurInputEle().focus();
      }
      if (e.key === "Backspace" && this.getCurInputEle().value === "") {
        if (this.curY === 0) {
          return;
        }
        this.curY--;
        this._updateMyLineLoc();
        this.getCurInputEle().focus();
      }
    }
    // 绑定键盘事件
    window.addEventListener("keyup", this.keyboardEvent);
  }
}


export default TypeWritingContest;
