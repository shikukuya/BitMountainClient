import React, {Component} from 'react';
import "./index.css";
import getArray from "../../utils/js/range";
import {zip_longest} from "../../utils/js/strTools";
import {sha3_512} from 'js-sha3';
import getUrl from "../../utils/js/getUrl";
import myAlert from "../../utils/js/alertMassage";
import {randint} from "../../utils/js/random";
import Background from "../../components/Background";

class Register extends Component {
  constructor(props) {
    super(props);
    this.testImgEle = React.createRef();
    // 一些结果的元素
    this.userNameResultEle = React.createRef();
    this.passwordResultEle = React.createRef();
    this.secPasswordResEle = React.createRef();
    this.emailResEle = React.createRef();
    this.emailCodeResEle = React.createRef();
    this.testCodeResEle = React.createRef();
    this.registerRes = React.createRef();
    this.curHeadEle = React.createRef();

    this.userInputData = {
      userName: "???",
      password: "????",
      email: "??",
      headSculpture: randint(0, 8),
      emailCode: "??",
    }
    this.allow = {
      userName: false,
      password: false,
      secPassword: false,
      email: false,
      testCode: false,
    }
    // ----
    this.imgAnswer = "";

    this.state = {
      getEmailCodeTime: 0,  // 60
      changeTestCodeTime: 0, // 3
    }
  }

  render() {
    const {changeTestCodeTime, getEmailCodeTime} = this.state;
    return (
        <div className="registerPage">
          <main>
            <h1>注册界面</h1>
            <div className="line">
              <input type="text" placeholder="用户名" onInput={this.userNameInputHandle}/>
              <span className="result" ref={this.userNameResultEle}/>
            </div>
            <div className="line">
              <span>用户名要求：请不要包涵 <code>?\/+-*=&lt;&^%$#@!</code> 这类英文特殊符号和空格，可以用中文</span>
            </div>
            <div className="headImgArea">
              <p>请选择一个您喜欢的头像</p>
              {
                getArray(9).map(cur => {
                  return (
                      <img src={require(`../../headImgs/${cur}.png`)}
                           key={cur}
                           alt="no"
                           onClick={this.selectHeadHandle(cur)}/>
                  )
                })
              }
              <p>您的选择：</p>
              <img src={require(`../../headImgs/${this.userInputData.headSculpture}.png`)} alt="no"
                   ref={this.curHeadEle}/>

            </div>
            <div className="line">
              <input type="password" placeholder="密码" onInput={this.passwordInputHandle}/>
              <span className="result" ref={this.passwordResultEle}/>
            </div>
            <div className="line">
              <span>密码长度需要至少为8个字符，密码可以写中文！</span>
            </div>
            <div className="line">
              <input type="password" placeholder="第二次输入密码" onInput={this.secPasswordInputHandle}/>
              <span className="result" ref={this.secPasswordResEle}/>
            </div>
            <div className="line">
              <input type="email" placeholder="邮箱" onInput={this.emailInputHandle}/>
              <span className="result" ref={this.emailResEle}/>
            </div>
            <div className="line">
              <input type="text" placeholder="邮箱收到的验证码" onInput={this.emailCodeInputHandle}/>
              <button onClick={this.getEmailCodeHandle} className={getEmailCodeTime > 0 ? "banBtn" : ""}>
                {getEmailCodeTime > 0 ? `邮件发送冷却中，${getEmailCodeTime}...` : "获取验证码"}
              </button>
              <span className="result" ref={this.emailCodeResEle}/>
            </div>
            <div className="testImgArea">
              <img alt="b" ref={this.testImgEle}/>
              <p>请根据图片中的文字猜测古诗词句，以此证明您不是机器人、爬虫</p>
            </div>
            <div className="line">
              <input type="text" placeholder="古诗词验证码" onInput={this.testCodeInputHandle}/>
              <button onClick={this.changeTestCodeImg} className={changeTestCodeTime > 0 ? "banBtn" : ""}>
                {changeTestCodeTime > 0 ? `随机图片生成器冷却中……${changeTestCodeTime}` : "看不懂，换一个"}
              </button>
              <span className="result" ref={this.testCodeResEle}/>

            </div>
            <div className="line">
              <button className="confirmBtn" onClick={this.confirmBtnHandle}>确认注册</button>
              <span ref={this.registerRes}/>
            </div>
          </main>
          <Background/>
        </div>
    );
  }

  //
  selectHeadHandle = (num) => {
    return () => {
      this.userInputData.headSculpture = num;
      this.curHeadEle.current.src = require(`../../headImgs/${num}.png`);
    }

  }

  // 用户名输入绑定函数
  userNameInputHandle = ev => {
    let str = ev.target.value;
    this.userInputData.userName = str;

    function haveBanChar(strings) {
      for (let c of strings) {
        if ("^></\\+-*&^% $#@!".includes(c)) {
          return true;
        }
      }
      return false;
    }

    if (str.trim() === "") {
      this.userNameResultEle.current.innerText = "用户名不能为空！";
      this.userNameResultEle.current.style.color = "orangered";
      this.allow.userName = false;
    } else if (haveBanChar(str)) {
      this.userNameResultEle.current.innerText = "用户名不能含有^/+*等非法英文字符！";
      this.userNameResultEle.current.style.color = "orangered";
      this.allow.userName = false;
    } else {
      this.userNameResultEle.current.innerText = "您的用户名合法✓";
      this.userNameResultEle.current.style.color = "greenyellow";
      this.allow.userName = true;
    }

  }
  passwordInputHandle = ev => {
    const str = ev.target.value;
    this.userInputData.password = str;

    if (str.trim() === "") {
      this.passwordResultEle.current.innerText = "密码不能为空哈！😒";
      this.passwordResultEle.current.style.color = "orangered";
      this.allow.password = false;

    } else if (str.length < 6) {
      this.passwordResultEle.current.innerText = "您的密码太简单了吧😥";
      this.passwordResultEle.current.style.color = "yellow";
      this.allow.password = true;
    } else if (str.length < 12) {
      this.passwordResultEle.current.innerText = "密码安全程度：中等👌";
      this.passwordResultEle.current.style.color = "greenyellow";
      this.allow.password = true;
    } else if (str.length <= 16) {
      this.passwordResultEle.current.innerText = "密码安全程度：高级👍";
      this.passwordResultEle.current.style.color = "lawngreen";
      this.allow.password = true;
    } else if (str.length > 16) {
      this.passwordResultEle.current.innerText = "密码安全程度：过于复杂😁，若您能记得住也无妨";
      this.passwordResultEle.current.style.color = "yellow";
      this.allow.password = true;
    }
    this.userInputData.password = str;
  }

  secPasswordInputHandle = ev => {
    let str = ev.target.value;
    this.userInputData.emailCode = str;

    if (str === this.userInputData.password) {
      this.secPasswordResEle.current.innerText = "两次密码输入一致✓";
      this.secPasswordResEle.current.style.color = "lawngreen";
      this.allow.secPassword = true;
    } else {
      this.secPasswordResEle.current.innerText = "两次密码输入不一样😂";
      this.secPasswordResEle.current.style.color = "orangered";
      this.allow.secPassword = false;
    }
  }
  emailInputHandle = ev => {
    let str = ev.target.value;
    this.userInputData.email = str;

    function validateEmail(email) {
      let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    if (validateEmail(str)) {
      this.emailResEle.current.innerText = "邮箱符合规范！";
      this.emailResEle.current.style.color = "lawngreen";
      this.allow.email = true;
    } else {
      this.emailResEle.current.innerText = "邮箱不合法！";
      this.emailResEle.current.style.color = "orangered";
      this.allow.email = false;
    }
  }

  emailCodeInputHandle = ev => {
    this.userInputData.emailCode = ev.target.value;
  }

  testCodeInputHandle = ev => {
    let str = ev.target.value;
    if (sha3_512(str) === this.imgAnswer) {
      this.testCodeResEle.current.innerText = "回答正确！您真棒";
      this.testCodeResEle.current.style.color = "lawngreen";
      this.allow.testCode = true;
    } else {
      this.testCodeResEle.current.innerText = "回答错误！您真菜";
      this.testCodeResEle.current.style.color = "orangered";
      this.allow.testCode = false;
    }
  }

  /**
   * 获取邮箱验证码的按钮
   */
  getEmailCodeHandle = () => {
    // 先检测邮箱是否合法
    if (!this.allow.email) {
      this.emailCodeResEle.current.innerText = "邮箱不合法";
      return;
    }
    if (this.state.getEmailCodeTime > 0) {
      // 还在冷却时间
      return;
    }
    this.setState({getEmailCodeTime: 60});
    let emailInterval = setInterval(() => {
      let t = this.state.getEmailCodeTime - 1;
      if (t >= 0) {
        this.setState({getEmailCodeTime: t});
      } else {
        clearInterval(emailInterval);
      }
    }, 1000);

    fetch(getUrl("getEmailCodeByRegister"), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userEmail: this.userInputData.email
      }),
    }).then(
        res => res.json()
    ).then(
        res => {
          this.emailCodeResEle.current.innerText = res.text;
          this.emailCodeResEle.current.style.color = "greenyellow";
        }
    );
  }
  /**
   * 换一张防机器人的验证码图片
   */
  changeTestCodeImg = () => {
    if (this.state.changeTestCodeTime > 0) {
      // myAlert("请稍等");
    } else {
      this.getTestImg();
      this.setState({changeTestCodeTime: 3});
      let changeCodeInterval = setInterval(() => {
        let n = this.state.changeTestCodeTime - 1;
        this.setState({changeTestCodeTime: n});
        if (n === 0) {
          clearInterval(changeCodeInterval);
        }
      }, 1000);
    }
  }
  /**
   * 确认注册按钮
   */
  confirmBtnHandle = () => {
    // 先看看有没有都通过
    for (let k in this.allow) {
      if (this.allow.hasOwnProperty(k)) {
        if (!this.allow[k]) {
          return;  // 发现了没通过的
        }
      }
    }
    // 通过了，对密码进行哈希加密
    this.userInputData.password = sha3_512(zip_longest(this.userInputData.userName, this.userInputData.password));

    fetch(getUrl("registerRequest"), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.userInputData),
    }).then(
        res => res.json()
    ).then(
        res => {
          if (res.status) {
            // 注册成功了
            this.registerRes.current.innerText = "注册成功了！";
            this.registerRes.current.style.color = "greenyellow";
          } else {
            // 注册失败了
            this.registerRes.current.innerText = `注册失败，${res.text}`;
            this.registerRes.current.style.color = "orangered";
          }
        }
    );
  }

  /**
   * 组件挂载之后
   */
  componentDidMount() {
    this.getTestImg();
  }

  getTestImg = () => {
    fetch(getUrl("getTestImg"), {
      method: 'GET',
    }).then(
        res => res.json()
    ).then(
        res => {
          console.log("请求验证码图片完毕");
          let stream = res["imgData"];
          this.imgAnswer = res["answer"];
          this.testImgEle.current.src = `data:;base64,${stream}`;
        }
    );
  }
}

export default Register;
