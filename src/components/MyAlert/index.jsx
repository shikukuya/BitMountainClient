import React, {Component} from 'react';
import PubSub from "pubsub-js"
import "./index.css"


class MyAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      massageList: [],
    };
  }

  render() {
    return (
        <div className="components-my-alert-warp">
          {
            this.state.massageList.map((str, i) => {
              return <div className="massage" key={i}>{str}</div>
            })
          }
        </div>
    );
  }

  componentDidMount() {
    // 动画时间是3s
    this.token1 = PubSub.subscribe("屏幕打印接收新消息", (_, data) => {
      const newArr = [...this.state.massageList, data["text"]];
      this.setState({massageList: newArr});

      setTimeout(() => {
        newArr.pop();
        this.setState({massageList: newArr});
      }, 3000);
    });

  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
  }
}

export default MyAlert;
