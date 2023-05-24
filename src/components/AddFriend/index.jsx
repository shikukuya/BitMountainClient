import React, {Component} from 'react';
import './index.css';
import USER_DATA from '../../globalData/userData';
import SOCKET_OBJ from '../../globalData/socketObject';

class AddFriend extends Component {
  constructor(props) {
    super(props);
    this.inputIDEle = React.createRef();
    this.inputNoteEle = React.createRef();
    this.resultEle = React.createRef();

    this.state = {
      resultStr: '',
    };
  }

  render() {
    const {resultStr} = this.state;
    if (USER_DATA.isLogin) {
      return (
          <div className="components-add-friend">
            <div className="line">
              <input
                  type="text"
                  placeholder="请输入对方ID"
                  className="idInput"
                  ref={this.inputIDEle}
              />
            </div>
            <div className="line">
              <input
                  type="text"
                  placeholder="加好友的理由"
                  ref={this.inputNoteEle}
              />
              <button onClick={this.btnHandle} className="addBtn">添加</button>
              <span ref={this.resultEle} className="result">{resultStr}</span>
            </div>

          </div>
      );
    } else {
      return <div className="pleaseLogin">请您先登录</div>;
    }
  }

  componentDidMount() {
    if (USER_DATA.isLogin) {
      SOCKET_OBJ.on(`前端${USER_DATA.id}接收好友请求发送结果`, this.socketHandleRes);
    }
  }

  componentWillUnmount() {
    if (USER_DATA.isLogin) {
      SOCKET_OBJ.off(`前端${USER_DATA.id}接收好友请求发送结果`, this.socketHandleRes);
    }
  }

  socketHandleRes = (res) => {
    this.setState({resultStr: res.text});
  }

  // 添加按钮
  btnHandle = () => {
    let userInputUUID = this.inputIDEle.current.value;
    let userInputNote = this.inputNoteEle.current.value;
    // 用户输入检测
    if (userInputNote.trim() === '') {
      userInputNote = '想成为你的好友';
    }
    if (this.uuidTest(userInputUUID)) {
      this.setState({resultStr: 'id格式正确'});
      // 检测一下是不是自己
      if (userInputUUID === USER_DATA.id) {
        this.setState({resultStr: 'id不能是自己'});
        return;
      } else {
        SOCKET_OBJ.emit('后端更新添加好友请求', {
          active: USER_DATA.id,
          passive: userInputUUID,
          note: userInputNote,
        });
      }
    } else {
      this.setState({resultStr: 'id格式不对'});
    }
  };

  uuidTest = (str) => {
    return str.length === 8 + 4 + 4 + 4 + 12 + 4;
  };
}

export default AddFriend;
