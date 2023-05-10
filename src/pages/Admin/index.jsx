import React, {Component} from 'react';
import './index.css';
import getUrl from "../../utils/js/getUrl";
import SOCKET_OBJ from "../../globalData/socketObject";
import myAlert from "../../utils/js/alertMassage";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      httpServerStatus: false,
      socketServerStatus: false,
      socketReceiveText: "无",
      matchPoolStr: "未获取"
    };
    this.socketInput = React.createRef();
  }

  render() {
    return (
        <div>
          <h2>监控界面</h2>
          <p>http服务器状态：{this.state.httpServerStatus ? "正常" : "发育不正常"}</p>
          <button onClick={this.testHttp}>测试http服务器</button>
          <button onClick={this.testSocket}>测试socket服务器</button>
          <input type="text" placeholder="socket发送内容" maxLength={10} ref={this.socketInput}/>
          <div>socket收到的内容：{this.state.socketReceiveText}</div>
          <div>当前的http发送地址：{window.serverAddress}</div>
          <button onClick={this.changeAddressToLocal}>更改http地址为本地</button>
          <button>更改http地址为服务器</button>
          <p>匹配池</p>
          <button onClick={this.getMatchPoolHandle}>查看匹配池</button>
          <code>{this.state.matchPoolStr}</code>
          <p>当前在线人数，和具体的人</p>
          <p>强制匹配两个用户</p>

          <p>当前服务器容差机制是否开启</p>

          <p>关闭服务器的容差机制</p>
          <button onClick={this.handleCloseTolerance}>关闭</button>
          <p>开启服务器的容差机制</p>
          <button onClick={this.handleOpenTolerance}>开启</button>

          <p>用户提交代码的可疑内容</p>

          <p>修改打字对决模式的限制秒数？</p>
          <p></p>
        </div>
    );
  }

  componentDidMount() {
    this.testHttp();
    this.testSocket();
    SOCKET_OBJ.on("前端接受socket测试响应", data => {
      console.log(data);
      this.setState({socketReceiveText: data["sendText"]});
    })
  }

  handleCloseTolerance = () => {
    fetch(getUrl("closeMatchTolerance"), {method: "GET"}).then(
        res => res.json()
    ).then(

    )
  }

  handleOpenTolerance = () => {
    fetch(getUrl("openMatchTolerance"), {method: "GET"}).then(
        res => res.json()
    ).then(

    )
  }

  changeAddressToLocal = () => {
    // 把服务器地址改为本地
    myAlert("还没做好");
    // serverAddress = 'http://127.0.0.1:10009/';
  }
  getMatchPoolHandle = () => {
    // 点击查看匹配池的按钮

    fetch(getUrl("watchMatchPool"), {
      method: 'GET',
    }).then(
        res => res.json()
    ).then(
        data => {
          if (data.hasOwnProperty("result")) {
            this.setState({matchPoolStr: data["result"]});
          } else {
            this.setState({matchPoolStr: "获取失败"});
          }
        }
    );
  }

  testSocket = () => {
    this.setState({socketServerStatus: false});
    let sendText = this.socketInput.current.value;
    SOCKET_OBJ.emit("测试", {sendText});

  }

  testHttp = () => {
    this.setState({httpServerStatus: false});

    fetch(getUrl("adminTest"), {
      method: 'GET',
    }).then(
        res => res.json()
    ).then(
        data => {
          if (data.hasOwnProperty("result") && data["result"]) {
            this.setState({httpServerStatus: true});
          } else {
            this.setState({httpServerStatus: false});
          }
        }
    );
  }

  componentWillUnmount() {
  }
}

export default Admin;
