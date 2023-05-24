import React, {Component} from 'react';
import PubSub from "pubsub-js"
import "./index.css";
import USER_DATA from "../../globalData/userData";

class ModeItem extends Component {
  render() {
    const {clickFunc, modeName} = this.props;
    return (
        <div className="components-mode-item"
             onMouseLeave={this.leaveHandle}
             onMouseEnter={this.enterHandle}>
          <div className="mood"
               onMouseEnter={this.enterPlaySound}
               onClick={clickFunc}>
            <p>{modeName}</p>
            <img className="moodImg"
                 src={require(`./img/${modeName}.png`)}
                 alt="天梯匹配模式图"/>
            <img src={require("../../utils/img/拳套.png")} className="leftHand" alt="拳套"/>
            <img src={require("../../utils/img/拳套.png")} className="rightHand" alt="拳套"/>
            <div className="whiteLight"/>
          </div>
        </div>
    );
  }

  /**
   * 鼠标进入
   */
  enterHandle = () => {
    const {tipText} = this.props;
    // 消息发布组件的一个函数中
    PubSub.publish("模式提示更改", {"noticeText": tipText});

    if (this.props.modeName.includes("极限")) {
      PubSub.publish("数字雨更改颜色", {"color": "red"});
    }
    if (this.props.modeName.includes("多题")) {
      PubSub.publish("数字雨更改大小", {"number": 30});
      PubSub.publish("数字雨更改速度", {"isFast": true});
    }
  }
  /**
   * 鼠标移出
   */
  leaveHandle = () => {
    PubSub.publish("模式提示更改", {"noticeText": ""});

    if (this.props.modeName.includes("极限")) {
      PubSub.publish("数字雨更改颜色", {"color": "green"});
    }

    if (this.props.modeName.includes("多题")) {
      PubSub.publish("数字雨更改大小", {"number": 3});
      PubSub.publish("数字雨更改速度", {"isFast": false});
    }

  }


  enterPlaySound = () => {
    if (!USER_DATA.isSoundEnabled) {
      return;
    }
    const {modeName} = this.props;
    // 音效

    let sound = new Audio(require(`../../utils/sound/${this.getSoundByText(modeName)}.mp3`));
    sound.volume = 0.4;
    sound.play().then(() => {
      sound = null;
    });
  }
  getSoundByText = (text) => {
    if (text.includes("极限")) {
      return "增三和弦";
    } else if (["普通模式", "多题模式"].includes(text)) {
      return "减三和弦";
    } else {
      return "小三和弦";
    }
  }
}

export default ModeItem;
