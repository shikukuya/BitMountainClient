import React, {Component} from 'react';
import "./index.css";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";

class EmojiShowArea extends Component {
  constructor(props) {
    /**
     * bindUserId={userId}
     * roomName={roomName}
     */
    super(props);

    this.state = {
      msgArr: [],  // 右边的消息是最新的，左边的消息是最老的
    }
  }


  render() {
    const {msgArr} = this.state;
    return (
        <div className="components-emoji-show-area">
          {
            msgArr.map((cur, i) => {
              return (
                  <div className="msg" key={i}>
                    {cur}
                    <div className="triangle"/>
                  </div>
              )
            })
          }
        </div>
    );
  }

  componentDidMount() {
    const {roomName} = this.props;
    SOCKET_OBJ.on(`前端对局中${roomName}房间有用户发表情消息`, this.socketHandleEmoji);
  }

  socketHandleEmoji = res => {
    const {bindUserId} = this.props;
    let data = (res);
    if (USER_DATA.isPreventEmoji && data["senderId"] !== USER_DATA.id) {
      // 是别人发来的消息，屏蔽了，不显示消息
      return;
    }
    if (data["senderId"] === bindUserId) {
      // 发来的消息是要显示在这里的
      const newArr = [...this.state.msgArr, data["sendText"]];
      this.setState({msgArr: newArr});
    }
  }

  componentWillUnmount() {
    const {roomName} = this.props;
    SOCKET_OBJ.off(`前端对局中${roomName}房间有用户发表情消息`, this.socketHandleEmoji);
  }
}

export default EmojiShowArea;
