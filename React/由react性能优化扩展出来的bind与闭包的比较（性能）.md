### 前言
最近由于在看一些react 优化的方面，注意到了之前没有注意到的东西，都知道在react DOM事件的绑定方式有几种方式：

1. 在constructor中进行绑定。

2. 或者用箭头函数（无this）。

3. 对于需要动态传参的形式：

    - 可以使用闭包的方式
    
    - 或者可以直接把处理函数传入子组件，子组建时可以拿到参数，再执行父组件的处理函数就可以了

```
    class App extends Component {
    removeCharacter = index => () => {
        const {list} = this.state;
        list.splice(index, 1);
        this.setState({
            list
        })
    }

    render() {
        return (
            <div>
               {
                    this.state.list.map((value, index) =>(
                        <div 
                            onClick={this.removeCharacter(index)}
                            key={value.id}
                            data={value}
                        >
                            点击我
                        </div>
                    ))
               }
            </div>
        )
    }
}

// 子组件处理的方式
class OtherApp extends Component {
    removeCharacter = index => {
        const {list} = this.state;
        list.splice(index, 1);
        this.setState({
            list
        })
    }
    render() {
        return (
            <div>
                {
                    this.state.list.map((value, index) =>(
                        <Child 
                            onClick={this.removeCharacter}
                            index={index}
                            key={value.id}
                            data={value}
                        />
                    ))
                }
            </div>
        )
    }
}

class Child extends Component {
    handleClick = () => {
        const { index, onClick} = this.props;
        onClick(index)
    }
    render() {
        return (
            <div onClick={this.handleClick}>
                {this.props.data}
            </div>
        )
    }
}
```
重点介绍了需要传参的方式，对于性能比较是要看具体的环境（和浏览器，平台的优化都有关系），没有什么是绝对性能好的。

看到了这篇博客的结论，就想具体实际比较一下：

```
如果每次都在 render 里面的 jsx 去 bind 这个方法，会消耗性能，因为每次bind都会返回一个新函数，重复创建静态函数肯定是不合适的（闭包也是这样，但bind内部有一系列的算法，比闭包复杂多了）
```
### 对于react中使用bind和闭包传参性能的比较

Chrome Version 72.0.3626.119 (Official Build) (64-bit)

react version "16.8.3"

node version  v10.15.1

通过chrome的JavaScript Profiler进行性能分析，发现渲染1千次事件的渲染时间是差不多的（均采用首次刷新渲染）

1. 首先bind方式：
    [![bind方式](https://user-gold-cdn.xitu.io/2019/3/14/1697b2237dd053af?w=780&h=343&f=png&s=16441)](https://user-gold-cdn.xitu.io/2019/3/14/1697b2237dd053af?w=780&h=343&f=png&s=16441)
2. 采用闭包的形式：
[![clipboard.png](https://user-gold-cdn.xitu.io/2019/3/14/1697b230eaec4bc1?w=688&h=335&f=png&s=15507)](https://user-gold-cdn.xitu.io/2019/3/14/1697b230eaec4bc1?w=688&h=335&f=png&s=15507)

3. 采用不带参数的模式：

[![clipboard.png](https://user-gold-cdn.xitu.io/2019/3/14/1697b2458560764a?w=613&h=470&f=png&s=17936)](https://user-gold-cdn.xitu.io/2019/3/14/1697b2458560764a?w=613&h=470&f=png&s=17936)

可以看到性能上双方相差不多，而Stack Overflow上的 
[https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure](https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure) 以及在chrome中各个版本bind和closure以及proxy性能测试（[点击](https://jsperf.com/bind-vs-closure-performace/13)）发现bind是要比closure慢的多，
对于bind的实现如下：
```
Function.prototype.bind = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```
发现内部的实现也是闭包！当然这个不是完整的处理，从实现上bind是对闭包的封装，可读性来说bind好，因此bind是要比closure慢的，但是 v8做了优化，导致在react中差异也不是很大。

v8里面的实现（来自[https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure](https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure)），
```
function FunctionBind(this_arg) { // Length is 1.
  if (!IS_SPEC_FUNCTION(this)) {
    throw new $TypeError('Bind must be called on a function');
  }
  var boundFunction = function () {
    // Poison .arguments and .caller, but is otherwise not detectable.
    "use strict";
    // This function must not use any object literals (Object, Array, RegExp),
    // since the literals-array is being used to store the bound data.
    if (%_IsConstructCall()) {
      return %NewObjectFromBound(boundFunction);
    }
    var bindings = %BoundFunctionGetBindings(boundFunction);

    var argc = %_ArgumentsLength();
    if (argc == 0) {
      return %Apply(bindings[0], bindings[1], bindings, 2, bindings.length - 2);
    }
    if (bindings.length === 2) {
      return %Apply(bindings[0], bindings[1], arguments, 0, argc);
    }
    var bound_argc = bindings.length - 2;
    var argv = new InternalArray(bound_argc + argc);
    for (var i = 0; i < bound_argc; i++) {
      argv[i] = bindings[i + 2];
    }
    for (var j = 0; j < argc; j++) {
      argv[i++] = %_Arguments(j);
    }
    return %Apply(bindings[0], bindings[1], argv, 0, bound_argc + argc);
  };

  %FunctionRemovePrototype(boundFunction);
  var new_length = 0;
  if (%_ClassOf(this) == "Function") {
    // Function or FunctionProxy.
    var old_length = this.length;
    // FunctionProxies might provide a non-UInt32 value. If so, ignore it.
    if ((typeof old_length === "number") &&
        ((old_length >>> 0) === old_length)) {
      var argc = %_ArgumentsLength();
      if (argc > 0) argc--;  // Don't count the thisArg as parameter.
      new_length = old_length - argc;
      if (new_length < 0) new_length = 0;
    }
  }
  // This runtime function finds any remaining arguments on the stack,
  // so we don't pass the arguments object.
  var result = %FunctionBindArguments(boundFunction, this,
                                      this_arg, new_length);

  // We already have caller and arguments properties on functions,
  // which are non-configurable. It therefore makes no sence to
  // try to redefine these as defined by the spec. The spec says
  // that bind should make these throw a TypeError if get or set
  // is called and make them non-enumerable and non-configurable.
  // To be consistent with our normal functions we leave this as it is.
  // TODO(lrn): Do set these to be thrower.
  return result;
```
我们在bind的实现方法里面可以看到一些额外的开销，如'%_IsConstructCall()',这些额外的东西是为了实现bind的规范，这也造成了在大多数情况下bind比简单的闭包慢的情况。
另一方面，bind方法也有稍微的不同，使用Function.prototype.bind创造的函数没有原型属性或者是[[Code]], [[FormalParameters]], 和 [[Scope]] 内部属性。

总之，在bind和closure不成为性能瓶颈的时候，优先考虑可读性，尽量保证代码的简洁

如果有错误或者不严谨的地方，请务必给予指正，十分感谢!

### 参考
1. [https://wulv.site/2017-07-02/react-perf-code.html](https://wulv.site/2017-07-02/react-perf-code.html)
2. [https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure](https://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure)
3. [https://github.com/mqyqingfeng/Blog/issues/12](https://github.com/mqyqingfeng/Blog/issues/12)