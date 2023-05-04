/**
 * 在范围 [a, b) 上随机整数
 */
export const randint = (a, b) => Math.floor(Math.random() * (b - a) + a);

/**
 * 在范围 [a, b) 上随机小数
 */
export const uniform = (a, b) => Math.random() * (b - a) + a;

/**
 * 在数组中随机选择一个元素
 * @param arr {Array}
 */
export const choice = (arr) => arr[randint(0, arr.length)]

