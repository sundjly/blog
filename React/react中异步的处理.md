俗话说异步是万恶之源，但是没有异步是万万不行的
<!--more-->


#### 问题引出:

- 在react里面的一个父组件中通过发起请求获取后台的数据，然后传递给子组件，发现在子组件用到该数据时并没有触发相应的改变。打开谷歌控制台发现xhr请求还在pending。因此就总结了异步的处理。

#### js异步的几种方式

##### 回调 
回调函数的优点是简单、容易理解和部署，缺点是不利于代码的阅读和维护，各个部分之间高度耦合（Coupling），流程会很混乱，而且每个任务只能指定一个回调函数。

##### [事件监听](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html)
参考阮老师的解释
##### 发布/订阅
[来自于--JavaScript设计模式与开发实践](https://book.douban.com/subject/26382780/)
```
const event = {

  clientList: [],

  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
  },

  trigger() {
    let key = Array.prototype.shift.call(arguments);
    let fns = this.clientList[key];

    if (!fns || fns.length === 0) {
      return false;
    }
    for (let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
      //arguments 是trigger带上的参数
    }
  },

  //  移除事件
  remove(key, fn) {
    let fns = this.clientList[key];
    if(!fns) return false;
    if(!fn){
      fns && (fns.length = 0);
    }else{
      for(let i = fns.length -1; i>=0; i--){
        let _fn = fns[i];
        if(_fn == fn){
          fns.splice(i,1); //删除订阅者的回调函数
        }
      }
    }
  }
};
```
上面在使用的时候还没有解决命名冲突的问题。具体使用的代码应该充分考虑

```
// 解决命名冲突问题
var globalEvent = (function () {
  var global = this, Event,
    _default = 'default';

  Event = function () {
    var _listen,
      _trigger,
      _remove,
      _slice = Array.prototype.slice,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      find,
      each = function (ary, fn) {
        var ret;
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };

    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };

    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };

    _trigger = function () {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        ret,
        stack = cache[key];

      if (!stack || !stack.length) {
        return;
      }

      return each(stack, function () {
        return this.apply(_self, args);
      });
    };

    _create = function (namespace) {
      var namespace = namespace || _default;
      var cache = {},
        offlineStack = [], //离线事件
        ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
            if (last === 'last') {
              offlineStack.length && offlineStack.pop()();
            } else {
              each(offlineStack, function () {
                this();
              });
            }
            offlineStack = null;

          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },
          remove: function (key, fn) {
            _remove(key, cache, fn);
          },
          trigger: function () {
            var fn,
              args,
              _self = this;

            _unshift.call(arguments, cache);
            args = arguments;
            fn = function () {
              return _trigger.apply(_self, args);
            };

            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          }
        };
      return namespace ? (namespaceCache[namespace] ?
          namespaceCache[namespace] : namespaceCache[namespace] = ret
      ) : ret;
    };

    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        var event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        var event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        var event = this.create();
        event.trigger.apply(this, arguments);
      }
    };
  }();
  return Event;

})();
// 运用了虚拟代理，
```


##### Promise
每一个异步任务返回一个Promise对象，该对象有一个then方法，允许指定回调函数。
在promise里面主要作用就是将毁掉嵌套书写为链式调用的方式，其中可以给then方法传递函数，将多个依赖异步拆分，（方便维护，可扩展性）。对于需要同时得到结果的多个异步，就可以使用Promise.all的方法


#### 参考：
http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html

https://zhuanlan.zhihu.com/p/32911022

http://facebook.github.io/react

http://www.jackcallister.com/2015/01/05/the-react-quick-start-guide.html

http://ryanclark.me/getting-started-with-react/