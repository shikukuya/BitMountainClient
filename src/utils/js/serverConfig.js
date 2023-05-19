/**
 * 后端地址
 * by littlefean
 */
const localAddress = 'http://127.0.0.1:10009/';
const remoteAddress = 'http://124.221.150.160:10009/';

const SERVER_CONFIG = {

  // 当前正在使用的地址
  address: localAddress,

  changeToLocal: function () {
    this.address = localAddress;
  },

  changeToRemote: function () {
    this.address = remoteAddress;
  }
}

/**
 * 能用本地的就优先用本地的
 */
fetch(localAddress).then(() => {
  SERVER_CONFIG.changeToLocal();
  console.log('serverAddress 启用生产环境', SERVER_CONFIG.address);
}).catch((_) => {
  SERVER_CONFIG.changeToRemote();
  console.log('serverAddress 本地未开启，开启远程', SERVER_CONFIG.address);
});

export default SERVER_CONFIG;
