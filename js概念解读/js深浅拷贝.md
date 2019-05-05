我们把这种复制引用的拷贝方法称之为浅拷贝，与之对应的就是深拷贝，深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。

> 数组的 concat 和 slice 是一种浅拷贝

## JSON.parse(JSON.stringify()) 用于深拷贝（必能拷贝函数）

## 浅拷贝
``` 
const shallowCopy = function(obj) {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是对象
    let newObj = obj instanceof Array ? [] : {};
    // 遍历obj，并且判断是obj的属性才拷贝
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
```

## 深拷贝
深拷贝因为使用递归，性能会不如浅拷贝

要点：
1. 递归
2. 判断类型
3. 检查环（也叫循环引用）
4. 需要忽略原型
``` 
const deepClone = function deepClone(obj) {
  if (typeof obj !== 'object') return;
  const newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
};
```
### 注意 ：for ... of 是用于可迭代对象的，不能用于这里
可以查看 mdn 中关于[`for...of`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)
> for...of语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句

当然这个很简单，还有一些问题没有解决，像 function、date、regExp 和 error 并没有复制成功，因为它们有特殊的构造函数。

### 利用 Reflect 去实现
Reflect.ownKeys()返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响).
``` 
function deepClone(obj) {
  if (typeof obj !== 'object') return;
  let isArray = Array.isArray(obj);
  let cloneObj = isArray ? [...obj] : {...obj};
  Reflect.ownKeys(cloneObj).forEach(key => {
    cloneObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
  });
  return cloneObj;
}
```
### 对象成环 (属性指向自身)
 for..in 实现和 Reflect 实现都会栈溢出,lodash 使用的是栈把对象存储起来了，如果有环对象，就会从栈里检测到，从而直接返回结果,
 避免错误。
 
 设置一个哈希表存储已拷贝过的对象同样可以达到同样的目的，可以使用 WeakMap 作为哈希表。
 使用 WeakMap 作为哈希表，因为它的键是弱引用的，而我们这个场景里键恰好是对象，需要弱引用。
 ``` 
 function deepClone(obj, hash = new WeakMap()) {
     if (!isObject(obj)) {
         return obj
     }
     // 查表
     if (hash.has(obj)) return hash.get(obj)
 
     let isArray = Array.isArray(obj)
     let cloneObj = isArray ? [] : {}
     // 哈希表设值
     hash.set(obj, cloneObj)
 
     let result = Object.keys(obj).map(key => {
         return {
             [key]: deepClone(obj[key], hash)
         }
     })
     return Object.assign(cloneObj, ...result)
 }

 ```
 ###  键不是字符串而是 Symbol
 Symbol 是一种特殊的数据类型，它最大的特点便是独一无二，所以它的深拷贝就是浅拷贝。
 因为 for...in 无法获得 Symbol 类型的键，而 Reflect 是可以获取的。
 
## 参考
1. [深入深入再深入 js 深拷贝对象](https://juejin.im/post/5ad6b72f6fb9a028d375ecf6)
