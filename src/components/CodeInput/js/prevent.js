/**
 *
 * by littlefean
 */
/**
 * 阻止相关操作
 */
export default function preventFunction(event) {
  return !(
      (event.ctrlKey && 82 === event.keyCode) || //禁止ctrl+R
      (event.ctrlKey && 18 === event.keyCode) || //禁止ctrl+N
      (event.shiftKey && 121 === event.keyCode) || //禁止shift+F10
      (event.altKey && 115 === event.keyCode) //禁止alt+F4
  ) || (event.returnValue = false);
}
