import React, {Component} from 'react';
import "./index.css";
import PubSub from "pubsub-js"

class MultipleContestListItem extends Component {
  constructor(props) {

    super(props);
    this.index = this.props.index;
    this.state = {
      myStage: 0, // 0 表示还没开始做，1表示开始做了，2表示通过了
      opStage: 0, // 对手对于这道题的状态

      mySubmitArr: [],  // ["py", "cpp"]
      opSubmitArr: [],
    };
  }

  render() {
    const {myStage, opStage, mySubmitArr, opSubmitArr} = this.state;
    return (
        <div className="multiContestItem">
          <div className="stageIcon myStage">
            {this.getStageChar(myStage)}
          </div>
          <div className="stageIcon opStage">
            {this.getStageChar(opStage)}
          </div>

          <div className="submitList mySubmit">
            {this.getSubmitArrayRend(mySubmitArr)}
          </div>

          <div className="submitList opSubmit">
            {this.getSubmitArrayRend(opSubmitArr)}
          </div>

          <div className="questionIcon"
               style={this.getCss()}
               onClick={this.props.clickFunc}>
            {`${this.props.alpha}题`}
          </div>

        </div>
    );
  }

  componentDidMount() {

    /**
     * data
     * {
     *   stage: ?
     *   isMy: {Boolean}
     * }
     */
    this.token1 = PubSub.subscribe(`多题图标${this.index}更新状态`, (_, data) => {
      let max = (a, b) => {
        if (a > b) {
          return a;
        } else {
          return b;
        }
      }
      if (data["isMy"]) {
        let n = this.state.myStage;
        this.setState({myStage: max(n, data["stage"])})
      } else {
        let n = this.state.opStage;
        this.setState({opStage: max(n, data["stage"])})
      }
    });
    /**
     * data
     * {
     *   languageName: "python"
     *   isMy: {Boolean}
     * }
     */
    this.token2 = PubSub.subscribe(`多题图标${this.index}增加提交语言图标`, (_, data) => {
      if (data["isMy"]) {
        let newArr = [...this.state.mySubmitArr, data["languageName"]];
        this.setState({mySubmitArr: newArr});
      } else {
        let newArr = [...this.state.opSubmitArr, data["languageName"]];
        this.setState({opSubmitArr: newArr});
      }
    });
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token1);
    PubSub.unsubscribe(this.token2);
  }

  /**
   * 获取提交次数的渲染形式
   * @param array ["python", "cpp", ... ]
   * @return {JSX.Element|*}
   */
  getSubmitArrayRend = (array) => {
    if (array.length === 0) {
      return <span></span>
    } else {
      return array.map((lanStr, i) => {
        return <span key={i} className={"languageIcon " + lanStr + "Icon"}/>
      })
    }
  }
  getCss = () => {
    const {myStage, opStage} = this.state;
    let res = {}
    if (myStage === 2) {
      res.borderTopLeftRadius = "50%";
      res.borderBottomLeftRadius = "50%";
    }
    if (opStage === 2) {
      res.borderTopRightRadius = "50%";
      res.borderBottomRightRadius = "50%";
    }
    return res;
  }
  getStageChar = (n) => {
    if (n === 0) {
      return ""
    } else if (n === 1) {
      return "✍"
    } else {
      return "👌"
    }
  }
}

export default MultipleContestListItem;
