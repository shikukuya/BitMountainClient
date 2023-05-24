import React, {Component} from 'react';
import "./index.css";
import getArray from "../../utils/js/range";
import {writeFont} from "../../utils/js/ctxTools";
import Array2d from "../../utils/js/array2d";
import {choice, randint} from "../../utils/js/random";
import PubSub from "pubsub-js"


class Background extends Component {
  constructor(props) {
    super(props);
    this.gridDiv = React.createRef();
    this.topDiv = React.createRef();
    this.digitCanvas = React.createRef();

    this.canvasW = 200;
    this.canvasH = 200;

    this.matrixWidth = 125;
    this.matrixHeight = 50;

    this.matrixBoxLen = 10;
    this.floatMatrix = new Array2d(this.matrixWidth, this.matrixHeight, 0);
    this.fallBallMatrix = new Array2d(this.matrixWidth, this.matrixHeight, 0);
    this.time = 0;
    this.charset = "01";
    this.fallPullMod = 1;  // 模多少释放一次下坠球
    this.pullNumPreLine = 3;  // 每一行有几个下坠球
    // this.intervalFrequency = 100;  // 定时器速度参数
    this.isFast = false;

    this.matrixDataInit();

    this.greenColor = {r: 1, g: 255, b: 20};
    this.redColor = {r: 255, g: 100, b: 100};
    this.isRed = false;

    this.state = {
      mountainArr: [
        // h, r
        {h: 20, r: 70, x: 400},
        {h: 50, r: 120, x: 500},
        {h: 100, r: 200, x: 700},
        {h: 30, r: 100, x: 1200},
      ]
    }
  }

  changeMountainHeight = (higher) => {
    for (let m of this.state.mountainArr) {
      if (higher) {
        m.h *= 2;
        m.r *= 2;
      } else {
        m.h /= 2;
        m.r /= 2;

      }
    }
    this.setState({mountainArr: this.state.mountainArr});
  }

  // 矩阵数据初始化
  matrixDataInit = () => {
    // 初始化下坠球
    for (let y = 0; y < this.matrixHeight; y++) {
      if (y % this.fallPullMod === 0) {
        // 开始添加下坠球
        for (let i = 0; i < this.pullNumPreLine; i++) {
          let x = randint(0, this.matrixWidth);
          this.fallBallMatrix.set(x, y, 1);
        }
      }
    }
    this.updateFloatMatrix();
  }

  // 矩阵数据迭代一次
  matrixTick = () => {
    this.time++;
    // 新增一个下坠球
    if (this.time % this.fallPullMod === 0) {
      for (let i = 0; i < this.pullNumPreLine; i++) {
        let addIndex = randint(0, this.matrixWidth);
        this.fallBallMatrix.set(addIndex, 0, 1);
      }
    }
    // 所有下落球向下移动
    for (let y = this.matrixHeight - 1; y >= 0; y--) {
      // 如果当前正在扫描最后一层
      if (y === this.matrixHeight - 1) {
        // 那么是下坠球就删除，全部抹平false
        for (let x = 0; x < this.matrixWidth; x++) {
          this.fallBallMatrix.set(x, y, 0);
        }
        continue;
      }
      for (let x = 0; x < this.matrixWidth; x++) {
        // 如果遇到了 true，就让他往下坠
        if (this.fallBallMatrix.get(x, y)) {
          this.fallBallMatrix.set(x, y, 0);
          this.fallBallMatrix.set(x, y + 1, 1);
        }
      }
    }
    this.updateFloatMatrix();
  }

  // 根据下坠球数组生成半透明小数数组
  updateFloatMatrix = () => {
    for (let y = this.matrixHeight - 1; y > 0; y--) {
      for (let x = 0; x < this.matrixWidth; x++) {
        if (this.fallBallMatrix.get(x, y)) {
          for (let dy = 0; dy >= -5; dy--) {
            // dy: 0    -1          -2  -3  -4
            // op: 1    1+(-1/5)    1+(-2/5)
            if (y + dy < 0) {
              break;
            }
            this.floatMatrix.set(x, y + dy, 1 + (dy / 5))
          }
        }
      }
    }
  }

  // 数字雨渲染一次
  matrixRend = () => {
    let canvas = this.canvas1;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    // console.log(this.floatMatrix);
    let curColor = this.greenColor;
    if (this.isRed) {
      curColor = this.redColor;
    }
    for (let y = 0; y < this.matrixHeight; y++) {
      for (let x = 0; x < this.matrixWidth; x++) {
        let color = `rgba(${curColor.r}, ${curColor.g}, ${curColor.b}, ${this.floatMatrix.get(x, y)})`;
        writeFont(
            ctx,
            choice(this.charset),
            x * this.matrixBoxLen,
            y * this.matrixBoxLen,
            color,
            this.matrixBoxLen
        );
      }
    }
  }

  // 组件已经挂载上去了
  componentDidMount() {
    let w = this.topDiv.current.offsetWidth;
    let h = this.topDiv.current.offsetHeight;
    this.canvasW = w;
    this.canvasH = h;
    this.canvas1.height = h;
    this.canvas1.width = w;

    this.rendAni = setInterval(() => {
      if (this.isFast) {
        // this.matrixTick();
        this.matrixTick();
        this.matrixRend();
      } else {
        this.matrixTick();
        this.matrixRend();
      }

    }, 100);

    // 监听颜色更改
    this.token1 = PubSub.subscribe("数字雨更改颜色", (_, data) => {
      if (data["color"] === "red") {
        this.isRed = true;
        this.changeMountainHeight(true);
      } else {
        this.isRed = false;
        this.changeMountainHeight(false);
      }


    });

    // 监听下雨大小更改
    this.token2 = PubSub.subscribe("数字雨更改大小", (_, data) => {
      this.pullNumPreLine = data["number"];
    });

    // 监听下雨速度
    this.token3 = PubSub.subscribe("数字雨更改速度", (_, data) => {
      this.isFast = data["isFast"]
    });
  }

  // 组件即将卸载
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.rendAni);
    PubSub.unsubscribe(this.token1);
    PubSub.unsubscribe(this.token2);
    PubSub.unsubscribe(this.token3);

  }

  render() {
    const {mountainArr} = this.state;

    return (
        <div className="components-background-area">

          <div className={this.isRed ? "top redShadow" : "top greenShadow"}
               ref={this.topDiv}>
            <canvas className="digitCanvas" ref={c => this.canvas1 = c}/>

            {/*画一些山*/}
            {
              mountainArr.map((mObj, i) => {
                return <div className={this.isRed ? "redTriangle" : "greenTriangle"} key={i} style={
                  {
                    left: `${mObj.x - mObj.r}px`,
                    borderWidth: `${mObj.h}px ${mObj.r}px`,
                    filter: this.isRed ? "" : "blur(5px)",
                  }
                }/>
              })
            }
          </div>

          {/*底部网格*/}
          <div className="down" style={this.isRed ? {perspective: "400px"} : {perspective: "600px"}}>
            <div className="grid" ref={this.gridDiv}>
              {
                getArray(10).map((y) => {
                  return <div className="gridLine" key={y}>
                    {
                      getArray(18).map((x) => {
                        return <div className={this.isRed ? "box redBox" : "box greenBox"}
                                    style={{
                                      animationPlayState: this.badAnimation() ? "paused" : "running",
                                    }}
                                    key={x}/>
                      })
                    }
                  </div>
                })
              }
            </div>
          </div>
        </div>
    );
  }

  // 获取地板瓷砖的style
  badAnimation = () => {
    return !/Edge\/|OPR\/|Chrome\/[\d]+/.test(navigator.userAgent);
  }
}

export default Background;
