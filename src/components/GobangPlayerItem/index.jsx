import React, {Component} from 'react';
import {computeLevel} from "../../model/level";
import "./index.css";
import USER_DATA from "../../globalData/userData";
import PubSub from "pubsub-js"
import myAlert from "../../utils/js/alertMassage";

class GobangPlayerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 是否允许点击
      isAllowClick: true,
    };
  }

  render() {
    const {
      userDetails,
      codeName, codeSize, rank,
      winCount, loseCount
    } = this.props;
    const {isAllowClick} = this.state;
    return (
        <div className="components-gobang-player-item">
          <div className="rankNumber">{rank}</div>
          <div className="headImgArea">
            <img src={require(`../../headImgs/${userDetails.headSculpture}.png`)}
                 className="headImg"
                 alt=""/>
          </div>
          <div className="userDataArea">
            <div className="line">
              <span className="userName">{userDetails.userName}</span>
            </div>
            <div className="line">
              <img src={require(`../../levelIcon/level${computeLevel(userDetails.score)}.png`)}
                   className="levelImg"
                   alt=""/>
              <span className="score">{userDetails.score}</span>
            </div>
            <div className="line">
              {isAllowClick ? <button onClick={this.handleFight}>点他单挑</button> : <span>请稍等……</span>}
            </div>
          </div>
          <div className="codeArea">
            <div className="line">
              <span>{codeName}</span>
            </div>
            <div className="line">
              <span className="codeSize">代码量：{codeSize}</span>
            </div>
            <div className="line">
              <span className="scoreText">胜：{winCount}</span>
            </div>
            <div className="line">
              <span className="scoreText">败：{loseCount}</span>
            </div>
            <div className="line">
              <span className="scoreText">
                胜率：{this.calculateWinRate(winCount, loseCount)}%
              </span>
            </div>

          </div>
        </div>
    );
  }

  calculateWinRate = (winCount, loseCount) => {
    if (winCount === 0 && loseCount === 0) {
      return 100;
    } else {
      return Math.floor((winCount / (winCount + loseCount)) * 100);
    }
  }

  componentDidMount() {
    this.token1 = PubSub.subscribe("五子棋一条玩家更改状态", (_, data) => {
      this.setState(data);
    });
  }
  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
  }

  /**
   * 挑战对方
   */
  handleFight = () => {
    if (!USER_DATA.isLogin) {
      myAlert("请您先登录");
      return;
    }

    // 自己不能挑战自己
    if (USER_DATA.id === this.props.userDetails.id) {
      myAlert("自己不能挑战自己");
      return;
    }
    // 不能再点击了，让所有的都不能点击
    PubSub.publish("五子棋一条玩家更改状态", {
      isAllowClick: false,
    });

    this.props.fightFunc(this.props.userDetails.id);

  }

}

export default GobangPlayerItem;
