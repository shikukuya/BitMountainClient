import React, {Component} from 'react';
import "./index.css"
import { sha3_512 } from 'js-sha3';
import {zip_longest} from "../../utils/js/strTools";
import getUrl from "../../utils/js/getUrl";

class ResetPage extends Component {
  constructor(props) {
    super(props);
    this.userNameEle = React.createRef();
    this.emailEle = React.createRef();
    this.codeEle = React.createRef();
    this.passwordEle = React.createRef();
    this.passwordEle2 = React.createRef();
    this.state = {
      emailResult: "",
      emailCodeError: "",
      isPasswordSame: false,
      result: ""
    }
  }

  render() {
    return (
        <div className="resetPage">
          <main>
            <h1>重新设置密码</h1>
            <div className="line">
              <input type="text" placeholder="用户名" ref={this.userNameEle}/>
            </div>
            <p>密码忘了？请输入您最开始注册账号时候的邮箱</p>
            <div className="line">
              <input type="email" ref={this.emailEle}/>
              <button onClick={this.handleGetCode}>发送</button>
              <span className="emailRes">{this.state.emailResult}</span>
            </div>
            <br/>
            <p>请输入您邮箱收到的验证码</p>
            <div className="line">
              <input type="text" ref={this.codeEle}/>
              <span className="emailCodeRes">{this.state.emailCodeError}</span>
            </div>

            <p>请输入新的密码</p>
            <div className="line">
              <input type="password" ref={this.passwordEle} onChange={this.passwordChange}/>
              <p>再输入一遍</p>
              <input type="password" ref={this.passwordEle2} onChange={this.passwordChange}/>
              <span style={this.state.isPasswordSame ? {color: "green"} : {color: "red"}}>
                {
                  this.state.isPasswordSame ? "两次密码一致" : "两次密码不一致"
                }
              </span>
            </div>
            <button className="resetBtn" onClick={this.handleSubmit}>确认重新设置</button>
            <div className="line">{this.state.result}</div>
          </main>
        </div>
    );
  }

  passwordChange = () => {
    if (this.passwordEle.current.value === this.passwordEle2.current.value) {
      this.setState({isPasswordSame: true})
    } else {
      this.setState({isPasswordSame: false})
    }
  }
  /**
   * 发送验证码的按钮
   */
  handleGetCode = () => {

    fetch(getUrl("getEmailCode"), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userEmail: this.emailEle.current.value}),
    }).then(
        res => res.json()
    ).then(
        res => {
          if (res.status) {
            this.setState({emailResult: res["text"]});
          }
        }
    );
  }

  /**
   * 确认修改密码
   */
  handleSubmit = () => {
    const userName = this.userNameEle.current.value;
    const password = this.passwordEle.current.value;
    const email = this.emailEle.current.value;
    const emailCode = this.codeEle.current.value;
    if (!this.state.isPasswordSame) {
      return;
    }

    fetch(getUrl("resetPassword"), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userName: userName,
        newPassword: sha3_512(zip_longest(userName, password)),
        emailCode: emailCode,
        email: email
      }),
    }).then(
        res => res.json()
    ).then(
        res => {
          this.setState({result: res.text});
        }
    );
  }
}

export default ResetPage;
