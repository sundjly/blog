async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里

async 比起 generator 的优点：
1. 内置执行器。Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。

2. 更好的语义。 async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

3. 更广的适用性。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

``` 
function spawn(genF) {
  return new Promise(function (resolve, reject) {
    const gen = genF();

    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      // generator 已经 return 了
      if (next.done) {
        return resolve(next.value);
      }

      Promise.resolve(next.value).then(function (v) {
        step(function () {return gen.next(v);});
      }, function (e) {
        step(function () {return gen.throw(e);});
      });
    }
    // 自动执行器
    step(function () {
      return gen.next(undefined);
    });
  });
}
```

## 参考
1. https://github.com/airuikun/Weekly-FE-Interview/issues/14
2. https://segmentfault.com/a/1190000008254704
3. https://segmentfault.com/a/1190000012233339