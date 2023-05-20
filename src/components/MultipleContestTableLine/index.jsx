import React, {Component} from 'react';
import EmojiShowArea from "../EmojiShowArea";
import "./index.css";
import PubSub from "pubsub-js"
import SOCKET_OBJ from "../../globalData/socketObject";

class MultipleContestTableLine extends Component {

  constructor(props) {
    /**
     * props
     *
     * symbolColor="orangered"
       roomName={this.roomName}
       initHp={initHp}
       userName={userObj["userName"]}
       userId={userObj["userId"]}
     */
    super(props);
    const {initHp} = this.props;
    this.state = {
      hp: initHp,
      codeChar: 0,
    }
  }

  render() {
    const {userName, roomName, symbolColor, userId} = this.props;
    const {hp, codeChar} = this.state;

    return (
        <div className="multipleContestTableLine">
          <div className="box" style={{color: symbolColor}}>
            {userName}
            <EmojiShowArea bindUserId={userId} roomName={roomName}/>
          </div>
          <div className={hp <= 1 ? "box shakeAni" : "box"}>
            {"❤".repeat(hp)}
          </div>
          <div className="box">{codeChar}</div>
        </div>
    );
  }


  // 接收消息的组件类中
  componentDidMount() {
    const {userId, roomName} = this.props;
    /**
     * data {
     *   state
     * }
     */
    this.token1 = PubSub.subscribe(`多题表格行${userId}监听掉血`, (_, data) => {
      let n = this.state.hp;
      n--;
      if (n < 0) {
        n = 0;
      }
      this.setState({hp: n});
    });
    SOCKET_OBJ.on(`前端对局中${roomName}房间有用户更新代码量`, this.socketHandleUpdateCodeSize);
  }

  socketHandleUpdateCodeSize = data => {
    const {userId} = this.props;
    if (data["userId"] === userId) {
      // 是这个组件了，更新
      this.setState({codeChar: data["codeSize"]});
    }
  }

  componentWillUnmount() {
    const {roomName} = this.props;
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
    SOCKET_OBJ.off(`前端对局中${roomName}房间有用户更新代码量`, this.socketHandleUpdateCodeSize);
  }


}

export default MultipleContestTableLine;
