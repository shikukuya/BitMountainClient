/**
 * 获取从 [0~n) 的整数数组
 * @param n
 * @return {[]}
 */
export default function getArray(n) {
    let res = [];
    for (let i = 0; i < n; i++) {
        res.push(i);
    }
    return res;
}
