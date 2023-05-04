import React, {Component} from 'react';
import "./index.css"
import moment from "moment";


class HistoryItem extends Component {
  render() {
    const {opponent, mood, isWin, scoreChange, time, opponentHeadSculpture} = this.props;
    return (
        <div className="historyItem">
          <img src={require(`../../headImgs/${opponentHeadSculpture}.png`)}
               alt="" className="headImg"/>
          <span className="userName">{opponent}</span>
          <span>{mood}</span>
          <span className={isWin ? "result win" : "result lose"}>
            {isWin ? "胜" : "败"}
          </span>
          <span className={"scoreChange " + (isWin ? "win" : "lose")}>
            {this.getScoreChangeText(scoreChange)}
          </span>
          <span className="time">{moment(time).fromNow()}</span>
        </div>
    );
  }

  componentDidMount() {
  }

  getScoreChangeText = (n) => {
    if (n === 0) {
      return ""
    }
    if (n > 0) {
      return `+${n}分`
    } else {
      return `${n}分`
    }
  }
}

export default HistoryItem;
