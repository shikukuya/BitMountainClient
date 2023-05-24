import React, {Component} from 'react';
import {choice} from "../../utils/js/random";

import "./index.css";


class Matching extends Component {
  constructor(props) {
    super(props);
    this.tipWordsArr = [
      "根据数据范围猜测算法：在阅读题目时，首先要看到数据范围。如果数据范围很小，通常可以使用暴力算法。如果数据范围很大，可能需要使用更高效的算法，例如动态规划或分治算法。",
      "有时，题目会给出一些已知条件，可以利用这些条件来简化问题。",
      "在编写算法时，要注意处理边界条件，即最小值和最大值的情况。",
      "在编写算法时，可以使用一些技巧来优化算法的效率。例如，可以使用空间换时间的技巧，使用哈希表来快速查找数据。",
      "在解决问题时，可以利用数据结构来存储和操作数据。",
      "在编写算法时，要及时调试代码，查看每一步的结果，以确保算法的正确性。",
      "在刷题时，可以将题目分类，找到相似的题目进行练习。"
    ];
    let cls = this;
    this.state = {
      currentTips: choice(cls.tipWordsArr),
      waitingTime: 0,  // 用户等了多少秒
    }
  }


  render() {
    return (
        <div className="components-match-area">
          <h2>匹配中……{this.state.waitingTime}</h2>
          {
            this.state.waitingTime > 3 ? (
                <button className="cancelBtn" onClick={this.props.cancelHandle}>取消匹配</button>
            ) : null
          }
          <div className="waiting">

            <div className="box">
              <div className="box">
                <div className="box">
                  <div className="box">
                    <div className="box">
                      <div className="box">
                        <div className="box">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tips">{this.state.currentTips}</div>
        </div>
    );
  }

  componentDidMount() {
    // 每隔5秒换一句话
    this.changeTips = setInterval(() => {
      this.setState({currentTips: choice(this.tipWordsArr)});
    }, 5 * 1000);

    // 用户等待时间增加
    this.waitInterval = setInterval(() => {
      let n = this.state.waitingTime;
      this.setState({waitingTime: n + 1});
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.changeTips);
    clearInterval(this.waitInterval);
  }
}

export default Matching;
