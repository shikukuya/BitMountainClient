import React, {Component} from 'react';
import "./index.css";
import "../../utils/css/icon.css";
import preventFunction from "./js/prevent";
import templates from "./js/codeTemplate";
import PubSub from "pubsub-js"

// vsCode编辑界面
import Editor, {DiffEditor, useMonaco, loader} from "@monaco-editor/react";

import SOCKET_OBJ from "../../globalData/socketObject";
import {calculateCodeSize, compressCode, getNumberOfLines, strDistance} from "../../utils/js/strTools";
import USER_DATA from "../../globalData/userData";


class CodeInput extends Component {
  constructor(props) {
    super(props);


    this.state = {
      language: "cpp",
      // theme: "darcula",
      theme: "vs-dark",
      // 记录自己的位置
      myLoc: {
        y: 0,
        x: 0,
      },
      opLoc: {
        x: 0,
        y: 0,
      },
      userCode: templates["cpp"],
      mTop: 0,// 往下滑滑过了顶部的距离
      inputValue: "",  // 用户输入的代码
      fontSize: 14,
      lineHeight: 20,
      isHideLocation: false,
    }
    this.selfDiv = React.createRef();
    this.languageEle = React.createRef();
  }

  render() {
    const {myLoc, opLoc, language, theme, userCode} = this.state;
    return (
        <div className="showDiv" ref={this.selfDiv}>
          {/*area1，高度30px*/}
          {/*area2，高度剩下*/}
          <div className="area1">
            <select name="language" onChange={this.changeLanguageHandle}>
              <option value="cpp">c++</option>
              <option value="c">c</option>
              <option value="python">python</option>
              <option value="java">java</option>
              <option value="javascript">javascript</option>
            </select>

            <select name="theme" onChange={this.handleChangeTheme}>
              <option value="vs-dark">vsCode暗色主题</option>
              <option value="vs-light">vsCode亮色主题</option>
              <option value="hc-black">高对比度黑色主题</option>
            </select>

            <span>字体大小</span>
            <select name="fontSize" onChange={this.handleChangeFontSize}>
              <option value="14">14</option>
              <option value="18">18</option>
              <option value="20">20</option>
            </select>
            <span>行高</span>
            <select name="lineHeight" onChange={this.handleChangeLineHeight}>
              <option value="20">20</option>
              <option value="24">24</option>
              <option value="28">28</option>
            </select>
            <input type="checkbox"
                   checked={this.state.isHideLocation}
                   onChange={this.handleCheckHideLocation}/><span>不显示位置</span>
          </div>
          <div className="area2">
            {/*自己的行高指标*/}
            <div className="LineTarget myLineTarget" style={{
              top: `${this.computeTopPx(myLoc.y)}px`,
              height: `${this.state.lineHeight}px`,
              opacity: this.state.isHideLocation ? "0" : "100%",
            }}/>
            <div className="LineTarget opLineTarget" style={{
              top: `${this.computeTopPx(opLoc.y)}px`,
              height: `${this.state.lineHeight}px`,
              opacity: this.state.isHideLocation ? "0" : "100%",
            }}/>

            <Editor
                height="100%"
                className="vscodeEditor"
                value={userCode}
                defaultLanguage={"cpp"}
                language={language}
                defaultValue="// some comment"
                onChange={this.handleOnChangeVs}
                theme={theme}
                options={{
                  scrollbar: {
                    handleMouseWheel: true,
                    horizontal: 'auto',
                    vertical: 'visible',
                    useShadows: false
                  },
                  fontSize: this.state.fontSize,
                  lineHeight: this.state.lineHeight,
                }}
            />
          </div>
        </div>
    )
  }

  handleChangeTheme = (ev) => {
    this.setState({theme: ev.target.value})
  }
  handleChangeFontSize = (ev) => {
    let newFontSize = +(ev.target.value);
    this.setState({fontSize: newFontSize});
  }
  handleChangeLineHeight = (ev) => {
    this.setState({lineHeight: +(ev.target.value)});
  }
  handleCheckHideLocation = () => {
    this.setState({isHideLocation: !this.state.isHideLocation});
  }

  handleOnChangeVs = (value, event) => {
    this.setState({userCode: value});
    PubSub.publish("更新用户输入代码", {
      "userCode": value,
    });
    // 时刻公布自己的代码量，
    SOCKET_OBJ.emit("对局中的用户更新自己的代码量", {
      roomName: this.props.roomName,
      userName: USER_DATA.name,
      codeSize: calculateCodeSize(value)
    });

    this.setState({myLoc: {x: 0, y: getNumberOfLines(value) - 1}});
  }

  /**
   * 30 为顶部第一行的高度，24是每一行代码的高度
   * @param y
   */
  computeTopPx = y => {
    return 30 + y * this.state.lineHeight - this.state.mTop;
  }

  // 检测语言选择变化
  changeLanguageHandle = (ev) => {
    const languageStr = ev.target.value;
    const beforeLanguageStr = this.state.language;
    console.log(beforeLanguageStr, "===>", languageStr)
    // 检测用户是否更改了代码模板
    // 检测依据是用户还没修改超过20个字符
    const dis = strDistance(
        compressCode(this.state.userCode),
        compressCode(templates[beforeLanguageStr])
    );

    PubSub.publish("更新用户输入代码", {
      "userLanguage": languageStr,
    });

    this.setState({language: languageStr});

    if (dis > 20) {
      // 用户改动比较大，不给他换内容了
      console.log("用户改动比较大，不更换内容了");
    } else {
      this.setState({userCode: templates[languageStr]});
    }

    console.log("用户选择了更换语言", languageStr)
  }

  componentDidMount() {
    const {roomName} = this.props;

    document.addEventListener("keydown", preventFunction);
    // 先更新一下自己的位置
    this.setState({
      myLoc: {x: 0, y: getNumberOfLines(this.state.userCode) - 1}
    })

    // 时刻监听对手的编辑位置
    SOCKET_OBJ.on(`前端对局中${roomName}房间有用户更新代编辑位置`, this.socketHandleUpdateLoc);
    // 时刻公布自己的位置，这里还是要写在定时器中，如果写在函数中，收到的是上一次的位置
    this.ani1 = setInterval(() => {
      SOCKET_OBJ.emit("对局中的用户更新自己的编辑位置", {
        roomName: this.props.roomName,
        userName: USER_DATA.name,
        loc: this.state.myLoc
      });
    }, 500);
  }

  socketHandleUpdateLoc = res => {
    const data = res;
    if (data["userName"] === USER_DATA.opponent.name) {
      this.setState({opLoc: data["loc"]});
    }
  }

  componentWillUnmount() {
    const {roomName} = this.props;
    // 移除事件
    document.removeEventListener("keydown", preventFunction);
    clearInterval(this.ani1);
    SOCKET_OBJ.off(`前端对局中${roomName}房间有用户更新代编辑位置`, this.socketHandleUpdateLoc);
  }
}

export default CodeInput;
