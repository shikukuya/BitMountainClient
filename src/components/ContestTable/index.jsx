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
     * team1List=[
                    {userName: USER_DATA.name, userId: USER_DATA.id}
                  ]
        team2List=[
                    {userName: USER_DATA.opponent.userName, userId: USER_DATA.opponent.id}
                  ]
     * initHp: 5
     */
    const {team1UserObjList, team2UserObjList} = this.props;
    /// 房间名字生成
    let idsList = []
    for (let obj of team1UserObjList) {
      idsList.push(obj["userId"]);
    }
    for (let obj of team2UserObjList) {
      idsList.push(obj["userId"]);
    }
    this.roomName = sortAndConcatenateStrings(idsList);
  }

  render() {
    const {initHp, team1UserObjList, team2UserObjList} = this.props;
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
            team1UserObjList.map((userObj, i) => {
              return (
                  <ContestTableLine
                      symbolColor="green"
                      roomName={this.roomName}
                      initHp={initHp}
                      name={userObj["userName"]}
                      userId={userObj["userId"]}
                      key={i}/>
              )
            })
          }
          {
            team2UserObjList.map((userObj, i) => {
              return (
                  <ContestTableLine
                      symbolColor="orangered"
                      roomName={this.roomName}
                      initHp={initHp}
                      name={userObj["userName"]}
                      userId={userObj["userId"]}
                      key={i}/>
              )
            })
          }
        </div>
    );
  }
}

export default ContestTable;
