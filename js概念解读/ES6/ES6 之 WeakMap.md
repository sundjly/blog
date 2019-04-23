WeakMap 可能在工作中不常用到，因此更需要进行总结回顾。首先看特性，再看应用场景。

## 特性
1. WeakMap 只接受对象作为键名
``` 
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```
2. WeakMap 的键名所引用的对象是弱引用，WeakMap 的键名所指向的对象，不计入垃圾回收机制：
只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。

正因为它的值不固定，所以它一是没有遍历操作（即没有 keys()、values() 和 entries() 方法），
也没有 size 属性，也不支持 clear 方法。

WeakMap 只有四个方法可用：get()、set()、has()、delete()。

## 应用
1. 在 DOM 对象上保存相关数据： DOM 节点作为键名
``` 
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```
> myElement是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是myElement。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。

2. 数据缓存
> 当我们需要关联对象和数据，比如在不修改原有对象的情况下储存某些属性或者根据对象储存一些计算的值等，
而又不想管理这些数据的死活时非常适合考虑使用 WeakMap。数据缓存就是一个非常好的例子：

``` 
const cache = new WeakMap();
function countOwnKeys(obj) {
    if (cache.has(obj)) {
        console.log('Cached');
        return cache.get(obj);
    } else {
        console.log('Computed');
        const count = Object.keys(obj).length;
        cache.set(obj, count);
        return count;
    }
}
```

3. 私有属性
``` 
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec()
// DONE
```
> 上面代码中，Countdown类的两个内部属性_counter和_action，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。
## 参考
1. https://github.com/mqyqingfeng/Blog/issues/92
2. https://es6.ruanyifeng.com/#docs/set-map#WeakMap