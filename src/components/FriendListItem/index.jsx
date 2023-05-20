import React, {Component} from 'react';
import './index.css';
import {computeLevel} from '../../model/level';
import SOCKET_OBJ from '../../globalData/socketObject';
import USER_DATA from '../../globalData/userData';

class FriendListItem extends Component {
  constructor(props) {
    super(props);
    this.selfEle = React.createRef();
    this.state = {
      showFriendlyMatch: false,
      currentSelectMood: '普通模式',
    };
  }

  render() {
    const {userName, score, id, headSculpture} = this.props;

    return (
        <div className="friendItem" key={id} ref={this.selfEle}>
          <img
              src={require(`../../headImgs/${headSculpture}.png`)}
              alt="no"
              className="headImg"
          />
          <span className="score">
          <span>{score}</span>分
        </span>
          <img
              src={require(`../../levelIcon/level${computeLevel(score)}.png`)}
              alt=""
              className="levelImg"
          />
          <span className="name">{userName}</span>
          <span>注册时间：</span>
          <span>2019-12-24 12:20:15</span>
          <button className="delBtn" onClick={this.delHandle}>
            删除
          </button>
          <button className="matchBtn" onClick={this.contestHandle}>
            友谊赛
          </button>
          {/*<button className="detailsBtn" onClick={this.showDataHandle}>信息</button>*/}
          {/*友谊战设置面板*/}
          {this.getFriendlyMatchSettings()}
        </div>
    );
  }

  getFriendlyMatchSettings = () => {
    if (this.state.showFriendlyMatch) {
      return (
          <div className="friendlyMatchSettings">
            <button className="closeBtn" onClick={this.closeMatchSettings}>
              X
            </button>
            <select onChange={this.changeMood}>
              <option value="普通模式">普通模式</option>
              <option value="极限模式">极限模式</option>
              <option value="多题模式">多题模式</option>
              <option value="多题极限模式">多题极限模式</option>
              <option value="打字对决">打字对决</option>
            </select>
            <button className="sendBtn" onClick={this.handleSendMatch}>
              发送
            </button>
          </div>
      );
    } else {
      return null;
    }
  };

  changeMood = (ev) => {
    console.log(ev.target.value);
    this.setState({currentSelectMood: ev.target.value});
  };

  delHandle = () => {
    const {id} = this.props;

    // eslint-disable-next-line no-restricted-globals
    if (confirm('是否删除')) {
      SOCKET_OBJ.emit('后端处理删除好友', {
        senderUser: USER_DATA.id,
        receiverUser: id,
      });

      // // 前端删除这个东西  直接暂时display:None 得了
      // this.selfEle.current.style.height = '0';
      // 改成了走socket后端，成功删除，自动剔除state中的数据。
    }
  };

  contestHandle = () => {
    this.setState({showFriendlyMatch: true});
  };
  closeMatchSettings = () => {
    // 关闭友谊战设置面板
    this.setState({showFriendlyMatch: false});
  };
  // 发送友谊战消息
  handleSendMatch = () => {
    const {currentSelectMood} = this.state;

    // const { name, score, id, headSculpture } = this.props;
    const {id} = this.props;
    // 发送友谊战申请
    SOCKET_OBJ.emit('后端处理用户发起友谊战', {
      senderId: USER_DATA.id,
      receiverId: id,
      moodName: currentSelectMood,
      senderData: USER_DATA,
    });
    // 关闭友谊战设置面板
    this.setState({showFriendlyMatch: false});
  };

  componentDidMount() {
  }
}

export default FriendListItem;
