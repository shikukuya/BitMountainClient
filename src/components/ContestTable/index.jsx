import React, {Component} from 'react';
import {sortAndConcatenateStrings} from "../../utils/js/strTools";
import "./index.css";
import ContestTableLine from "../ContestTableLine";


/**
 * 单题目对战表格
 * 这个组件只适用于题目数量只是一个的时候。
 */
class ContestTable extends Component {
  constructor(props) {
    super(props);
    /**
     * props说明
     * team1: ["aName", "bName", "cName", ]
     * team2: ["bName", "ccName",...]
     * initHp: 5
     */
    const {team1, team2} = this.props;
    /// 房间名字
    this.roomName = sortAndConcatenateStrings([...team1, ...team2]);
  }

  render() {
    const {initHp, team1, team2} = this.props;
    return (
        <div className="contestTable">
          <div className="contestTableLine">
            <div className="box">玩家名字</div>
            <div className="box">生命值</div>
            <div className="box">提交次数</div>
            <div className="box">代码量</div>
            <div className="box">AC</div>
          </div>
          {
            team1.map((nameStr, i) => {
              return (
                  <ContestTableLine
                      symbolColor="green"
                      roomName={this.roomName}
                      initHp={initHp} name={nameStr} key={i}/>
              )
            })
          }
          {
            team2.map((nameStr, i) => {
              return (
                  <ContestTableLine
                      symbolColor="orangered"
                      roomName={this.roomName}
                      initHp={initHp} name={nameStr} key={i}/>
              )
            })
          }
        </div>
    );
  }
}

export default ContestTable;
