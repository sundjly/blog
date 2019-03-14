### 前言
今天在帮其他人解决一个问题的时候，遇到了一个需求：在input框change的时候发起一个异步请求，对于请求一般做法都要防抖，但是却遇到了取不到value的值的情况。
简化代码可以查看 [这里](https://codesandbox.io/s/zk7qyww5km)
关键代码：
```
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Input } from "antd";
import _ from "lodash";
const changeValue = e => {
  const value = e.target.value;
  console.log("sdj", e);
  console.log("sdj", value);
  const debugeDebounce = _.debounce(() => {
    fetchAjax(e);
    // fetchAjax(value);
  }, 900);
  debugeDebounce();
};

const fetchAjax = e => {
  console.log("sdj222", e);
};

ReactDOM.render(
  <Input placeholder="Basic usage" onChange={changeValue} />,
  document.getElementById("container")
);

```

在fetchAjax中取到的e.target为null的情况，在其中经过断点调试，发现了其中的缘由。

首先,在changeValue中，事件触发，就能获取到event对象，其中主要就是event.target就是当前触发事件的dom对象，由于debounce延迟执行，导致了changeValue函数已经执行完了，进入了react-dom中相关一系列操作(进行了一系列复杂的操作)，下面给出最关键的executeDispatchesAndRelease，   executeDispatchesAndRelease方法释放event.target的值

```
        /**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */
        var executeDispatchesAndRelease = function(event) {
            if (event) {
                executeDispatchesInOrder(event);
                if (!event.isPersistent()) {
                    event.constructor.release(event);
                }
            }
        };
```
具体的可以自己断点查看相关event的值的变化


由于event在debounce中作为了参数，内存中没有清除，执行上面的方法 `event.target = null`;
event为引用类型，一处改变，所有用到的地方都会改变。导致了debounce中event也发生了变化。

### 解决
明白了上面的一些知识，就知道应该怎么修改代码了（把用到的值存在一个变量中）
```
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Input } from "antd";
import _ from "lodash";
const changeValue = e => {
  const value = e.target.value;
  console.log("sdj", e);
  console.log("sdj", value);
  const debugeDebounce = _.debounce(() => {
  
    -- fetchAjax(e);
    ++ fetchAjax(value);
    
  }, 900);
  debugeDebounce();
};

const fetchAjax = e => {
  console.log("sdj222", e);
};

ReactDOM.render(
  <Input placeholder="Basic usage" onChange={changeValue} />,
  document.getElementById("container")
);

```
### 总结
工作中的一些问题还是值得去挖掘的，总会有一定的收获！

如果有错误或者不严谨的地方，请务必给予指正，十分感谢!
### 参考

1. [https://stackoverflow.com/questions/26496176/when-logging-an-event-object-currenttarget-is-null-but-when-logging-event-curr](https://stackoverflow.com/questions/26496176/when-logging-an-event-object-currenttarget-is-null-but-when-logging-event-curr)
2. [https://developer.mozilla.org/zh-CN/docs/Web/API/Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)

