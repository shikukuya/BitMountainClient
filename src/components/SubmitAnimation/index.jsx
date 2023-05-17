import React, {Component} from 'react';
import "./index.css";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";
import PubSub from "pubsub-js";

class SubmitAnimation extends Component {
  constructor(props) {
    super(props);
    this.roomName = this.props.roomName;

    this.state = {
      /**
       * ✔ 正确
       * 🕷 代码错误
       * 🐢 超时
       * 💽 输出过多
       * ❌ 答案错误
       */
      charArr: [" ", " ", " ", " ", " "],
      isShow: false
    }
  }

  render() {
    if (this.state.isShow) {
      return (
          <div className="submitAniArea">
            <h2>通过测试点</h2>
            <div className="allArea">
              {
                this.state.charArr.map((cur, i) => {
                  return (
                      <div className="area" key={i}>
                        {cur}
                      </div>
                  )
                })
              }
            </div>
          </div>
      );
    } else {
      return null;
    }
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
    SOCKET_OBJ.off(`前端单挑模式${this.roomName}房间有用户更新测试点`, this.socketHandleUpdateAcPoint);
  }

  componentDidMount() {
    this.token1 = PubSub.subscribe("单挑模式提交结果面板更改状态", (_, data) => {
      this.setState(data);
    });

    SOCKET_OBJ.on(`前端单挑模式${this.roomName}房间有用户更新测试点`, this.socketHandleUpdateAcPoint);
  }

  socketHandleUpdateAcPoint = res => {
    const data = (res);

    if (data["submitUser"] !== USER_DATA.name) {
      return;
    }
    console.log("接收到了测试点通过与否的消息", data["result"], data["index"]);

    const newArr = [...this.state.charArr];
    newArr[data["index"]] = data["result"];
    this.setState({charArr: newArr, isShow: true});

    if (data["result"] !== "✔" || data["index"] === 4) {
      // 出错了
      setTimeout(() => {
        this.setState({isShow: false});
      }, 1000);
    }
  }

}

export default SubmitAnimation;
