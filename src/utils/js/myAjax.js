/**
 * 全局变量的封装
 * @type {
 *  {
 *      PORT: string,
 *      ADDRESS: string,
 *      goIntoQuestionTitle: string
 *  }
 * }
 */
let BitMountain = {
  // ADDRESS: '127.0.0.1',
  ADDRESS: '3551f6e0.r10.cpolar.top',
  PORT: '10009',
  goIntoQuestionTitle: "A+B",
}

/**
 * 手动对ajax进行二次封装
 * @param urlFix 请求路径后缀
 * @param sendJson 发送的json，如果不写则自动变成get请求
 * @return {XMLHttpRequest} 返回一个ajax对象，需要这样写
 * POST("userGetAllDDL", {userName: "张全蛋"}).finish((res) => {
           res 便是自动解析成结果的js对象，可以直接使用了
        });
 */
export default function AJAX(urlFix, sendJson = null) {
  let ajaxObj = new XMLHttpRequest();
  ajaxObj.open(
      sendJson === null ? "GET" : "POST",
      `https://${BitMountain.ADDRESS}/${urlFix}`
  );
  ajaxObj.setRequestHeader("Content-Type", "application/json");
  if (sendJson === null) {
    ajaxObj.send();
  } else {
    ajaxObj.send(JSON.stringify(sendJson));
  }
  // finish 是我自己新创的一个
  ajaxObj.finish = (yourFunc) => {
    ajaxObj.onload = () => {
      let obj = JSON.parse(ajaxObj.responseText);
      yourFunc(obj);
    }
  };
  return ajaxObj;
}
