import React, {Component} from 'react';
import "./index.css";
import getArray from "../../utils/js/range";
import {randint, uniform} from "../../utils/js/random";
import USER_DATA from "../../globalData/userData";
import {computeLevel} from "../../model/level";

class GameStartAnimation extends Component {
  state = {
    shouldDelete: false,
  }

  render() {
    if (this.state.shouldDelete) {
      return null;
    }
    return (
        <div className="gameStartAnimation">
          <div className="title1">{this.props.moodName}</div>
          <div className="userCard leftUser">
            <img className="headImg" src={require(`../../headImgs/${USER_DATA.headSculpture}.png`)} alt="头像"/>
            <h2>{USER_DATA.name}</h2>
            <p>
              <img src={require(`../../levelIcon/level${computeLevel(USER_DATA.score)}.png`)} alt=""/>
              {USER_DATA.score}
            </p>
          </div>
          <div className="userCard rightUser">
            <img className="headImg" src={require(`../../headImgs/${USER_DATA.opponent.headSculpture}.png`)} alt=""/>
            <h2>{USER_DATA.opponent.userName}</h2>
            <p>
              <img src={require(`../../levelIcon/level${computeLevel(USER_DATA.opponent.score)}.png`)} alt=""/>
              {USER_DATA.opponent.score}
            </p>
          </div>
          <div className="stoneArr">
            {
              getArray(100).map(i => {
                return (
                    <div className="stoneWay" key={`stoneWay${i}`} style={{
                      transform: `rotate(${randint(0, 360)}deg)`,
                    }}>
                      <div className="stone"
                           style={{animationDelay: `${1.85 + uniform(0, 0.1)}s`}}
                           key={`stone${i}`}/>
                    </div>
                )
              })
            }
          </div>
          <div className="channel leftChannel">
            <img className="hand leftHand" src={require("../../utils/img/拳套.png")} alt="x"/>
          </div>
          <div className="channel rightChannel">
            <img className="hand rightHand" src={require("../../utils/img/拳套.png")} alt="x"/>
          </div>
        </div>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({shouldDelete: true});
    }, 4000);
  }
}

export default GameStartAnimation;
