/**
 * 二维数组类
 * by littlefean
 */
export default class Array2d {
  constructor(w, h, ele = 0) {
    this.reshape(w, h, ele);
  }

  // 重新改变形状
  reshape(w, h, defaultValue = 0) {
    this.width = w;
    this.height = h;

    this.arr = [];
    for (let y = 0; y < this.height; y++) {
      let line = [];
      for (let x = 0; x < this.width; x++) {
        line.push(defaultValue);
      }
      this.arr.push(line);
    }
  }

  reshapeFromNewMatrix(matrix) {
    this.height = matrix.length;
    this.width = matrix[0].length;
    this.arr = JSON.parse(JSON.stringify(matrix));
  }

  /**
   * 重新塑形
   * @param w 新的宽度
   * @param h 新的高度
   * @param f 元素的获取函数
   */
  reshapeByFunc(w, h, f) {
    this.width = w;
    this.height = h;

    this.arr = [];
    for (let y = 0; y < this.height; y++) {
      let line = [];
      for (let x = 0; x < this.width; x++) {
        line.push(f());
      }
      this.arr.push(line);
    }
  }

  set(x, y, value) {
    if (0 <= x && x < this.width) {
      if (0 <= y && y < this.height) {
        this.arr[y][x] = value;
        return;
      }
    }
    console.warn(x, y, "位置越界了");
  }

  get(x, y) {
    if (0 <= x && x < this.width) {
      if (0 <= y && y < this.height) {
        return this.arr[y][x]
      }
    }
    console.warn(x, y, "位置越界了");
    return null;
  }

  toString() {
    let str = "";
    for (let y = 0; y < this.height; y++) {

      for (let x = 0; x < this.width; x++) {
        str += this.arr[y][x].toString();
      }
      str += "\n"
    }
    return str;
  }

  /**
   * 获取二维数组的一份深拷贝
   */
  getSnapshot() {
    return JSON.parse(JSON.stringify(this.arr));
  }
}
