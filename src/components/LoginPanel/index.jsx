import React, { Component } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import USER_DATA from '../../globalData/userData';
import { zip_longest } from '../../utils/js/strTools';
import { sha3_512 } from 'js-sha3';
import getUrl from '../../utils/js/getUrl';
import PubSub from 'pubsub-js';

class LoginPanel extends Component {
  constructor(props) {
    super(props);

    this.inputUserNameEle = React.createRef();
    this.inputPasswordEle = React.createRef();
    this.inputEmailEle = React.createRef();
    this.inputCodeEle = React.createRef();
    this.afirmEle = React.createRef();
    this.keepLoginEle = React.createRef();
    this.passwordHintEle = React.createRef();
    this.emailMoodHintEle = React.createRef();
    this.bottomLine = React.createRef();

    this.hideStyle = {
      zIndex: '-1000',
      display: 'none',
    };
    this.showStyle = {
      display: 'block',
      zIndex: '100',
    };
    this.state = {
      // 只有两种模式，是否是用户名密码的模式
      isPasswordMood: true,
      gotoLink: <div />,

      isLoginWaiting: false, // 点击登录按钮之后处于等待状态
    };
  }

  closeHandle = () => {
    this.props.closeFunc();
  };

  handleEmailMood = () => {
    this.setState({ isPasswordMood: false });
  };

  handleChangePassMood = () => {
    this.setState({ isPasswordMood: true });
  };

  render() {
    let curStyle;
    if (this.props.show) {
      curStyle = this.showStyle;
    } else {
      curStyle = this.hideStyle;
    }
    const { gotoLink } = this.state;

    return (
      <div className="loginPanel" style={curStyle}>
        {gotoLink}
        <div className="blackGround" />
        <div className="panel">
          <div className="close" onClick={this.closeHandle}>
            X
          </div>
          <div className="topLine">
            <img
              src={require('../../utils/img/bitMountainLogo.png')}
              alt=""
              className="logoImg"
            />
            <span>比特山</span>
          </div>
          {this.getDivByMood()}

          <div className="bottomLine" ref={this.bottomLine}>
            <input ref={this.afirmEle} type="checkbox" />
            <span>我同意</span>
            <NavLink
              className=""
              to="/termsAndConditions"
              onClick={this.closeHandle}
            >
              《用户协议》
            </NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input ref={this.keepLoginEle} type="checkbox" />
            <span>记住我</span>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 根据当前的状态返回面板中的部分区域div
   * @return {JSX.Element}
   */
  getDivByMood = () => {
    const { isLoginWaiting } = this.state;
    if (this.state.isPasswordMood) {
      return (
        <div className="passwordMood">
          <p className="moodTitle">用户名密码登录</p>
          <input
            ref={this.inputUserNameEle}
            className="inputLine"
            type="text"
            placeholder="用户名"
          />
          <input
            ref={this.inputPasswordEle}
            className="inputLine"
            type="password"
            placeholder="密码"
          />
          <button
            className={isLoginWaiting ? 'loginButton loginWait' : 'loginButton'}
            onClick={this.handlePasswordLogin}
          >
            {isLoginWaiting ? '登录中请等待……' : '登录'}
          </button>

          <div className="subLine">
            <div className="left">
              <p onClick={this.handleEmailMood}>邮箱验证码登录</p>
            </div>
            <div className="right">
              <NavLink to="/reset" onClick={this.handleForgetPassword}>
                忘记密码
              </NavLink>
            </div>
          </div>
          <div className="passwordMoodHint" ref={this.passwordHintEle} />
        </div>
      );
    } else {
      return (
        <div className="emailMood">
          <p className="moodTitle">邮箱验证登录</p>
          <input
            ref={this.inputEmailEle}
            className="inputLine"
            type="text"
            placeholder="输入邮箱"
          />
          <div className="inputLine">
            <input
              ref={this.inputCodeEle}
              className="inputCode"
              type="text"
              placeholder="验证码"
            />
            <button className="getCodeBtn" onClick={this.handleGetCode}>
              获取验证码
            </button>
          </div>

          <button
            className={isLoginWaiting ? 'loginButton loginWait' : 'loginButton'}
            onClick={this.handleEmailLogin}
          >
            {isLoginWaiting ? '登录中请等待……' : '登录'}
          </button>

          <div className="subLine">
            <div className="left">
              <p onClick={this.handleChangePassMood}>用账号密码登录</p>
            </div>
          </div>
          <div className="emailMoodHint" ref={this.emailMoodHintEle} />
        </div>
      );
    }
  };

  /**
   * 用户密码登录按钮点击
   */
  handlePasswordLogin = () => {
    let userName = this.inputUserNameEle.current.value;
    let password = this.inputPasswordEle.current.value;

    if (!this.afirmEle.current.checked) {
      // 还没选中
      this.bottomLine.current.classList.add('shakeClass');
      setTimeout(() => {
        this.bottomLine.current.classList.remove('shakeClass');
      }, 500);
      return;
    }
    // 防止重复点击
    if (this.state.isLoginWaiting) {
      return;
    }
    this.setState({ isLoginWaiting: true });

    fetch(getUrl('loginByPassword'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: userName,
        password: sha3_512(zip_longest(userName, password)),
      }),
    })
      .then((res) => {
        this.setState({ isLoginWaiting: false });
        return res.json();
      })
      .then((res) => {
        if (res.status) {
          // 登录成功了，更改设置

          USER_DATA.name = res['userDetails'].userName;
          USER_DATA.isLogin = true;
          USER_DATA.id = res['userDetails'].id;
          USER_DATA.email = res['userDetails'].email;
          USER_DATA.headSculpture = res['userDetails'].headSculpture;
          USER_DATA.score = res['userDetails'].score;
          USER_DATA.maxScore = res['userDetails'].maxScore;
          USER_DATA.winCount = res['userDetails'].winCount;
          USER_DATA.loseCount = res['userDetails'].loseCount;
          USER_DATA.matchCount = res['userDetails'].matchCount;
          USER_DATA.lastOnline = res['userDetails'].lastOnline;

          if (this.keepLoginEle.current.checked) {
            localStorage.setItem('USER_DATA', JSON.stringify(USER_DATA));
          }

          this.props.closeFunc(); // 关闭面板
          // fixme 跳转到home界面
        } else {
          // 登录失败了
          this.passwordHintEle.current.innerHTML = res.text;
        }
      });
  };

  /**
   * 忘记密码
   */
  handleForgetPassword = () => {
    PubSub.publish('导航栏修改模式', { isLoginShow: false });
  };

  /**
   * 通过邮箱获取验证码的按钮
   */
  handleGetCode = () => {
    let email = this.inputEmailEle.current.value;

    fetch(getUrl('getEmailCode'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: email,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.emailMoodHintEle.current.innerText = res.text;
      });
  };
  /**
   * 用电子邮件验证码登录
   */
  handleEmailLogin = () => {
    let email = this.inputEmailEle.current.value;
    let code = this.inputCodeEle.current.value;
    // 防止重复点击
    if (this.state.isLoginWaiting) {
      return;
    }
    this.setState({ isLoginWaiting: true });

    fetch(getUrl('loginByEmail'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: email,
        emailCode: code,
      }),
    })
      .then((res) => {
        this.setState({ isLoginWaiting: false });
        return res.json();
      })
      .then((res) => {
        console.log(res);

        if (res.status) {
          // 登录成功，接收到用户名，继续获取用户信息
          const userName = res.userName;
          USER_DATA.isLogin = true;
          USER_DATA.name = userName;
          // todo
        } else {
          // 登录失败，打印原因
        }
      });
  };
}

export default LoginPanel;
