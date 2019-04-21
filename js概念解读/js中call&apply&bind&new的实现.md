
> 下面的大部分代码来自于 [冴羽大大的blog](https://github.com/mqyqingfeng/Blog/issues/11)
### call
要点：
1. 改变了this的指向，指向call的第一个参数，
2. call前面的那个方法被调用了

#### 1.简单实现：
``` 
var foo ={
  value: 1
}

function bar (){
  console.log(this.value);
}

bar.call(foo);
// call步骤
foo.fn = bar;
foo.fn();
delete foo.fn;
```
##### 存在问题
1. call给定参数执行函数，
2. this 可以传 null， null 的时候，认为是 window
3. 可以有返回值

##### 最终

``` 

Function.prototype.call = function(context) {
  var context = context || window;
  context.fn = this;

  var args = [];
  for(var index = 1, len = arguments.length; index < len; index ++){
    args.push(`arguments[${index}]`)
  }
  //  args 会自动调用 Array.toString()
  var result = eval('context.fn(' + args +')');

  delete context.fn;
  return result;
}

// 当然你可以用 ES6 模拟实现，
Function.prototype.myCall = function(ctx, ...argv) {
	ctx = typeof ctx === 'object' ? ctx || window : {} // 当 ctx 是对象的时候默认设置为 ctx；如果为 null 则设置为 window 否则为空对象
	const fn = Symbol('fn')
	ctx[fn] = this
	ctx[fn](...argv)
	delete ctx[fn]
}

```


### apply
``` 
Function.prototype.apply = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;
  var result;
  if(!arr){
    result = context.fn();
  }
  else{
    var args = [];
    // 模拟类数组的 arguments 的实现
    for (var index = 0,len = arr.length; index < len; index++){
      args.push('arr['+index+']');
    }
    result = eval('context.fn('+args+')');
  }
  delete context.fn;
  return result;
}

```

### bind
> bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

``` 
Function.prototype.myBind = function(ctx) {
	return () => { // 要用箭头函数，否则 this 指向错误
		return this.call(ctx)
	}
}
```
上面的没有考虑到传参的问题：

``` 
// 用箭头函数，这里 this 就指得是调用 mybind 的函数
Function.prototype.mybind = function(ctx, ...argv1) {
  return (...argv2) => {
    return this.call(ctx, ...argv1, ...argv2)
  }
}
```
bind 之后的函数可以 new（此时 this 就会指向那个新生成的对象，其中 bind 中 this 的变化就要忽略）

``` 
Function.prototype.mybind = function (ctx, ...argv1) {
  let _this = this;
  // 这里不能用箭头函数，使用 new 会报错
  let boundFunc = function (...argv2) {
    // this instanceof boundFunc 判断是否是 new 进行调用
    return _this.call(this instanceof boundFunc ? this : ctx, ...argv1, ...argv2);
  };

  return boundFunc;
};
```
this 指向问题解决了但 newObj 实例并未继承到绑定函数原型中的值，还得设置 prototype

``` 
// newObj prototype
Function.prototype.mybind = function (ctx, ...argv1) {
  let _this = this;
  let boundFunc = function (...argv2) {
    return _this.call(this instanceof boundFunc ? this : ctx, ...argv1, ...argv2);
  };
  // 继承调用 bind 的函数的 prototype
  boundFunc.prototype = this.prototype;
};
```
但还有问题，对象之间的原型的属性是共享的：使用一个空的函数来重新 new 一个
``` 
Function.prototype.mybind = function (ctx, ...argv1) {
  let _this = this;
  // 定义一个空的构造函数
  let nop = function () {};
  let boundFunc = function (...argv2) {
    return _this.call(this instanceof boundFunc ? this : ctx, ...argv1, ...argv2);
  };
  nop.prototype = this.prototype;
  // 使用 new 操作符创建实例并赋值，这样 boundFunc 中 prototype 值就不是共享的了
  boundFunc.prototype = new nop();
  return boundFunc;
};
```

#### 问题
``` 
var obj1 = {
    name: 'obj1'
}
var obj2 = {
    name: 'obj2'
}
var obj3 = {
    name: 'obj3'
}
function say() {
    console.log(this.name)
}
var fn = say.bind(obj1).bind(obj2).bind(obj3)
fn()
```
解题思路就是将 bind 用原生的替换，就可以直观的看出问题。
```
(() => {
  return say.call(obj1)
}).bind(obj2).bind(obj3)
```
可以看到 say() 方法的 this 指向就是 obj1

### new
- 生成新的对象
- 绑定 prototype （既然是 new 一个实例，那么实例的 __proto__ 必然要与构造函数的 prototype 相连接）
- 绑定 this
- 返回这个新对象
``` 
function myNew(Constructor) {
  let newObj = {};
  // 可以查看这里了解 __proto__ 与 prototype 的区别于练习
  // 首先明确：不像每个对象都有 __proto__ 属性来标识自己所继承的原型，只有函数才有 prototype 属性。
  // 绑定对象实例的 __proto__ 到构造函数的 prototype （对象的 __proto__ 指向自己构造函数的 prototype）
  newObj.__proto__ = Constructor.prototype;
  // 修改 this 的指向
  Constructor.call(newObj);
  // 返回这个对象
  return newObj;
}
```
### 参考
1. https://github.com/mqyqingfeng/Blog/issues/11
2. https://cnodejs.org/topic/5c813fd490c14711cc8cb5ae
