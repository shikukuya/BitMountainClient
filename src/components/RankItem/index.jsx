import React, {Component} from 'react';
import "./index.css";
import {computeLevel} from "../../model/level";

class RankItem extends Component {
  render() {
    const {head, userName, rank, score} = this.props;
    return (
        <div className="rankItemEle">
          <div className="mostLeft">
            <div className="rankNumber">{rank}</div>
          </div>
          <div className="left">
            <img src={require(`../../headImgs/${head}.png`)} alt="x"/>
          </div>
          <div className="right">
            <p>
              {userName}
              <img src={require(`../../levelIcon/level${computeLevel(score)}.png`)} alt="x"/>
              <span>{score}</span>
            </p>
          </div>
        </div>
    );
  }
}

export default RankItem;
