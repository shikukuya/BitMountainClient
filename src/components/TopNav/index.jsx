import React, {Component} from 'react';
import './index.css';

import {Navigate, NavLink} from 'react-router-dom';
import LoginPanel from '../LoginPanel';
import USER_DATA from '../../globalData/userData';
import {computeLevel} from '../../model/level';
import PubSub from 'pubsub-js';
import {connectStr} from '../../utils/js/strTools';
import SOCKET_OBJ from '../../globalData/socketObject';
import MyAlert from '../MyAlert';
import {pauseBackgroundMusic, playBackgroundMusic,} from '../../utils/js/backgroundMusic';
import FriendlyMatchAlert from '../FriendlyMatchAlert';
import myAlert from '../../utils/js/alertMassage';

class TopNav extends Component {
  constructor(props) {
    super(props);
    // USER_DATA
    const a = JSON.parse(localStorage.getItem('USER_DATA'));
    if (a) {
      Object.keys(a).forEach((key) => {
        USER_DATA[key] = a[key];
      });
    }
  }

  state = {
    // 是否展示登录面板
    isLoginShow: false,
    // 玩家是否在对局
    isUserPlaying: false,
    // 当前的游戏模式
    modeName: '什么模式',
    // 音乐是否开启
    isMusicPlay: false,
    // 音效是否开启
    isSoundPlay: false,
    // 跳转链接
    gotoLink: <div/>,
  };

  render() {
    return (
        <div className="top-nav">
          <div className="left">
            <img
                className="LOGO"
                src={require('../../utils/img/bitMountainLogo.png')}
                alt=""
            />
            <div className="title">比特山</div>
          </div>
          {this.getMiddleEle()}
          {this.getRightEle()}

          {/*一个小小的登录面板*/}
          <LoginPanel show={this.state.isLoginShow} closeFunc={this.closeLogin}/>
          {/*接收弹窗的地方*/}
          <MyAlert/>
          {/*用绝对定位贴上一个音乐开关控制按钮*/}
          <span className="musicBtn" onClick={this.handleMusicPlay}>
          {this.state.isMusicPlay ? '🎼' : '🔇'}
        </span>
          <span className="soundBtn" onClick={this.handleSoundPlay}>
          {this.state.isSoundPlay ? '🔊' : '🔇'}
        </span>
          {/*友谊赛弹窗*/}
          <FriendlyMatchAlert/>
          {/*跳转链接*/}
          {this.state.gotoLink}
        </div>
    );
  }

  getMiddleEle = () => {
    if (this.state.isUserPlaying) {
      // 用户正在对局
      return (
          <div className="middle">
            <p>{this.state.modeName}</p>
            <div className="user">
              <img
                  src={require(`../../headImgs/${USER_DATA.headSculpture}.png`)}
                  alt="no"
              />
              <span className="userName">{USER_DATA.name}</span>
              <img
                  className="userLevel"
                  src={require(`../../levelIcon/level${computeLevel(
                      USER_DATA.score
                  )}.png`)}
                  alt=""
              />
              <span className="score">{USER_DATA.score}</span>
            </div>
            <p className="VS">VS</p>
            <div className="user">
              <img
                  src={require(`../../headImgs/${USER_DATA.opponent.headSculpture}.png`)}
                  alt="no"
              />
              <span className="userName">{USER_DATA.opponent.name}</span>
              <img
                  className="userLevel"
                  src={require(`../../levelIcon/level${computeLevel(
                      USER_DATA.opponent.score
                  )}.png`)}
                  alt=""
              />
              <span className="score">{USER_DATA.opponent.score}</span>
            </div>
          </div>
      );
    } else {
      // 用户没有在对局
      return (
          <ul className="middle">
            <li>
              <NavLink className="clickItem" to="/home">
                首页
                <div className="lightDote"/>
              </NavLink>
            </li>
            <li>
              <NavLink className="clickItem" to="/friend">
                好友
                <div className="lightDote"/>
              </NavLink>
            </li>
            <li>
              <NavLink className="clickItem" to="/match-history">
                历史对局
                <div className="lightDote"/>
              </NavLink>
            </li>
            <li>
              <NavLink className="clickItem" to="/rule">
                规则介绍
                <div className="lightDote"/>
              </NavLink>
            </li>
            <li>
              <NavLink className="clickItem" to="/honorPath">
                荣誉之路
                <div className="lightDote"/>
              </NavLink>
            </li>
          </ul>
      );
    }
  };

  getRightEle = () => {
    if (this.state.isUserPlaying) {
      return (
          <div className="right">
            <NavLink
                className="clickItem exitContest"
                to="/home"
                onClick={this.handleExitContest}
            >
              退出对局
            </NavLink>
          </div>
      );
    }
    if (USER_DATA.isLogin) {
      return (
          <div className="right">
            <img
                src={require(`../../headImgs/${USER_DATA.headSculpture}.png`)}
                alt=""
                className="headImg"
            />
            <span className="userName">{USER_DATA.name}</span>
            <img
                className="userLevel"
                src={require(`../../levelIcon/level${computeLevel(
                    USER_DATA.score
                )}.png`)}
                alt=""
            />
            <span className="score">{USER_DATA.score}分</span>

            {/* <span className="login" onClick={this.handleLogin}>
            更换账号
          </span> */}
            <span className="exit" onClick={this.handleExit}>
            退出登录
          </span>
            {/*<NavLink className="register" to="/register">注册新用户</NavLink>*/}
          </div>
      );
    } else {
      return (
          <div className="right">
            <img src={require('./defaultUser.png')} alt="" className="headImg"/>
            <span className="login" onClick={this.handleLogin}>
            登录
          </span>
            <NavLink className="register" to="/register">
              注册
            </NavLink>
          </div>
      );
    }
  };

  componentDidMount() {
    this.pubSub1 = PubSub.subscribe('导航栏修改模式', (_, data) => {
      this.setState(data);
    });

    // 不停的检测是否是登录状态
    let checkInterval = setInterval(() => {
      if (USER_DATA.isLogin) {
        // 登录后收到消息
        SOCKET_OBJ.on(`前端用户${USER_DATA.name}接收友谊战申请`, this.socketHandleFriendlyContestReq);
        SOCKET_OBJ.on(`前端用户${USER_DATA.name}友谊战申请被拒绝`, this.socketHandleFriendlyContestRefuse);
        SOCKET_OBJ.on(`前端用户${USER_DATA.name}友谊战申请被接受`, this.socketHandleFriendlyContestAccept);
        SOCKET_OBJ.on(`前端用户${USER_DATA.name}进入友谊战`, this.socketHandleFriendlyContestStart);
        clearInterval(checkInterval);
      }
      this.render();
    }, 500);
  }
  socketHandleFriendlyContestReq = (res) => {
    let data = res;
    myAlert('收到了友谊战申请消息');
    PubSub.publish('友谊战弹窗组件改变状态', {
      isShow: true,
      moodName: data['moodName'],
      friendData: data['senderData'],
    });
  }
  socketHandleFriendlyContestRefuse = (res) => {
    myAlert(`${res['refuserName']}拒绝了您的友谊战申请`);
  }
  socketHandleFriendlyContestAccept = (res) => {
    myAlert(`${res['acceptName']}接受了您的友谊战申请`);
  }
  socketHandleFriendlyContestStart = (res) => {
    let data = res;
    USER_DATA.opponent.name = data['opponent'];
    USER_DATA.opponent.score = data['opponentScore'];
    USER_DATA.opponent.headSculpture = data['opponentHeadSculpture'];
    USER_DATA.typewriteTitle = data['typewriteTitle'];
    USER_DATA.questionObjList = data['randomQuestionList'];
    switch (data['mood']) {
      case '普通模式':
        this.setState({gotoLink: <Navigate to="/normalContest"/>});
        break;
      case '极限模式':
        this.setState({gotoLink: <Navigate to="/hardcoreContest"/>});
        break;
      case '多题模式':
        this.setState({gotoLink: <Navigate to="/multipleContest"/>});
        break;
      case '多题极限模式':
        this.setState({gotoLink: <Navigate to="/hardMoreContest"/>});
        break;
      case '打字对决':
        this.setState({gotoLink: <Navigate to="/typewritingContest"/>});
        break;
    }
    // 再改回来，防止无限递归？
    setTimeout(() => {
      this.setState({gotoLink: <div/>});
    }, 500);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubSub1);

    SOCKET_OBJ.off(`前端用户${USER_DATA.name}接收友谊战申请`, this.socketHandleFriendlyContestReq);
    SOCKET_OBJ.off(`前端用户${USER_DATA.name}友谊战申请被拒绝`, this.socketHandleFriendlyContestRefuse);
    SOCKET_OBJ.off(`前端用户${USER_DATA.name}友谊战申请被接受`, this.socketHandleFriendlyContestAccept);
    SOCKET_OBJ.off(`前端用户${USER_DATA.name}进入友谊战`, this.socketHandleFriendlyContestStart);
  }

  handleMusicPlay = () => {
    let bool = this.state.isMusicPlay;
    this.setState({isMusicPlay: !bool});
    USER_DATA.isMusicEnabled = !bool;

    let sound = new Audio(require('../../utils/sound/点击音效.mp3'));
    sound.play().then(() => {
      sound = null;
    });

    if (!bool) {
      playBackgroundMusic();
    } else {
      pauseBackgroundMusic();
    }
  };

  handleSoundPlay = () => {
    let bool = this.state.isSoundPlay;
    this.setState({isSoundPlay: !bool});
    let sound = new Audio(require('../../utils/sound/点击音效.mp3'));
    sound.play().then(() => {
      sound = null;
    });

    USER_DATA.isSoundEnabled = !bool;
  };

  /**
   * 用户退出对局按钮点击
   */
  handleExitContest = () => {
    // 先退出的用户直接导致自己认输，对方获胜

    let contestName = connectStr(USER_DATA.name, USER_DATA.opponent.name);

    SOCKET_OBJ.emit('后端处理玩家认输比赛', {
      contestName: contestName,
      exitPlayerName: USER_DATA.name,
    });

    // 更新USER.对手 的信息，让他变成一个默认的无效
    USER_DATA.opponent.name = "xxx";

    this.setState({isUserPlaying: false});
  };
  /**
   * 关闭登录界面
   */
  closeLogin = () => {
    this.setState({isLoginShow: false});
  };
  /**
   * 跳转到登录界面
   */
  handleLogin = () => {
    this.setState({isLoginShow: true});
  };
  /**
   * 退出登录
   */
  handleExit = () => {
    localStorage.removeItem('USER_DATA');
    window.location.reload();
  };
}

export default TopNav;
