import React, {Component} from 'react';
import getArray from "../../utils/js/range";
import "./index.css";
import Array2d from "../../utils/js/array2d";
import PubSub from "pubsub-js";
import {putPieceSound} from "../../utils/js/playSound";

class AutoChessBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: null,
      title: "对局为空，棋盘上无法展示，请挑战其他玩家或提交代码挑战自己",
      curIndex: 0,
      // 地图演变历史
      worldHistory: [
        (new Array2d(19, 19)).arr,
      ],
      // 机器人动作历史
      actionHistory: [],
      // 机器人1位置历史
      robot1LocHistory: [{x: -10, y: -10}],
      robot2LocHistory: [{x: -10, y: -10}],
    }
    this.barEle = React.createRef();
  }

  render() {
    return (
        <div className="components-auto-chess-board-area">
          <h2>{this.state.title}</h2>
          {/*网格地图*/}
          <div className="matrix">
            {this._getRobot1Ele()}
            {this._getRobot2Ele()}
            {this._getRobot1View()}
            {this._getRobot2View()}
            {this._getBoomEle()}
            {
              getArray(19).map(y => {
                return (
                    <div className="line" key={y}>
                      {
                        getArray(19).map(x => {
                          return (
                              <div className="box" key={x}>
                                {this.getBlockEle(x, y)}
                              </div>
                          )
                        })
                      }
                    </div>
                )
              })
            }
          </div>
          <button onClick={this.handleLeft}>←</button>
          <input
              type="range"
              ref={this.barEle}
              defaultValue={0}
              min={0}
              onChange={this.handleChangeBar}
              max={this.state.worldHistory.length - 1}
              className="bar"/>
          <button onClick={this.handleRight}>→</button>
        </div>
    );
  }

  _getRobot1Ele = () => {
    let i = this.state.curIndex;
    if (this.state.robot1LocHistory[i]) {
      return <div className="robot1" style={{
        left: `${24 * this.state.robot1LocHistory[i].x}px`,
        top: `${24 * this.state.robot1LocHistory[i].y}px`,
      }}>🤖
      </div>
    }
  }
  _getRobot1View = () => {
    let i = this.state.curIndex;
    if (this.state.robot1LocHistory[i]) {
      return <div className="robot1View" style={{
        left: `${24 * this.state.robot1LocHistory[i].x - (24 * 2)}px`,
        top: `${24 * this.state.robot1LocHistory[i].y - (24 * 2)}px`,
      }}/>
    }
  }
  _getRobot2Ele = () => {
    let i = this.state.curIndex;
    if (this.state.robot2LocHistory[i]) {
      return <div className="robot2" style={{
        left: `${24 * this.state.robot2LocHistory[i].x}px`,
        top: `${24 * this.state.robot2LocHistory[i].y}px`,
      }}>👽
      </div>
    }
  }
  _getRobot2View = () => {
    let i = this.state.curIndex;
    if (this.state.robot2LocHistory[i]) {
      return <div className="robot2View" style={{
        left: `${24 * this.state.robot2LocHistory[i].x - (24 * 2)}px`,
        top: `${24 * this.state.robot2LocHistory[i].y - (24 * 2)}px`,
      }}/>
    }
  }
  _getBoomEle = () => {
    const i = this.state.curIndex;
    const actionHistory = this.state.actionHistory;
    if (i < 2) {
      return null;
    } else {
      if (actionHistory[i].action === "attack") {
        // 是爆炸攻击，看是谁发的
        let locObj;
        let direction = actionHistory[i].direction;
        if (i % 2 === 0) {
          // 先手攻击
          locObj = this.state.robot1LocHistory[i];
        } else {
          // 后手攻击
          locObj = this.state.robot2LocHistory[i];
        }
        if (!locObj) {
          return null;
        }
        let newObj = {x: locObj.x, y: locObj.y};
        switch (direction) {
          case "up":
            newObj.y -= 2;
            break;
          case "down":
            newObj.y += 2;
            break;
          case "left":
            newObj.x -= 2;
            break;
          case "right":
            newObj.x += 2;
            break;
          default:
            break;
        }
        return <div style={{
          left: `${newObj.x * 24}px`,
          top: `${newObj.y * 24}px`,
        }} className="boom"/>;
      }
    }
    return null;
  }

  getBlockEle = (x, y) => {
    let n = this.state.worldHistory[this.state.curIndex][y][x];
    let h = this.state.worldHistory[this.state.curIndex].length;
    let w = this.state.worldHistory[this.state.curIndex][0].length;

    if (n === 0) {
      return null;
    }
    // 处理连接圆角效果
    // 与四个方向是否连接？
    let connectUp, connectDown, connectLeft, connectRight;
    if (y === 0) {
      connectUp = true;
    } else {
      connectUp = this.state.worldHistory[this.state.curIndex][y - 1][x] === n;
    }
    if (y === h - 1) {
      connectDown = true;
    } else {
      connectDown = this.state.worldHistory[this.state.curIndex][y + 1][x] === n;
    }
    if (x === 0) {
      connectLeft = true;
    } else {
      connectLeft = this.state.worldHistory[this.state.curIndex][y][x - 1] === n;
    }
    if (x === w - 1) {
      connectRight = true;
    } else {
      connectRight = this.state.worldHistory[this.state.curIndex][y][x + 1] === n;
    }
    let styleObj = this._getCssObjByConnect(connectUp, connectDown, connectLeft, connectRight);
    if (n === 1) {
      return <div className="rock" style={styleObj}/>
    }
    if (n === 2) {
      return null;
    }
    if (n === 3) {
      return null;
    }
    if (n === 4) {
      return <div className="blackPiece" style={styleObj}/>
    }
    if (n === 5) {
      return <div className="whitePiece" style={styleObj}/>
    }
  }
  _getCssObjByConnect = (top, down, left, right) => {
    let res = {
      borderTopLeftRadius: "50%",
      borderTopRightRadius: "50%",
      borderBottomLeftRadius: "50%",
      borderBottomRightRadius: "50%",
    }
    if (top) {
      res.borderTopLeftRadius = "0";
      res.borderTopRightRadius = "0";
    }
    if (left) {
      res.borderBottomLeftRadius = "0";
      res.borderTopLeftRadius = "0";
    }
    if (right) {
      res.borderTopRightRadius = "0";
      res.borderBottomRightRadius = "0";
    }
    if (down) {
      res.borderBottomLeftRadius = "0";
      res.borderBottomRightRadius = "0";
    }
    return res;
  }

  componentDidMount() {
    /**
     * 消息可能来自于“挑战”按钮
     * data {
          actionHistory: actionHistory,
          worldHistory: worldHistory,
        }
     */
    this.token1 = PubSub.subscribe("机械自走棋棋盘更新对战结果", (_, data) => {
      this.setState({curIndex: 0});
      // 根据历史记录数组生成三维数组

      this.setState(data);

    });
    // 将滑动条重置0
    this.barEle.current.value = `0`;
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token1);
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
    let n = Math.min(this.state.curIndex + 1, this.state.worldHistory.length - 1);
    this.setState({curIndex: n});
    this.barEle.current.value = `${n}`;
    putPieceSound();
  }
}

export default AutoChessBoard;
