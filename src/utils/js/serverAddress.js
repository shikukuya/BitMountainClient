/**
 * 后端地址
 * by littlefean
 */
// const serverAddress = "http://471d0586.r1.cpolar.top";
// const serverAddress = "http://124.221.150.160:10009";

console.log('serverAddress 启用本地调试模式');
window.serverAddress = 'http://124.221.150.160:10009/';

// let serverAddress = 'http://124.221.150.160:10009/';
fetch('http://127.0.0.1:10009/').then(() => {
  console.log('serverAddress 启用生产环境');
  // serverAddress = 'http://127.0.0.1:10009/';
  window.serverAddress = 'http://127.0.0.1:10009/';
});
// const serverAddress = `${window.location.protocol}//${window.location.host}`;
// export default serverAddress;
