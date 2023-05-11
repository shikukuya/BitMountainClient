/**
 * 后端地址
 * by littlefean
 */

console.log('serverAddress 启用本地调试模式');

const localAddress = 'http://127.0.0.1:10009/';
const remoteAddress = 'http://124.221.150.160:10009/';


const SERVER_CONFIG = {

  // 当前正在使用的地址
  address: remoteAddress,

  changeToLocal: () => {
    this.address = localAddress;
  },

  changeToRemote: () => {
    this.address = remoteAddress;
  }
}

fetch(localAddress).then(() => {
  console.log('serverAddress 启用生产环境');
  SERVER_CONFIG.changeToLocal();
}).catch((error) => {
  console.warn('本地未开启，开启远程', error);
});

export default SERVER_CONFIG;
