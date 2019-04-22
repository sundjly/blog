来自[javaScript 函数节流](http://imweb.io/topic/577aa790ea7bb9b760c7adc3)

#### 概念：
javaScript函数节流就是针对调用频率高的函数，通过设置定时器，使其在执行间隔一段时间，才进行下一次的执行，避免重复频繁的调用导致的浏览器性能以及ajax重复调用问题。

#### 经典运用场景： 
resize，scroll，mousedown、mousemove 等事件回调函数的无间断执行。

其主要实现思路运用setTimeout定时器，通过设置缓冲时间，在第一次调用时，创建定时器，并在定时时间结束调用。在第二次调用时，会清除掉前一个定时器并设置新的定时器。

效果点击[demo](https://codepen.io/sundjly/pen/rrZJJP?editors=1111)，只有在停止滑动后，定时结束才执行函数处理逻辑。

```
const throttle = (method, context) => {
  clearTimeout(method.tId);
  method.tId = setTimeout(() => {
    method.call(context);
  },300)
}
// 严格来说 上面这个类似于防抖的实现  
const count = () => {
  console.log('函数调用');
}

window.onresize = () =>{
  console.log('滑动onresize');
  throttle(count);
}

```

如果想间隔相同时间（不管有没有停止滑动），都执行逻辑处理。

```
 var time = +new Date();
    function count(){
        console.log("函数调用:" + (+new Date()-time));
    }


    /**
     * [@param](/user/param)  {Function} 
     * [@param](/user/param)  {[Function]}  延时调用函数
     * [@param](/user/param)  {[Number]}  延迟多长时间
     * [@return](/user/return) {[Number]}  至少多长时间触发一次
     */
    var throttle =  function(fn, delay, mustRun){
        var timer = null,
            previous = null;

        return function(){
            var now = +new Date(),
                context = this,
                args = arguments;
            if (!previous ) previous = now;
            var remaining = now - previous;
            if(mustRun && remaining >= mustRun){
                fn.apply(context, args);
                previous = now;
            }else{
                clearTimeout(timer);
                timer = setTimeout(function(){
                    fn.apply(context, args);
                }, delay);

            }
        }
    }

    window.onscroll = throttle(count, 500, 1000);
```
