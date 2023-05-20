import React, {Component} from 'react';
import "./index.css";
import USER_DATA from "../../globalData/userData";
import PubSub from "pubsub-js";
import {compact} from "../../model/mechanicalAutoChess";
import {computeLevel} from "../../model/level";

class MechanicalAutoChessPlayer extends Component {
  render() {
    //head,
    const {name, score, codeSize, codeName} = this.props;
    return (
        <div className="chessPlayerItem">
          <div className="line">
            <img src={require(`../../headImgs/1.png`)}
                 className="headImg" alt="x"/>
            <span>{name}</span>
          </div>
          <div className="line">
            <span className="codeName">{codeName}</span>
          </div>
          <div className="line">
            <img src={require(`../../levelIcon/level${computeLevel(score)}.png`)}
                 className="levelImg" alt="x"/>
            <span>{score}</span>
            <button onClick={this.handleFight}>挑战</button>
          </div>
          <div className="line">
            <span className="codeSize">代码量：{codeSize}</span>
          </div>
        </div>
    );
  }

  handleFight = () => {
    let otherCode = this.props.code;  // 敌方代码
    let myCode = USER_DATA.autoChessCurrentCode;  // 我方代码
    let isFirst = Math.random() > 0.5;

    let stateObject;
    if (isFirst) {
      stateObject = compact(myCode, otherCode);
      stateObject["title"] = "我方先手"
    } else {
      stateObject = compact(otherCode, myCode);
      stateObject["title"] = "我方后手"
    }
    // fightResult 对象最终要传递到棋盘上
    // 消息发布组件的一个函数中
    PubSub.publish("机械自走棋棋盘更新对战结果", stateObject);
  }
}

export default MechanicalAutoChessPlayer;
