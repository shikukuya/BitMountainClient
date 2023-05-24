import React, {Component} from 'react';
import "./index.css";
import getArray from "../../utils/js/range";
import {computeLevel, getLevelName} from "../../model/level";
import Background from "../../components/Background";
import USER_DATA from "../../globalData/userData";

class HonorPath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrollTipShow: true,
    }
    this.handleWheel = this.handleWheel.bind(this);
  }

  render() {
    const {isScrollTipShow} = this.state;
    return (
        <div className="page-honor-path"
             ref="honorPathPage"
             onWheel={this.handleWheel}>
          <div className="topBox">
            <h1>荣誉之路</h1>
            <p className="notice">赢取分数，解锁新模式，勇攀更高联赛段位！</p>
            {USER_DATA.isLogin ? null : <p className="notice">登录后可以显示您的位置</p>}
            {isScrollTipShow ? <p className="notice scrollTips">滑动滚轮向右</p> : null}
          </div>

          {/*滚动内容*/}
          <div className="inner" ref="inner">
            {
              getArray(7).map(i => {
                return (
                    <div className="levelItem"
                         style={{
                           left: `${i * 300 + 200}px`,
                           top: `${60 - (i * 7)}%`,
                           animationDelay: `-${i}s`,
                         }}
                         key={"name" + i}>
                      <div className="levelText">
                        {getLevelName(i * 100)}
                      </div>
                      <img
                          className="levelImg"
                          src={require(`../../levelIcon/level${computeLevel(i * 100)}.png`)}
                          alt="加载失败"/>
                    </div>
                )
              })
            }
            {
              getArray(7).map(i => {
                return (
                    <div className="scoreText"
                         style={{
                           left: `${i * 300 + 200}px`,
                           top: `${90 - (i * 7)}%`
                         }}
                         key={"score" + i}>
                      {i * 100}
                    </div>
                )
              })
            }
            <div className="way"/>
            <div className="userWay" style={{width: `${this.getLeftByScore(USER_DATA.score)}px`}}/>
          </div>
          <Background/>
        </div>

    );
  }

  getLeftByScore = n => {
    return 200 + 3 * n;
  }

  handleWheel(e) {
    this.setState({isScrollTipShow: false});
    const container = this.refs.honorPathPage;
    // container.scrollAmount = 500;
    const containerScrollPosition = container.scrollLeft;
    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY * 4,
      behavior: "smooth"
    });
    // e.preventDefault();
  }
}

export default HonorPath;
