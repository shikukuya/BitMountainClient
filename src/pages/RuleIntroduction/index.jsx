import React, {Component} from 'react';
import "./index.css";
import Background from "../../components/Background";

class RuleIntroduction extends Component {
  render() {
    return (
        <div className="rulePage">
          <main>
            <h1>规则介绍</h1>
            <hr/>
            <div className="mood">
              <h2>普通模式</h2>
              <p>双方匹配完成之后共同做一道题，一旦其中一个用户提交并测试通过就会获得胜利。</p>
            </div>
            <div className="mood">
              <h2>极限模式</h2>
              <p>双方匹配完成之后共同做一道题，率先通过的用户获得胜利，出现一次错误就输掉比赛。</p>
            </div>
            <div className="mood">
              <h2>速度模式</h2>
              <p>双方匹配完成后在10分钟内做简单题，10分钟后，谁做完的简单题的数量多，谁就获胜。如果做的题目一样多，则错误少的人获胜。</p>
            </div>
            <div className="mood">
              <h2>优化模式</h2>
              <p>双方共同做一道题，仅有一次提交机会，最终程序运行时间短者获胜</p>
            </div>
          </main>
          <Background/>
        </div>
    );
  }
}

export default RuleIntroduction;
