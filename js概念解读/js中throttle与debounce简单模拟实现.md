## 1. debounce 
防抖，在一个时间段内，只触发最新的一次事件

简单实现：
``` 
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}
```
存在问题：
1. this 的指向问题
2. 传参问题

优化之后

``` 

function debounce(fnc, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}
```

## throttle 节流
高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。
### 使用时间戳
``` 
function throttle(func, delay){
  // 保存上一次触发的事件
  let context;
  let previous = 0;

  return function(...args){
    let now = new Date();
    context = this;

    if(now - previous > delay) {
      func.call(context, ...args);
      previous = now;
    }
  }
}
```
### 定时器
``` 
function throttle(func, delay) {
  let timeout;
  return function(...args){
    let _this = this;
    if(!timeout){
      timeout = setTimeout(function(){
        timeout = null;
        func.call(_this, ...args);
      }, delay)
    }
  }
}
```
比较两个方法：

1. 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
2. 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件
### 双剑合璧
要求就是第一次立刻执行，停止触发时还能再执行一次

``` 
function awesomeThrottle(func, delay) {
  let timeout, context, args, result;
  let previous = 0;
  let later = function () {
    // 获取当前时间戳
    previous = +new Date();
    timeout = null;
    func.apply(context, args);
  };

  let throttle = function () {
    let now = +new Date();
    //下次触发 func 剩余的时间
    let remaining = delay - (now - previous);
    context = this;
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };

  return throttle;

}
```












## 参考
1. https://github.com/mqyqingfeng/Blog/issues/22
2. https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5