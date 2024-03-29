import React, {Component} from 'react';
import "./index.css";
import Background from "../../components/Background";

class TermsAndConditions extends Component {
  render() {
    return (
        <div className="page-terms-and-conditions">
          <h1>用户协议</h1>

          <h2>1. 介绍</h2>
          <p>欢迎使用我们的服务！</p>
          <p>本协议是您与该项目之间的协议，用于规定您使用我们的产品和服务的条款和条件。</p>

          <h2>2. 使用规则</h2>
          <p>您在使用我们的服务时，必须遵守以下规则：</p>
          <ul>
            <li>不得在我们的服务中发布有害、欺诈、虚假、违法、骚扰、诽谤、攻击性或其他违反道德准则的内容；例如提交代码中包涵不恰当内容</li>
            <li>不得利用我们的服务进行任何侵犯他人权利、隐私、知识产权或其他违法行为；例如好友请求信息以及代码中包涵上述内容</li>
            <li>不得对我们的服务进行任何未经授权的访问、攻击或干扰。</li>
          </ul>

          <h2>3. 服务内容</h2>
          <p>我们公司提供的服务内容包括但不限于：</p>
          <ul>
            <li>账户注册和管理</li>
            <li>运行您提交的代码并响应结果</li>
            <li>提供双人竞赛</li>
            <li>提供添加好友以及友谊赛功能</li>
          </ul>

          <h2>4. 隐私政策</h2>
          <p>您提交的密码将会先经过一系列字符串算法，得到新的字符串后使用SHA3系列的512加密算法加密，再提交至服务器</p>
          <p>提交至服务器后还会对哈希值进行二次哈希等之类的操作</p>
          <p>因此即使是服务器的管理员也无法知道您的密码是多少，您之所以能登录是因为登录只需要检验加密后的哈希值是否相等</p>

          <h2>5. 免责声明</h2>
          <p>我们不对以下情况承担责任：</p>
          <ul>
            <li>由于您使用我们的服务而导致的任何直接或间接损失或损害；</li>
            <li>由于任何第三方对您的损失或损害。</li>
          </ul>

          <h2>6. 协议修改</h2>
          <p>我们有权随时修改本协议，修改后的协议将在QQ群上公布</p>
          <Background/>
        </div>
    );
  }
}

export default TermsAndConditions;
