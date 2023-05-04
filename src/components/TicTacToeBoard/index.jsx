import React, {Component} from 'react';
import "./index.css";
import getArray from "../../utils/js/range";
import PubSub from "pubsub-js";
import {putPieceSound} from "../../utils/js/playSound";

/**
 * 这个组件只详细展示一盘对局
 * 通常先手是玩家使用 "X"，后手是玩家使用 "O"。
 * 但实际上，这只是一种约定俗成的规定，并没有固定的规定。
 * 在另一些地区，先手和后手可能会反过来。
 */
class TicTacToeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // [ [xy], [xy] ]
      historyList: this.props.historyList,
      maxStep: 1,
      currentIndex: 0,  // 相对于boardList的下标
    }
    this.barEle = React.createRef();
  }

  generateBoardListByHistory = (historyList) => {
    let boardList = [
      [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ],
    ];
    let curBoard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ]
    let step = 0;
    for (let [x, y] of historyList) {
      let curChar = "O"
      if (step % 2 === 0) {
        curChar = "X"
      }
      curBoard[y][x] = curChar;
      boardList.push(JSON.parse(JSON.stringify(curBoard)));
      step++;
    }
    return boardList;
  }

  render() {
    const {name} = this.props;
    const {currentIndex, historyList} = this.state;
    this.boardList = this.generateBoardListByHistory(historyList);

    return (
        <div className="ticTacToeBoard">
          <p className="title">当前对局:{name}</p>
          <div className="board">
            {
              getArray(3).map(y => {
                return (
                    <div className="line" key={y}>
                      {
                        getArray(3).map(x => {
                          return <div className="box" key={x}>
                            {this.boardList[currentIndex][y][x] === "" ? null :
                                (<div className="piece">
                                  {this.boardList[currentIndex][y][x]}
                                </div>)
                            }
                          </div>
                        })
                      }
                    </div>
                )
              })
            }
            {this.getWinLineByBoard(this.boardList[currentIndex])}
          </div>
          <button className="stepBtn" onClick={this.handleLeft}>←</button>
          <input type="range"
                 className="rangeEle"
                 ref={this.barEle}
                 onInput={this.updateValue}
                 min="0"
                 defaultValue="0"
                 max={`${this.boardList.length - 1}`}/>
          <button className="stepBtn" onClick={this.handleRight}>→</button>
          {/*max: <span>{this.boardList.length - 1}</span>*/}
          {/*cur: <span>{this.state.currentIndex}</span>*/}
        </div>
    );
  }

  getWinLineByBoard = (matrix) => {
    let dic = {
      xLine1: null,
      xLine2: null,
      xLine3: null,
      yLine1: null,
      yLine2: null,
      yLine3: null,
      sLine1: null,
      sLine2: null,
    }
    // 行检查
    for (let y = 0; y < 3; y++) {
      if (matrix[y][0] === "") {
        continue;
      }
      if (matrix[y][0] === matrix[y][1] && matrix[y][1] === matrix[y][2]) {
        dic[`xLine${y + 1}`] = <div className={`winLine xLine${y + 1}`}/>
      }
    }
    // 列检查
    for (let x = 0; x < 3; x++) {
      if (matrix[0][x] === "") continue;
      if (matrix[0][x] === matrix[1][x] && matrix[1][x] === matrix[2][x]) {
        dic[`yLine${x + 1}`] = <div className={`winLine yLine${x + 1}`}/>
      }
    }
    // 斜着
    if (matrix[1][1] !== "" && matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
      dic[`sLine1`] = <div className={`winLine sLine1`}/>
    }
    if (matrix[1][1] !== "" && matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) {
      dic[`sLine2`] = <div className={`winLine sLine2`}/>
    }
    return (
        <div>
          {dic.xLine1}
          {dic.xLine2}
          {dic.xLine3}
          {dic.yLine1}
          {dic.yLine2}
          {dic.yLine3}
          {dic.sLine1}
          {dic.sLine2}
        </div>
    )
  }

  componentDidMount() {
    this.token1 = PubSub.subscribe("井字棋棋盘接收更改内容消息", (_, data) => {
      // 先初始化棋盘，把进度条返回到0
      this.state.currentIndex = 0;
      this.barEle.current.value = "0";
      this.setState({historyList: data["historyList"]})
    });
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
  }

  handleLeft = () => {
    let i = Math.max(0, this.state.currentIndex - 1);
    this.setState({currentIndex: i});
    this.barEle.current.value = `${i}`;
  }

  handleRight = () => {
    let i = Math.min(this.boardList.length - 1, this.state.currentIndex + 1);
    this.setState({currentIndex: i});
    this.barEle.current.value = `${i}`;
    putPieceSound();
  }

  updateValue = (ev) => {
    this.setState({currentIndex: +ev.target.value});
    putPieceSound();
  }
}

export default TicTacToeBoard;
