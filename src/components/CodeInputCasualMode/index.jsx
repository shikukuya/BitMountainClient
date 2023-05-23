import React, {Component} from 'react';
import "./index.css";
import Editor from "@monaco-editor/react";
import PubSub from "pubsub-js";
import {calculateCodeSize} from "../../utils/js/strTools";
import CodeSubmitResult from "../CodeSubmitResult";
import casualModeTemplateObj from "./casualModeTemplate";


/**
 * 娱乐模式的代码输入部分的组件
 * 目前仅支持js代码
 */
class CodeInputCasualMode extends Component {
  /**
   * 组件参数
   * gameName 可能是 "ticTacToe" "gobang" "mechanicalAutoChess" 三者中的任意一个
   * @param props
   */
  constructor(props) {
    super(props);
    this.initUserCode = casualModeTemplateObj[this.props.gameName];
    this.state = {
      theme: "vs-dark",
      fontSize: 14,
      lineHeight: 20,
      userCode: this.initUserCode,
      userFont: `Consolas, 'Microsoft YaHei UI', 'Courier New', monospace`,  // 用户设置的中文字体名称
      codeSize: calculateCodeSize(this.initUserCode),
    };
  }

  render() {
    const {theme, userCode, codeSize, userFont, fontSize} = this.state;
    return (
        // 这个组件盒子外面需要套个框，此组件宽度100%，高度100%
        <div className="codeInputCasualMode">
          <div className="area1">

            <select name="theme" onChange={this.handleChangeTheme}>
              <option value="vs-dark">暗主题</option>
              <option value="vs-light">亮主题</option>
              <option value="hc-black">高对比</option>
            </select>
            <span>{fontSize}px</span>
            <input type="range" min={10} max={24} value={fontSize} onChange={this.handleChangeFontSize}/>

            <select name="fontFamily" onChange={this.handleChangeFont}>
              <option value="Consolas, 'Microsoft YaHei UI', 'Courier New', monospace">控制台+雅黑</option>
              <option value="Consolas, SimHei,'Microsoft YaHei UI', 'Courier New', monospace">控制台+SimHei</option>
              <option value="Consolas">控制台+宋体</option>
              <option value="'Courier New', 'Microsoft YaHei UI'">打印机+雅黑</option>
            </select>
            <span>代码量：{codeSize}</span>
          </div>

          <div className="area2">
            <Editor
                height="100%"
                className="vscodeEditor"
                value={userCode}
                defaultLanguage={"javascript"}
                language={"javascript"}
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
                  fontFamily: userFont,
                  fontSize: this.state.fontSize,
                  lineHeight: this.state.lineHeight,
                }}
            />
          </div>

          <div className="area3">
            <button className="codeBtn">提交代码</button>
            <input className="codeNameInput" type="text" placeholder={"代码命名"} maxLength={10}/>
            <button className="codeBtn" onClick={this.handleResetCode}>恢复模板</button>
          </div>

          <CodeSubmitResult/>
        </div>
    );
  }

  // 更改主题
  handleChangeTheme = (ev) => {
    this.setState({theme: ev.target.value})
  }
  handleChangeFontSize = (ev) => {
    let newFontSize = +(ev.target.value);
    let newLineHeight = newFontSize * 1.5;
    this.setState({
      fontSize: newFontSize,
      lineHeight: newLineHeight,
    });
  }
  handleChangeFont = (ev) => {
    this.setState({userFont: ev.target.value});
  }

  // 代码输入改变
  handleOnChangeVs = (value, _) => {

    this.setState({
      userCode: value,
      codeSize: calculateCodeSize(value),
    });

    PubSub.publish("更新用户输入娱乐模式代码", {
      "userCode": value,
      "codeSize": this.state.codeSize,
    });

  }
  // 恢复代码
  handleResetCode = () => {
    this.setState({
      userCode: this.initUserCode,
      codeSize: calculateCodeSize(this.initUserCode),
    })
  }
}

export default CodeInputCasualMode;
