import React, {Component} from 'react';
import "./index.css";
import {sortAndConcatenateStrings} from "../../utils/js/strTools";
import MultipleContestTableLine from "../MultipleContestTableLine";

class MultipleContestTable extends Component {

  constructor(props) {
    super(props);
    /**
     * props说明
     * team1UserObjList=[
                    {userName: USER_DATA.name, userId: USER_DATA.id}
                  ]
       team2UserObjList=[
                      {userName: USER_DATA.opponent.userName, userId: USER_DATA.opponent.id}
                    ]
       initHp={this.props.hpInit}
     */
    const {team1UserObjList, team2UserObjList} = this.props;
    /// 房间名字
    let arr = [];
    for (let obj of team1UserObjList) {
      arr.push(obj["userId"]);
    }
    for (let obj of team2UserObjList) {
      arr.push(obj["userId"]);
    }
    this.roomName = sortAndConcatenateStrings(arr);
  }

  render() {
    const {team1UserObjList, team2UserObjList} = this.props;
    const {initHp} = this.props;

    return (
        <div className="multipleContestTable">
          <div className="multipleContestTableLine">
            <div className="box">玩家名字</div>
            <div className="box">生命值</div>
            <div className="box">代码总量</div>
          </div>
          {
            team1UserObjList.map((userObj, i) => {
              return (
                  <MultipleContestTableLine
                      symbolColor="green"
                      roomName={this.roomName}
                      initHp={initHp}
                      userName={userObj["userName"]}
                      userId={userObj["userId"]}
                      key={i}/>
              )
            })
          }
          {
            team2UserObjList.map((userObj, i) => {
              return (
                  <MultipleContestTableLine
                      symbolColor="orangered"
                      roomName={this.roomName}
                      initHp={initHp}
                      userName={userObj["userName"]}
                      userId={userObj["userId"]}
                      key={i}/>
              )
            })
          }
        </div>
    );
  }
}

export default MultipleContestTable;
