/**
 * 关于提交代码借助api的
 * by littlefean
 */
import axios from "axios";

export function submitCode() {
    let ajaxObj = new XMLHttpRequest();

    ajaxObj.open("POST", "https://glot.io/api/run/python/latest");
    ajaxObj.setRequestHeader("Content-Type", "application/json");
    ajaxObj.setRequestHeader("Authorization", "Token f3b3f8eb-27c1-40b1-8cbe-84804d440acc");
    ajaxObj.setRequestHeader("crossOrigin", "true");
    console.log(123)
    ajaxObj.send(JSON.stringify({"files": [{"name": "main.py", "content": "print(114514)"}]}));
    // finish 是我自己新绑定的一个属性
    ajaxObj.finish = (yourFunc) => {
        ajaxObj.onload = () => {
            let obj = JSON.parse(ajaxObj.responseText);
            yourFunc(obj);
        }
    };
    return ajaxObj;
}

export function submitCode2() {

    axios('https://glot.io/api/run/python/latest', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Authorization': 'Token f3b3f8eb-27c1-40b1-8cbe-84804d440acc',
        },
        //withCredentials: true,
        credentials: 'same-origin',

        // 内容
        files: [{"name": "main.py", "content": "print(114514)"}]
    }).then(response => {
        console.log(response)
    })
}
