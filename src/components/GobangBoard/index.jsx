import React, {Component} from 'react';
import "./index.css";
import Array2d from "../../utils/js/array2d";
import getArray from "../../utils/js/range";
import {drawLine, drawRectFill} from "../../utils/js/ctxTools";
import PubSub from "pubsub-js"
import {putPieceSound} from "../../utils/js/playSound";

class GobangBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrix: new Array2d(15, 15),
      matchName: "对局名称",
      curIndex: 0,
      boardList: [],  // 每一个数组就是一个棋盘

      // 鼠标交互相关
      isShowCurLoc: false,
      curSelectLoc: {x: -1, y: -1},
    }
    this.barEle = React.createRef();
  }

  render() {
    return (
        <div className="gobangBoard">
          <h1>{this.state.matchName}</h1>
          <div className="temp">
            <div className="board">
              {
                getArray(15).map(y => {
                  return <div className="boardLine" key={y}>
                    {
                      getArray(15).map(x => {
                        return <div className="box"
                                    onMouseLeave={_ => this.setState({isShowCurLoc: false})}
                                    onMouseEnter={this.showLocData(x, y)} key={x}>
                          {this.getPieceElement(x, y)}
                        </div>
                      })
                    }
                  </div>
                })
              }
            </div>
            <canvas className="boardCanvas" ref={c => this.canvas1 = c}/>
          </div>
          <button onClick={this.handleLeft}>←</button>
          <input
              min={0}
              max={this.state.boardList.length - 1}
              defaultValue={0}
              onChange={this.handleChangeBar}
              ref={this.barEle}
              className="bar"
              type="range"/>
          <button onClick={this.handleRight}>→</button>
          {
            this.state.isShowCurLoc ?
                <div>当前鼠标所在坐标：{JSON.stringify(this.state.curSelectLoc)}</div> :
                <div>鼠标放在棋盘上可以显示坐标</div>
          }
        </div>
    );
  }

  showLocData = (x, y) => {
    return _ => {
      this.setState({
        isShowCurLoc: true,
        curSelectLoc: {x: x, y: y}
      });
    }
  }
  getPieceElement = (x, y) => {
    const {boardList, curIndex} = this.state;
    if (boardList.length === 0) {
      return null;
    }
    let value = boardList[curIndex][y][x];
    if (value === 0) {
      return <div/>;
    }
    let colorClass = ``;
    if (value === 1) {
      colorClass = "blackPiece";
    }
    if (value === 2) {
      colorClass = "whitePiece";
    }
    let winClass = "";
    if (curIndex === boardList.length - 1) {
      // 已经是最后一面了，展露赢了的光辉
      for (let winLocObj of this.state.winnerLoc) {
        if (x === winLocObj.x && y === winLocObj.y) {
          winClass = "pieceWin";
        }
      }
    }
    return <div className={`piece ${colorClass} ${winClass}`}/>
  }

  rendBoard = () => {
    const w = 26;
    this.canvasW = 15 * w * window.devicePixelRatio;
    this.canvasH = 15 * w * window.devicePixelRatio;
    this.canvas1.width = this.canvasW;
    this.canvas1.height = this.canvasH;
    // 画棋盘
    let ctx = this.canvas1.getContext("2d");
    ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    drawRectFill(ctx, 0, 0, this.canvasW, this.canvasH, `rgb(164, 140, 90)`);
    for (let x = 0; x < 15; x++) {
      drawLine(ctx, x * w + w / 2, w / 2, x * w + w / 2, 15 * w - w / 2);
    }
    for (let y = 0; y < 15; y++) {
      drawLine(ctx, w / 2, y * w + w / 2, 15 * w - w / 2, y * w + w / 2);
    }
  }

  componentDidMount() {
    this.rendBoard();
    /**
     * history: history,
     winnerLoc: winnerLoc,
     matchName: title,
     curIndex: 0,
     */
    this.token1 = PubSub.subscribe("五子棋棋盘更改状态", (_, data) => {
      this.setState(data);
      // 更改boardList
      this.updateStateByHistory(data['history']);
      // 将滑动条重置0
      this.barEle.current.value = `0`;
    });
  }

  handleChangeBar = (ev) => {
    let n = +ev.target.value;
    this.setState({curIndex: n});
    putPieceSound();
  }
  handleLeft = () => {
    let n = Math.max(0, this.state.curIndex - 1);
    this.setState({curIndex: n});
    this.barEle.current.value = `${n}`;
  }

  handleRight = () => {
    let n = Math.min(this.state.curIndex + 1, this.state.boardList.length - 1);
    this.setState({curIndex: n});
    this.barEle.current.value = `${n}`;
    putPieceSound();
  }

  updateStateByHistory = (history) => {
    let newBoardList = [];
    let board = new Array2d(15, 15);
    let putValue, step = 0;
    for (let locObj of history) {
      if (step % 2 === 0) {
        putValue = 1;
      } else {
        putValue = 2;
      }
      board.set(locObj.x, locObj.y, putValue);
      newBoardList.push(board.getSnapshot());
      step++;
    }
    this.setState({boardList: newBoardList});
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
  }
}

export default GobangBoard;
