import React, {Component} from 'react';
import "./index.css";

/**
 * 用于在好友界面、历史对局界面，没有登录的情况下进行展示
 */
class UnLogin extends Component {
    constructor(props) {
        super(props);
        this.charAni1 = React.createRef();
        this.charAni2 = React.createRef();
        this.charAni3 = React.createRef();
        this.t = 0;
        this.charArr = ["/", "-", "\\", "|"];
    }

    render() {
        return (
            <div className="unLoginHint">
                <h3>
                    <code ref={this.charAni1}>/</code>
                    请您先登录
                    <code ref={this.charAni2}>/</code>
                </h3>
                <p>由于您没有登录，所以这里无法显示数据</p>
                <p>所以请您先点击导航栏顶部的登录</p>
            </div>
        );
    }

    componentDidMount() {
        this.ani = setInterval(() => {
            this.t++;
            this.charAni1.current.innerText = this.charArr[this.t % this.charArr.length];
            this.charAni2.current.innerText = this.charArr[this.t % this.charArr.length];
        }, 150);
    }

    componentWillUnmount() {
        clearInterval(this.ani);
    }
}

export default UnLogin;
