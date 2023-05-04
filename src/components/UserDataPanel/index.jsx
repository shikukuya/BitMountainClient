import React, {Component} from 'react';
import USER_DATA from "../../globalData/userData";
import {computeLevel, getLevelName} from "../../model/level";
import PubSub from "pubsub-js";

class UserDataPanel extends Component {
  render() {
    if (USER_DATA.isLogin) {

      return (
          <div className="line">
            <p>当前分数：<span>{USER_DATA.score}</span></p>
            <p>最高分数：<span>{USER_DATA.maxScore}</span></p>
            <p>胜利场数：<span>{USER_DATA.winCount}</span></p>
            <p>失败场数：<span>{USER_DATA.loseCount}</span></p>
            <p>对局总数：<span>{USER_DATA.matchCount}</span></p>
            <p>
              当前阶段：<span>{getLevelName(USER_DATA.score)}</span>
              <br/>
              <img
                  src={require(`../../levelIcon/level${computeLevel(USER_DATA.score)}.png`)}
                  alt=""/>
            </p>
            <button className="details" onClick={this.handleDetails}>查看详细信息</button>
          </div>
      );
    } else {
      return (
          <div className="line">
            <p className="pleaseLogin">请您先登录</p>
          </div>
      )
    }
  }

  handleDetails = () => {
    // 消息发布组件的一个函数中
    PubSub.publish("技能细胞面板展开并更新", USER_DATA.abilityList);
  }
}

export default UserDataPanel;
