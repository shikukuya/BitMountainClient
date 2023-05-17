import React, {Component} from 'react';
import {computeLevel} from "../../model/level";
import "./index.css";
import USER_DATA from "../../globalData/userData";
import {fight} from "../../model/gobang";
import PubSub from "pubsub-js"

class GobangPlayerItem extends Component {
  render() {
    const {name, score, headSculpture, codeName, codeSize} = this.props;

    return (
        <div className="personItem">
          <div className="line">
            <img src={require(`../../headImgs/${headSculpture}.png`)}
                 className="headImg"
                 alt=""/>
            <span className="userName">{name}</span>
          </div>
          <div className="line">
            <span className="codeName">{codeName}</span>
          </div>
          <div className="line">
            <img src={require(`../../levelIcon/level${computeLevel(score)}.png`)}
                 className="levelImg"
                 alt=""/>
            <span className="score">{score}</span>
            <button onClick={this.handleFight}>挑战</button>
          </div>
          <div className="line">
            <span className="codeSize">代码量：{codeSize}</span>
          </div>
        </div>
    );
  }

  componentDidMount() {

  }

  /**
   * 挑战对方
   */
  handleFight = () => {
    let otherCode = this.props.code;  // 敌方代码
    let myCode = USER_DATA.gobangCurrentCode;  // 我方代码
    let fightResult = {
      firstResList: [],
      secondResList: [],
    };
    // 三场先手三场后手，最后pubsub发送给右侧栏
    for (let i = 0; i < 3; i++) {
      fightResult.firstResList.push(fight(myCode, otherCode));
    }
    for (let i = 0; i < 3; i++) {
      fightResult.secondResList.push(fight(otherCode, myCode));
    }

    // 消息发布组件的一个函数中
    PubSub.publish("五子棋界面更新挑战信息", {fightResult: fightResult});
  }

}

export default GobangPlayerItem;
