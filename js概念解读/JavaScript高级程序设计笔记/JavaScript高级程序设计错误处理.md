
[来自JavaScript高级程序设计读书笔记](https://book.douban.com/subject/10546125/)

<!--more-->

#### 1 JS中错误类型有以下几种

1. Error 是基本类型 其他错误都继承该类型
2. EvalError 使用eval（）函数时发生异常
3. RangeError
4. ReferenceError 找不到对象的情况下（导致object expected ），访问不存在的对象的时发生
5. SyntaxError 语法错误
6. TypeError 变量中保存着意外类型，或者在访问不存在的方法时
7. URLError


```
try {
someFunction();
} catch (error) {
if (error instanceof TypeError) {
// c处理类型错误
} else if (error instanceof ReferenceError) {
// 处理引用错误
} else {
// 处理其他类型错误
} 
}
```


 

#### 2.与try-catch语句相配的还有一个throw操作符，用于随时抛出自定义的错误


```
function process(values) {
if (!(values instanceof Array)) {
throw new Error("process():argument must be an array");//自定义错误的类型
}
values.sort();
for (var index = 0; index < values.length; index++) {
if (value[i] > 100) {
return values[i];
} 
}
return -1;
}
```


在js开发中尽量关注函数和可能导致函数执行失败的因素


**3. 任何没有通过try-catch处理的错误都会触发window对象的error事件。只能用DOM0级事件，即onerror接受3个参数：错误信息，错误所在的URL和行号（大多数情况下，只有错误信息有用）**

4. 图像也支持error事件


```
// 图像支持error事件
var image = new Image();
image.addEventListener('error', function (event) {
alert("image not load");
}, false);
image.src = "smile.gif"; //指定不存在的图像
```

#### 5 js中常见的错误类型

1. 类型转化错误：发生在使用了某个操作符（如js中的（==）和（！=）或者if while等流控制语句中的非布尔值）
2. 数据类型错误 （在使用变量和函数参数之前，要检查数据类型是否会造成错误）
3. 通信错误 js与后台服务器的通信
注意：将数据发送给服务器之前（通过url），使用encodeURLComponent（）对数据进行编码

#### 6.把错误记录到服务器上
集中保存错误日志，以便于找到错误原因


```

// 记录错误到服务器
function logError(sev, meg) {
//第一个参数说明表示错误的严重程度 meg值错误的类型自定义的信息 
var img = new Image();
img.src = "log.php?sev=" + encodeURIComponent(sev) + "&meg=" + encodeURIComponent(meg);
}
var array = [];
for (var index = 0; index < array.length; index++) {
try {
array[i].init();
} catch (error) {
logError("nonfatal", "module init failed:" + error.message);
}
}
```


#### 7.console对象具有下列方法：

 error（message） 错误信息记录在控制台
 info（message） 将信息性消息记录到控制台
 log（message） 将一般消息记录到控制台
 warn（message） 将警告消息

#### 8.// 一般对于大型程序 自定义错误都是通过assert（）函数抛出


```
function assert(condition, message) {
if (!condition) {
throw new Error(message);
}
}
// 运用
function divide(num1, num2) {
assert(typeof num1 == "number" && typeof num2 == "number", "divide():both arguments must be numbers");
return num1 / num2;
}
```

9. 当使用innerHTML和outerHTML以下列方法指定HTML时，就会发生未知运行错误（unknown runtime error）：

    1. 是把块级元素插入行内元素当中
    2. 访问表格任意部分（如\<table> \<tbody>）