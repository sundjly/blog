``` 
/*
 * @Author: Sundjly 
 * @Date: 2018-02-10 22:10:46 
 * @Last Modified by: 
 * @Last Modified time: 2018-02-10 22:17:54
 * 来自   https: //zhuanlan.zhihu.com/p/27641753
 * webpack的配置： https: //developers.google.com/web/fundamentals/performance/webpack/
 * 
 */

var Promise = function (fn) {
    var promise = this;
    // 状态机的状态
    var PROMISESTATE = {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2,
    };

    // 存储当前的变量的回调函数和标记对象为promise
    promise._fullcall = [], promise._rejcall = [];
    promise._name = 'promise';
    // 执行过程中的状态变化（初始化状态为默认状态）
    var _state = PROMISESTATE.PENDING;
    // 回调函数的参数
    var _value = undefined;

    // 状态变更
    function setState(stateT, valueT) {
        var promise = this;
        _state = stateT;
        _value = valueT;
        handelFun.call(promise); // 传递作用域，并且执行回调函数
    };

    // 根据状态处理回调
    function handelFun() {
        var promise = this,
            isThen;

        if (_state === PROMISESTATE.FULFILLED &&
            typeof promise._fullcall[0] === 'function') {
            isThen = promise._fullcall[0](_value);
        };
        if (_state === PROMISESTATE.REJECTED &&
            typeof promise._rejcall[0] === 'function') {
            isThen = promise._rejcall[0](_value);
        };

        // 对于是否可以继续进行then做判断
        // 1. 不可then的，直接return结束（条件： 无返回值，返回值不是promise对象的）
        // 2. 对于可以then的，讲then的回调进行处理，然后对象之间传递

        if (isThen === undefined || !(typeof isThen === 'object' && isThen._name === 'promise')) return;

        promise._fullcall.shift();
        promise._rejcall.shift(); //清除当前对象使用过的对调

        isThen._fullcall = promise._fullcall;
        isThen._rejcall = promise._rejcall; //将剩下的回调传递到下一个对象
    };

    // promise入口
    function doResolve(fn) {
        var promise = this;
        fn(function (param) {
            setState.call(promise, PROMISESTATE.FULFILLED, param);
        }, function (reason) {
            setState.call(promise, PROMISESTATE.REJECTED, reason);
        });
    };

    // 函数then，处理回调，返回对象保证链式调用
    this.then = function (onFulfilled, onRejected) {
        this._fullcall.push(onFulfilled);
        this._rejcall.push(onRejected);
        return false;
    };

    doResolve.call(promise, fn);
}
```