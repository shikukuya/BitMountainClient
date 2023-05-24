import React, {Component} from 'react';
import "./index.css";
import PubSub from "pubsub-js";

class GobangFightItem extends Component {
  render() {
    // winnerLoc  result,
    const {history, result,} = this.props;
    return (
        <div className="components-gobang-fight-item">
          手数：{history.length}
          <span
              style={{color: this._getColor(result)}}
              className="resultText">{result}</span>

          <button
              className="lookBtn"
              onClick={this.handleLook}>查看对局
          </button>
        </div>
    );
  }

  _getColor = (str) => {
    if (str === "平局") {
      return "yellow"
    } else {
      return "green"
    }
  }
  handleLook = () => {
    // 消息发布组件的一个函数中
    const {history, winnerLoc, title} = this.props;
    PubSub.publish("五子棋棋盘更改状态", {
      history: history,
      winnerLoc: winnerLoc,
      matchName: title,
      curIndex: 0,
    });
  }
}

export default GobangFightItem;
