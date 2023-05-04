import React, {Component} from 'react';
import EmojiShowArea from "../EmojiShowArea";
import "./index.css";
import PubSub from "pubsub-js"

class MultipleContestTableLine extends Component {

  constructor(props) {
    super(props);
    const {initHp, name} = this.props;
    this.name = name;

    this.state = {
      name: name,
      hp: initHp,
      codeChar: 0,
    }
  }

  render() {
    const {name, roomName, symbolColor} = this.props;
    const {hp, codeChar} = this.state;

    return (
        <div className="multipleContestTableLine">
          <div className="box" style={{color: symbolColor}}>
            {name}
            <EmojiShowArea bindUserName={name} roomName={roomName}/>
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
    const {name} = this.props;
    /**
     * data {
     *   state
     * }
     */
    this.token1 = PubSub.subscribe(`多题表格行${name}监听掉血`, (_, data) => {
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
