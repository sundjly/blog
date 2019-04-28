## 前言
promise现在已经标准化了，现在异步都应该是用Promise对象去管理的了。

要深入运用promise，还得自己实现以下：

首先，Promise 的几个特性：

1. Promise 捕获错误与 try/catch 相同
2. Promise 拥有状态变化，并且状态变化不可逆
3. Promise 属于微任务
4. Promise 中的.then 回调是异步的
5. Promsie 中.then 每次返回的都是一个新的 Promise
6. Promise 会存储返回值

简易版构造函数实现
```
// 第一步： 列出三大块  this.then   resolve/reject   fn(resolve,reject)
// 第二步： this.then负责注册所有的函数   resolve/reject负责执行所有的函数 
// 第三步： 在resolve/reject里面要加上setTimeout  防止还没进行then注册 就直接执行resolve了
// 第四步： resolve/reject里面要返回this  这样就可以链式调用了
// 第五步： 三个状态的管理 pending fulfilled rejected

function PromiseM(fn){
    var value = null;
    var callbacks = [];
    //加入状态 为了解决在Promise异步操作成功之后调用的then注册的回调不会执行的问题
    var state = 'pending';
    var _this = this;
    
    // 注册所有的回调函数
    this.then = function(fulfilled, rejected) {
        //如果想链式promise 那就要在这边return一个new Promise
        return new PromiseM(function (resolv, rejec){
            // 异常处理
            try {
                switch(state) {
                    case: 'fulfilled': 
                        case:'fulfilled':var data = fulfilled(value);
                         //为了能让两个promise连接起来
                        resolv(data);
                        break;
                    return;
                        case: 'rejected': var data =  rejected(value);
                        //为了能让两个promise连接起来
                        resolv(data);
                        break;
                    // 默认是pending
                    default:
                        callbacks.push(fulfilled);
                        //实现链式调用
                        break;
                }
            }
            catch(e){
                _this.catch(e)
            }
        })
    }
    
    // 执行所有的回调函数
    function resolve(){
        value = valueNew;
        state = 'fulfilled';
        exeute();
    }
    
    //执行所有的回调函数
    function reject(valueNew) {
        value = valueNew;
        state = 'rejected';
        execute();
    }
    
    function execute() {
    //加入延时机制 防止promise里面有同步函数 导致resolve先执行 then还没注册上函数
        setTimeout(function(){
            callbacks.forEach(function(cb){
                value = cb(value);
            })
        }, 0)
    }
    
    this.catch = function(e){
        console.log(JSON.stringify(e));
    }
    
    // 经典 实现异步回调
    fn(resolve, reject);
}

```

ES6的实现：
```
interface IResolve {
  (x: any): void;
}

interface IReject extends IResolve {}

interface IConstructor {
  (resolve: IResolve, reject: IReject): void;
}

enum State {
  PENDDING = "pendding",
  RESOLVED = "resolved",
  REJECTED = "rejected"
}

class MyPromise {
  resolvedCallbacks: Array<Function>;
  rejectedCallbacks: Array<Function>;
  state: State;
  value: any;
  constructor(fn: IConstructor) {
    this.resolvedCallbacks = [];
    this.rejectedCallbacks = [];
    this.state = State.PENDDING;
    this.value = "";
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value: any): void {
    if (this.state === State.PENDDING) {
      this.state = State.RESOLVED;
      this.value = value;
      this.resolvedCallbacks.forEach(cb => cb());
    }
  }

  reject(value: any): void {
    if (this.state === State.PENDDING) {
      this.state = State.REJECTED;
      this.value = value;
      this.rejectedCallbacks.forEach(cb => cb());
    }
  }

  then(resolve: IResolve, reject?: IReject) {
    if (this.state === State.PENDDING) {
      this.resolvedCallbacks.push(resolve);
      this.rejectedCallbacks.push(reject);
    }
    if (this.state === State.RESOLVED) {
      resolve(this.value);
    }
    if (this.state === State.REJECTED) {
      reject(this.value);
    }
  }
}

```
当然，上面的实现没有解决 then 的链式调用问题 （返回一个 Promise 对象）


## 参考
1. [集成promise规范，更优雅的书写代码](https://zhuanlan.zhihu.com/p/27641753)
2. [实现一个完美符合Promise/A+规范的Promise](https://github.com/forthealllight/blog/issues/4)
3. https://juejin.im/post/5ca1ac256fb9a05e6938d2d1
4. 实现一个Promise - MaCong的文章 - 知乎
   https://zhuanlan.zhihu.com/p/62488780
   
5. https://zhuanlan.zhihu.com/p/62834118