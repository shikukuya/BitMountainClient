import React, {Component} from 'react';
import EmojiShowArea from "../EmojiShowArea";
import "./index.css";
import PubSub from "pubsub-js";
import SOCKET_OBJ from "../../globalData/socketObject";


class ContestTableLine extends Component {
  constructor(props) {
    super(props);

    const {initHp, name} = this.props;
    this.name = name;

    this.state = {
      name: name,
      hp: initHp,
      submitArr: [],  // ["py", ...]
      codeChar: 0,
      ac: 0,

      isAc: false,  // 待设计，某一个用户提交通过之后整个框变色了
    }
  }

  render() {
    const {name, roomName, symbolColor, userId} = this.props;
    const {hp, submitArr, codeChar, ac} = this.state;

    return (
        <div className="components-contest-table-line">
          <div className="box" style={{color: symbolColor}}>
            {name}
            <EmojiShowArea bindUserId={userId} roomName={roomName}/>
          </div>
          <div className={hp <= 1 ? "box shakeAni" : "box"}>
            {"❤".repeat(hp)}
          </div>
          <div className="box">
            {this.getSubmitArrayRend(submitArr)}
          </div>
          <div className="box">{codeChar}</div>
          <div className="box">{ac}</div>
        </div>
    );
  }

  componentDidMount() {
    const {roomName, userId} = this.props;

    this.token1 = PubSub.subscribe("表格行监听用户提交代码错误", (_, data) => {
      /**
       * submitUser 这个是字符串
       * errType
       * errData
       * language
       * acCount
       * @type {Object}
       */
      if (data["submitUserId"] === userId) {
        if (this.state.hp === 0) return;
        let newArr = [...this.state.submitArr, data["language"]]
        this.setState({
          submitArr: newArr,  // 添加语言logo
          hp: this.state.hp - 1,  // 血量减少
          ac: data["acCount"],   // 更新通过的测试点数量
        });
      }
    });

    this.token2 = PubSub.subscribe("表格行监听用户提交代码通过", (_, data) => {
      /**
       * submitUserId
       "submitUser": userName,
       "language": language,
       "acCount": testNumber,
       * @type {Object}
       */
      if (data["submitUserId"] === userId) {
        let newArr = [...this.state.submitArr, data["language"]]
        this.setState({
          submitArr: newArr,  // 添加语言logo
          ac: data["acCount"],   // 更新通过的测试点数量
        });
      }
    });

    SOCKET_OBJ.on(`前端对局中${roomName}房间有用户更新代码量`, this.socketHandleUpdateCodeSize);
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
    PubSub.unsubscribe(this.token2);
    const {roomName} = this.props;
    SOCKET_OBJ.off(`前端对局中${roomName}房间有用户更新代码量`, this.socketHandleUpdateCodeSize);
  }

  socketHandleUpdateCodeSize = data => {
    const {userId} = this.props;
    if (data["userId"] === userId) {
      // 是这个组件了，更新
      this.setState({codeChar: data["codeSize"]});
    }
  }

  /**
   * 获取提交次数的渲染形式
   * @param array ["python", "cpp", ... ]
   * @return {JSX.Element|*}
   */
  getSubmitArrayRend = (array) => {
    if (array.length === 0) {
      return <span>未提交</span>
    } else {
      return array.map((lanStr, i) => {
        return <span key={i} className={"languageIcon " + lanStr + "Icon"}/>
      })
    }
  }
}

export default ContestTableLine;
