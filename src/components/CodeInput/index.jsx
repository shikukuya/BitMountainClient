import React, {Component} from 'react';
import "./index.css";
import "../../utils/css/icon.css";
// 这样引入js是ok的，里面的代码会自动运行到。
import "./js/jsExtends";
import PubSub from "pubsub-js"

import {UnControlled as CodeMirror} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
// 代码语言高亮
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python.js";
import "codemirror/mode/clike/clike";
// 代码提示
import 'codemirror/addon/hint/javascript-hint';

// 代码颜色风格
import "codemirror/theme/solarized.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/blackboard.css";

//
import Editor, {DiffEditor, useMonaco, loader} from "@monaco-editor/react";

import SOCKET_OBJ from "../../globalData/socketObject";
import {calculateCodeSize} from "../../utils/js/strTools";
import USER_DATA from "../../globalData/userData";


class CodeInput extends Component {
  constructor(props) {
    super(props);


    this.state = {
      language: "cpp",
      theme: "darcula",
      // 记录自己的位置
      myLoc: {
        y: 0,
        x: 0,
      },
      opLoc: {
        x: 0,
        y: 0,
      },

      mTop: 0,// 往下滑滑过了顶部的距离
      inputValue: "",  // 用户输入的代码
    }
    this.selfDiv = React.createRef();
    this.languageEle = React.createRef();
    this.codeMirrorEle = React.createRef();
  }

  render() {
    const {myLoc, opLoc, language, theme} = this.state;
    return (
        <div className="showDiv" ref={this.selfDiv}>
          <div className="firstLine">

            <select name="language" onChange={this.changeLanguageHandle}>
              <option value="cpp">c++</option>
              <option value="c">c</option>
              <option value="python">python</option>
              <option value="java">java</option>
              <option value="javascript">javascript</option>
            </select>

            <select name="theme" onChange={this.handleChangeTheme}>
              <option value="darcula">德古拉风格</option>
              <option value="solarized">日光化的风格</option>
              <option value="eclipse">eclipse风格</option>
              <option value="idea">idea</option>
              <option value="blackboard">blackboard</option>
            </select>

            <input type="checkbox"/> <span>不显示对方位置</span>
          </div>
          {/*自己的行高指标*/}
          <div className="LineTarget myLineTarget" style={{top: `${this.computeTopPx(myLoc.y)}px`}}/>
          <div className="LineTarget opLineTarget" style={{top: `${this.computeTopPx(opLoc.y)}px`}}/>

          <CodeMirror
              className="codeMirrorEle"
              value=""
              ref={this.codeMirrorEle}
              options={{
                lineNumbers: true,
                theme: theme,
                mode: this.getCodeMirrorMode(language),
                extraKeys: {'Ctrl-Space': "autocomplete"},  // ctrl + 空着 自动提示配置
                autofocus: true,  // 自动获取焦点
                styleActiveLine: true,  // 光标行代码高亮
                lineWrapping: false,  // 不要支持代码折叠
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
              }}
              // 输入内容改变
              onChange={this.handleOnChange}
              // 光标移动的时候
              onCursor={this.handleOnCursor}
              // 滚轮滚动的时候
              onScroll={this.handleOnScroll}
          />
        </div>
    )
  }

  handleChangeTheme = (ev) => {
    this.setState({theme: ev.target.value})
  }
  /**
   * 将select框里的value字符串转化为Codemirror的模式字符串
   * @param modeStr
   */
  getCodeMirrorMode = (modeStr) => {
    return {
      c: "clike",
      cpp: "clike",
      java: "clike",
      javascript: "javascript",
      python: "python",
    }[modeStr];
  }

  handleOnChange = (editor, data, value) => {
    PubSub.publish("更新用户输入代码", {
      "userCode": value,
    });
    this.setState({inputValue: value});
    // 时刻公布自己的代码量，
    SOCKET_OBJ.emit("对局中的用户更新自己的代码量", {
      roomName: this.props.roomName,
      userName: USER_DATA.name,
      codeSize: calculateCodeSize(value)
    });
  }

  handleOnScroll = (editor, data) => {
    this.setState({mTop: data["top"]});
  }

  handleOnCursor = (editor, data) => {
    this.setState({myLoc: {x: data["ch"], y: data["line"]}});
    // 时刻公布自己的编辑位置
  }

  /**
   * 30 为顶部第一行的高度，24是每一行代码的高度
   * @param y
   */
  computeTopPx = y => {
    return 30 + y * 24 - this.state.mTop;
  }

  // 检测语言选择变化
  changeLanguageHandle = (ev) => {
    PubSub.publish("更新用户输入代码", {
      "userLanguage": ev.target.value,
    });
    this.setState({language: ev.target.value});
    console.log("用户选择了更换语言", ev.target.value)
  }

  componentDidMount() {
    const {roomName} = this.props;

    // 时刻监听对手的编辑位置
    SOCKET_OBJ.on(`前端对局中${roomName}房间有用户更新代编辑位置`, res => {
      const data = res;
      if (data["userName"] === USER_DATA.opponent.name) {
        this.setState({opLoc: data["loc"]});
      }
    });
    // 时刻公布自己的位置，这里还是要写在定时器中，如果写在函数中，收到的是上一次的位置
    this.ani1 = setInterval(() => {
      SOCKET_OBJ.emit("对局中的用户更新自己的编辑位置", {
        roomName: this.props.roomName,
        userName: USER_DATA.name,
        loc: this.state.myLoc
      });
    }, 500);
  }

  componentWillUnmount() {
  }
}

export default CodeInput;
