import React, {Component} from 'react';
import EmojiShowArea from "../EmojiShowArea";
import "./index.css";
import PubSub from "pubsub-js"

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
    const {userId} = this.props;
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

  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
  }


}

export default MultipleContestTableLine;
