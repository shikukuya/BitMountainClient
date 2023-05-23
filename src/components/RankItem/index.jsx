import React, {Component} from 'react';
import "./index.css";
import {computeLevel} from "../../model/level";

class RankItem extends Component {
  render() {
    const {head, userName, rank, score, codeSize} = this.props;
    return (
        <div className="rankItemEle">
          <div className="mostLeft">
            <div className="rankNumber">{rank}</div>
          </div>
          <div className="left">
            <img src={require(`../../headImgs/${head}.png`)} alt="x"/>
          </div>
          <div className="right">
            <div className="userArea">
              <div className="userName">{userName}</div>
              <div className="userScore">
                <img src={require(`../../levelIcon/level${computeLevel(score)}.png`)} alt="x"/>
                <span>{score}</span>
              </div>

            </div>
            <div className="codeArea">
              <span>代码量：{codeSize}</span>
            </div>
          </div>
        </div>
    );
  }
}

export default RankItem;
