import React, {Component} from 'react';
import './index.css';
import getUrl from "../../utils/js/getUrl";
import SOCKET_OBJ from "../../globalData/socketObject";
import myAlert from "../../utils/js/alertMassage";
import SERVER_CONFIG from "../../utils/js/serverConfig";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      httpServerStatus: false,
      httpServerAddress: SERVER_CONFIG.address,
      socketServerStatus: false,
      socketReceiveText: "无",
      matchPoolStr: "未获取",
      userList: [],
    };
    this.socketInput = React.createRef();
  }

  render() {
    return (
        <div className="adminPage">
          <main>
            <h2>监控界面</h2>

            <div className="block">
              <div>当前的http发送地址：{this.state.httpServerAddress}</div>
              <p>http服务器状态：{this.state.httpServerStatus ? "正常" : "发育不正常"}</p>
              <button onClick={this.testHttp}>测试http服务器</button>
              <button onClick={() => {
                SERVER_CONFIG.changeToLocal();
                this.setState({httpServerAddress: SERVER_CONFIG.address});
              }}>更改http地址为本地
              </button>
              <button onClick={() => {
                SERVER_CONFIG.changeToRemote();
                this.setState({httpServerAddress: SERVER_CONFIG.address});
              }}>更改http地址为服务器
              </button>
            </div>

            <div className="block">
              <button onClick={this.testSocket}>测试socket服务器</button>
              <input type="text" placeholder="socket发送内容" maxLength={10} ref={this.socketInput}/>
              <span>socket收到的内容：{this.state.socketReceiveText}</span>
            </div>

            <div className="block">
              <p>匹配池</p>
              <button onClick={this.getMatchPoolHandle}>查看匹配池</button>
              <code>{this.state.matchPoolStr}</code>
              <p>强制匹配两个用户</p>
            </div>

            <div className="block">
              <p>当前在线人数，和具体的人</p>
              <p>当前服务器容差机制：{}</p>
              <button onClick={this.handleCloseTolerance}>关闭</button>
              <button onClick={this.handleOpenTolerance}>开启</button>
            </div>

            <div className="block">
              <p>注册用户名单
                <button>刷新</button>
                :
              </p>
              {
                this.state.userList.map(cur => {
                  return <span>{cur}</span>
                })
              }
            </div>


            <p>用户提交代码的可疑内容</p>

            <p>修改打字对决模式的限制秒数？</p>
          </main>
        </div>
    );
  }

  componentDidMount() {
    console.log(SERVER_CONFIG.address, "这就是服务器地址");

    this.testHttp();
    this.testSocket();
    SOCKET_OBJ.on("前端接受socket测试响应", data => {
      console.log(data);
      this.setState({socketReceiveText: data["sendText"]});
    });

    fetch(getUrl("getOnlineUserNum"), {
      method: 'GET',
    }).then(
        res => {
          console.log(res);
          return res.json()
        }
    ).then(
        data => {
          console.log(data)
        }
    );
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
