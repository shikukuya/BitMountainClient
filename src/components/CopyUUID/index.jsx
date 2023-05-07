import React, { Component } from 'react';
import USER_DATA from '../../globalData/userData';
import './index.css';

class CopyUUID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: '未连接',
    };
    this.uuidEle = React.createRef();
    this.uuidCopyEle = React.createRef();
    this.btn = React.createRef();
    this.btnText = '复制';
  }

  render() {
    const { uuid } = this.state;
    const { uuidEle, uuidCopyEle, btn, copyHandle, btnText } = this;
    if (USER_DATA.isLogin) {
      return (
        <div className="line copyUUIDPanel">
          <span>你的ID：</span>
          <button className="copyBtn" onClick={copyHandle} ref={btn}>
            {btnText}
          </button>
          <div className="userId" ref={uuidEle}>
            {uuid}
          </div>
          <textarea ref={uuidCopyEle} value={uuid} readOnly="readOnly" />
        </div>
      );
    } else {
      return (
        <div className="line">
          <div className="userId">请您先登录</div>
        </div>
      );
    }
  }

  copyHandle = () => {
    this.uuidCopyEle.current.select();
    this.uuidCopyEle.current.setSelectionRange(
      0,
      this.uuidCopyEle.current.value.length
    );
    document.execCommand('copy');

    this.btn.current.innerText = '已经复制';
    setTimeout(() => {
      this.btn.current.innerText = '复制';
    }, 1000);
  };

  componentDidMount() {
    if (USER_DATA.isLogin) {
      this.setState({ uuid: USER_DATA.id });
    }
  }
}

export default CopyUUID;
