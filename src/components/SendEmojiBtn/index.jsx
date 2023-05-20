import React, {Component} from 'react';
import "./index.css";
import USER_DATA from "../../globalData/userData";
import SOCKET_OBJ from "../../globalData/socketObject";
import {connectStr} from "../../utils/js/strTools";

class SendEmojiBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnList: ["（^▽^）", "（╥﹏╥）", "（ﾟДﾟ；）", "ヽ(`Д´)ﾉ", "好难啊", "好家伙",
        "好简单", "我也是", "我粗心了", "承让了", "我有思路了", "厉害",
        "我们加好友吧", "好的", "祝你好运", "谢谢",
      ],
      showPanel: false,
      isPrevent: USER_DATA.isPreventEmoji,
    }

  }

  render() {
    const {btnList, showPanel, isPrevent} = this.state;
    return (
        <div className="sendEmojiArea">
          <button className="sendBtn"
                  onClick={this.handleShowBtn}>
            发送消息
          </button>
          {/*下面这个面板成了 fix 定位*/}
          <div className="choicePanel"
               style={{display: showPanel ? "block" : "none"}}>
            <div className="emojis">
              {
                btnList.map((cur, i) => {
                  return (
                      <button
                          onClick={this.handleEmojiBtn}
                          key={i}>
                        {cur}
                      </button>
                  );
                })
              }
              <button className="banBtn" onClick={this.handleBanBtn}>
                {
                  isPrevent ? "解除屏蔽" : "屏蔽对方"
                }
              </button>
            </div>
          </div>
        </div>
    );
  }

  handleShowBtn = () => {
    let bool = this.state.showPanel;
    this.setState({showPanel: !bool});
  }

  /**
   * 发送表情
   * @param ev
   */
  handleEmojiBtn = (ev) => {
    this.setState({showPanel: false});
    const txt = ev.target.innerText;
    // 向后端发送消息
    SOCKET_OBJ.emit("后端接收对局中发送的表情消息", {
      "roomName": connectStr(USER_DATA.id, USER_DATA.opponent.id),
      "senderId": USER_DATA.id,
      "sendText": txt,
    })
  }

  handleBanBtn = () => {
    this.setState({showPanel: false});
    const bool = this.state.isPrevent;
    this.setState({isPrevent: !bool});
    USER_DATA.isPreventEmoji = !USER_DATA.isPreventEmoji;
  }
}

export default SendEmojiBtn;
