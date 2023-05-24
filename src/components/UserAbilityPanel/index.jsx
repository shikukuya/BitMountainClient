import React, {Component} from 'react';
import "./index.css";
import {computeLevel} from "../../model/level";
import AbilityCircle from "../AbilityCircle";
import PubSub from "pubsub-js"
import {randint} from "../../utils/js/random";
import USER_DATA from "../../globalData/userData";

class UserAbilityPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,

      name: USER_DATA.name,
      headSculpture: USER_DATA.headSculpture,
      score: USER_DATA.score,   // 当前分数
      maxScore: USER_DATA.maxScore,  // 最大分数
      winCount: USER_DATA.winCount,  // 胜利场数
      loseCount: USER_DATA.loseCount,  // 失败场数
      matchCount: USER_DATA.matchCount,  // 对局总数
      lastOnline: USER_DATA.lastOnline,
      languageList: ["python", "cpp"],


      abilitys: [
        {title: "数组", w: 120, h: 120, x: 20, y: 20, ability: randint(3, 20)},
        {title: "图论", w: 120, h: 120, x: 60, y: 40, ability: randint(3, 20)},
        {title: "二叉树", w: 100, h: 100, x: 70, y: 20, ability: randint(3, 20)},
        {title: "字符串", w: 80, h: 80, x: 25, y: 42, ability: randint(3, 20)},
        {title: "数学", w: 75, h: 75, x: 10, y: 70, ability: randint(3, 20)},
        {title: "数论", w: 50, h: 50, x: 5, y: 70, ability: randint(3, 20)},
        {title: "概率", w: 50, h: 50, x: 5, y: 80, ability: randint(3, 20)},
        {title: "几何", w: 50, h: 50, x: 15, y: 85, ability: randint(3, 20)},
        {title: "位运算", w: 60, h: 60, x: 10, y: 58, ability: randint(3, 20)},
        {title: "链表", w: 75, h: 75, x: 82, y: 25, ability: randint(3, 20)},
        {title: "栈", w: 60, h: 60, x: 30, y: 60, ability: randint(3, 20)},
        {title: "递归", w: 60, h: 60, x: 37, y: 70, ability: randint(3, 20)},
        {title: "队列", w: 60, h: 60, x: 37, y: 55, ability: randint(3, 20)},
        {title: "广度优先搜索", w: 120, h: 60, x: 45, y: 55, ability: randint(3, 20)},
        {title: "深度优先搜索", w: 170, h: 70, x: 45, y: 66, ability: randint(3, 20)},
        {title: "动态规划", w: 120, h: 120, x: 35, y: 10, ability: randint(3, 20)},
        {title: "矩阵", w: 60, h: 60, x: 35, y: 35, ability: randint(3, 20)},
        {title: "二分查找", w: 80, h: 80, x: 12, y: 10, ability: randint(3, 20)},
        {title: "贪心", w: 50, h: 50, x: 23, y: 10, ability: randint(3, 20)},
        {title: "排序", w: 50, h: 50, x: 28, y: 5, ability: randint(3, 20)},
        {title: "双指针", w: 55, h: 55, x: 15, y: 25, ability: randint(3, 20)},
        {title: "滑动窗口", w: 75, h: 75, x: 5, y: 25, ability: randint(3, 20)},
        {title: "前缀和", w: 55, h: 55, x: 10, y: 38, ability: randint(3, 20)},
        {title: "单调栈", w: 55, h: 55, x: 24, y: 60, ability: randint(3, 20)},
        {title: "最短路", w: 60, h: 60, x: 55, y: 30, ability: randint(3, 20)},
        {title: "堆", w: 60, h: 60, x: 63, y: 25, ability: randint(3, 20)},
        {title: "并查集", w: 60, h: 60, x: 75, y: 40, ability: randint(3, 20)},
        {title: "字典树", w: 60, h: 60, x: 70, y: 8, ability: randint(3, 20)},
      ]
    }
  }

  render() {

    if (this.state.isShow) {
      return (
          <div className="components-user-ability-panel">
            <h2>详细信息</h2>
            <div className="content">
              <div className="left">
                <div className="line">
                  <img
                      className="headImg"
                      src={require(`../../headImgs/${this.state.headSculpture}.png`)}
                      alt=""/>
                  <span>{this.state.name}</span>

                  <img
                      className="levelImg"
                      src={require(`../../levelIcon/level${computeLevel(this.state.score)}.png`)}
                      alt=""/>
                  <span className="score">{this.state.score}</span>
                </div>
                <div className="line">
                  最大分数：<span>{this.state.maxScore}</span>
                </div>
                <div className="line">
                  胜利场数：<span>{this.state.winCount}</span>
                </div>
                <div className="line">
                  失败场数：<span>{this.state.loseCount}</span>
                </div>
                <div className="line">
                  对局总数：<span>{this.state.matchCount}</span>
                </div>
                <div className="line">
                  常用语言：<span>{
                  this.state.languageList.map((cur, i) => {
                    return <span key={i} className={"languageIcon " + cur + "Icon"}/>
                  })
                }</span>
                </div>
              </div>
              <div className="right">
                {
                  this.state.abilitys.map((curObj, i) => {
                    return <AbilityCircle {...curObj} key={i}/>
                  })
                }

              </div>
            </div>
            <button className="close" onClick={this.handleClose}>X</button>
          </div>
      );
    }
  }

  componentDidMount() {
    /**
     * data {
     *
     *   "数组": 13,
     *   ...
     *
     * }
     */
    this.token = PubSub.subscribe("技能细胞面板展开并更新", (_, dataList) => {
      this.setState({isShow: true});
      let newArr = this.state.abilitys;
      for (let abilityObj of dataList) {
        for (let itemObj of newArr) {
          if (itemObj.title === abilityObj.title) {
            itemObj.ability = abilityObj.ability;
          }
        }
      }
      this.setState({abilitys: newArr});
    });
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token);
  }

  handleClose = () => {
    this.setState({isShow: false});
  }
}

export default UserAbilityPanel;
