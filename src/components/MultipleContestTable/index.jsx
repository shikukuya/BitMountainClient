import React, {Component} from 'react';
import "./index.css";
import {sortAndConcatenateStrings} from "../../utils/js/strTools";
import MultipleContestTableLine from "../MultipleContestTableLine";

class MultipleContestTable extends Component {

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
    const {team1, team2} = this.props;
    const {initHp} = this.props;

    return (
        <div className="multipleContestTable">
          <div className="multipleContestTableLine">
            <div className="box">玩家名字</div>
            <div className="box">生命值</div>
            <div className="box">代码总量</div>
          </div>
          {
            team1.map((nameStr, i) => {
              return (
                  <MultipleContestTableLine
                      symbolColor="green"
                      roomName={this.roomName}
                      initHp={initHp} name={nameStr} key={i}/>
              )
            })
          }
          {
            team2.map((nameStr, i) => {
              return (
                  <MultipleContestTableLine
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

export default MultipleContestTable;
