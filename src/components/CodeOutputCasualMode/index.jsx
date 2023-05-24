import React, {Component} from 'react';
import PubSub from "pubsub-js";
import "./index.css";

class CodeOutputCasualMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageArray: [],
    };
  }

  render() {
    return (
        <div className="outputArea">
          <h4>程序输出界面</h4>
          {
            this.state.messageArray.map((curText, i) => {
              return <div key={i}>{curText}</div>
            })
          }
        </div>
    );
  }


  // 接收消息的组件类中
  componentDidMount() {

    this.token1 = PubSub.subscribe("娱乐模式代码输出框重新设定消息", (_, msgArr) => {
      if (msgArr.length > 10000) {
        msgArr = msgArr.slice(-10000);
      }
      this.setState({messageArray: msgArr});
    });
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
  }
}

export default CodeOutputCasualMode;
