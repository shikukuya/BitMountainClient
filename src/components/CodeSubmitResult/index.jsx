import React, {Component} from 'react';
import "./index.css";
import PubSub from "pubsub-js"

/**
 * 代码提交结果框，可以展开和收起
 */
class CodeSubmitResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 提交错误的标签，是超时了还是咋了
      result: "",
      // 代码错误的详细报错信息
      errData: "",
      // 是否展开
      isShow: false,
    };

  }

  render() {
    const {result, errData, isShow} = this.state;
    return (
        <div className="codeResult" style={{bottom: isShow ? "0" : "-150px"}}>
          <p>上次错误原因：<span className="err">{result}</span></p>
          <div className="close" onClick={this.closeCodeResult}>
            {isShow ? "收" : "展"}
          </div>
          <div className="wrongData">{errData}</div>
        </div>
    );
  }

  closeCodeResult = () => {
    const bool = this.state.isShow;
    this.setState({isShow: !bool});
  }

  componentDidMount() {
    this.token = PubSub.subscribe("代码结果框更新状态", (_, data) => {
      this.setState(data);
    });

  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token);
  }
}

export default CodeSubmitResult;
