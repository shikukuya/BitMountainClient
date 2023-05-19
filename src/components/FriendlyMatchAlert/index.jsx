import React, {Component} from 'react';
import "./index.css";
import {computeLevel} from "../../model/level";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";
import PubSub from "pubsub-js";

class FriendlyMatchAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      moodName: "多题极限模式",
      friendData: {
        name: "xxx",
        score: 120,
        headSculpture: 1,
        id: "?"
      },
    }
  }

  render() {
    const {isShow, moodName, friendData} = this.state;

    if (isShow) {
      return (
          <div className="friendlyMatchAlert">
            <h1>有好友向您发起友谊赛</h1>
            <img
                className="headImg"
                src={require(`../../headImgs/${friendData.headSculpture}.png`)} alt="x"/>
            <div className="line">
              <span>{friendData.name}</span>
              <img
                  className="levelImg"
                  src={require(`../../levelIcon/level${computeLevel(friendData.score)}.png`)} alt="x"/>
              <span>{friendData.score}</span>
            </div>
            <p>模式：{moodName}</p>
            <button className="affirmBtn" onClick={this.handleAffirm}>接受</button>
            <button className="refuseBtn" onClick={this.handleRefuse}>拒绝</button>
          </div>
      );
    } else {
      return null;
    }

  }

  componentDidMount() {
    this.token1 = PubSub.subscribe("友谊战弹窗组件改变状态", (_, data) => {
      this.setState(data);
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token1);
  }

  handleAffirm = () => {
    this.setState({isShow: false});
    SOCKET_OBJ.emit("用户接受友谊战请求", {
      senderId: this.state.friendData.id,
      acceptId: USER_DATA.id,
      moodName: this.state.moodName,
    })
  }

  handleRefuse = () => {
    SOCKET_OBJ.emit("用户拒绝友谊战请求", {
      // 拒绝者
      // refuserName: USER_DATA.name,
      refuserId: USER_DATA.id,
      // 拒绝了谁
      // refuseUserName: this.state.friendData.name,
      refuseUserId: this.state.friendData.id,
    })
    this.setState({isShow: false});
  }
}

export default FriendlyMatchAlert;
