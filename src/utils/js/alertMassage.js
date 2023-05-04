import PubSub from "pubsub-js";

/**
 *
 * by littlefean
 */
export default function myAlert(text) {
  PubSub.publish("屏幕打印接收新消息", {"text": text});
}
