import React, {Component} from 'react';

import "./index.css"

class Question extends Component {

  render() {
    const {
      title,
      describe,
      inputDescribe,
      outputDescribe,
      ioEgg,  // [{in: "", out: "" }, {} ... ]
      tips,
      tags,
      questionBackground,
    } = this.props;
    return (
        <div className="questionArea">
          <h1>{title}</h1>
          <h2>题目背景</h2>
          <p>{questionBackground}</p>
          <h2>题目描述</h2>
          <p dangerouslySetInnerHTML={{__html: `${describe}`}} />
          <h2>交互格式说明</h2>
          <div className="leftRight">
            <div className="left">
              <h3>输入</h3>
              <p dangerouslySetInnerHTML={{__html: `${inputDescribe}`}} />
              {/*<p>{inputDescribe}</p>*/}

            </div>
            <div className="right">
              <h3>输出</h3>
              {/*<p>{outputDescribe}</p>*/}
              <p dangerouslySetInnerHTML={{__html: `${outputDescribe}`}} />
            </div>
          </div>
          <h2>交互格式样例</h2>
          <div className="leftRight">
            <div className="left">
              <h3>输入</h3>
            </div>
            <div className="right">
              <h3>输出</h3>
            </div>
          </div>
          {
            ioEgg.map((ioObj, idx) => {
              return (
                  <div className="leftRight" key={idx}>
                    <div className="left">

                      <div className="showArea">
                        {
                          ioObj["in"].split("\n").map((str, idx) => {
                            return <div className="line" key={idx}>{str}</div>
                          })
                        }
                      </div>
                    </div>
                    <div className="right">

                      <div className="showArea">
                        {
                          ioObj["out"].split("\n").map((str, idx) => {
                            return <div className="line" key={idx}>{str}</div>
                          })
                        }
                      </div>
                    </div>
                  </div>
              )
            })
          }


          <h2>提示</h2>
          {/*<p>{tips}</p>*/}
          <p dangerouslySetInnerHTML={{__html: `${tips}`}} />

          <h2>标签</h2>
          <div className="tags">
            {
              tags.map((str, idx) => {
                return <span className="tag" key={idx}>{str}</span>
              })
            }
          </div>
          {/*<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML"/>*/}
        </div>
    );
  }
  componentDidMount() {

  }

  transEggStr = (str) => {
    let arr = str.split("\n");
    let res = "";
    for (let line of arr) {
      res += line + "<br/>";
    }
    return res;
  }
}

export default Question;
