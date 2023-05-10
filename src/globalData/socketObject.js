import { io } from 'socket.io-client';
import myAlert from "../utils/js/alertMassage";

let socketUrl = `ws://127.0.0.1:65533`;
let socketUrlDebug = `ws://124.221.150.160:65533`;

// let SOCKET_OBJ = io.connect(socketUrl, {transports: ['websocket']});
let SOCKET_OBJ = io.connect(socketUrl, {
  transports: ['websocket'],
});

SOCKET_OBJ.on('connect', () => {
  console.log('SOCKET_OBJ 连接服务器成功');
});

// socket.io 固有事件：丢失连接时触发时间处理器
// SOCKET_OBJ.on('disconnect', (timeout) => {
//   console.log('链接丢失');
//   SOCKET_OBJ.close(); // 关闭连接
// });

SOCKET_OBJ.on('disconnect', (timeout) => {
  console.log('链接丢失');
  SOCKET_OBJ.close(); // 关闭连接
  myAlert("服务器断开连接，1秒后重连");
  setTimeout(() => SOCKET_OBJ.connect(), 1000);
});

SOCKET_OBJ.on('connect_error', (err) => {
  console.warn('SOCKET_OBJ 连接失败：', err);
  console.log('SOCKET_OBJ 启用本地调试模式');
  // 优先连接本地的，连接不上就连接
  SOCKET_OBJ.io.uri = socketUrlDebug;
});

SOCKET_OBJ.on('connect_timeout', () => {
  console.warn('SOCKET_OBJ 连接超时');
});

SOCKET_OBJ.on('error', (err) => {
  console.warn('SOCKET_OBJ 连接错误：', err);
});

SOCKET_OBJ.on('reconnect', (attemptNumber) => {
  console.warn('SOCKET_OBJ 重新连接成功，尝试次数：', attemptNumber);
});

SOCKET_OBJ.on('reconnect_attempt', (attemptNumber) => {
  console.warn('SOCKET_OBJ 正在尝试重新连接，尝试次数：', attemptNumber);
});

SOCKET_OBJ.on('reconnect_failed', () => {
  console.warn('SOCKET_OBJ 重新连接失败');
});

export default SOCKET_OBJ;
