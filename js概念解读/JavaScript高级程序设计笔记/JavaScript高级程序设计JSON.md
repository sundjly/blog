
[来自JavaScript高级程序设计读书笔记](https://book.douban.com/subject/10546125/)

<!--more-->

为了解决XML过于繁琐，冗长 json成为了数据传输 存储的常用标准
json——一种结构化数据的格式
1. json的语法可以表示为以下三种类型的值：
- 简单值：与js相同的语法，表示字符串，数值，布尔值，null 但不支持undefined
- 对象：表示一组复杂的键值对 json中对象要求给 属性 加引号（必须是双引号），而且没有末尾的分号
- 数组：表示一组有序的值的列表
　　不支持变量，函数和对象实例
2. 可以把json数据结构解析为有用的js对象 更加方便 故而流行
3. 定义了全局对象JSON，有两个方法：
    1. stringify（） 把js对象序列化为json字符串 
　　可以接受3个参数：第一个是要序列化的js对象 另一个一个是过滤器 第3个是一个选项，表示是否在json字符串中保留缩进（可以是数字或者字符串）
    2. parse（） 把json字符串解析为原生JavaScript值
4. 把一个对象传入JSON.stringify()，序列化对象的顺序如下：
    1. 如果存在toJSON（）方法而且能通过它取得有效的值，则调用该方法，否则，返回对象本身
    2. 如果提供了第二个参数，用用这个过滤器，传入函数过滤器的值是第（1）步的返回值
    3. 对第（2）步返回的每个值进行相应的序列化
    4. 如果提供了第3个参数，执行相应的格式化

5. parse（） 接受两个参数 第一个是要解析的json字符串 第二个参数是一个函数（该函数传入key与value，返回值）



```
// parse();
var book = {
title: "professional javascript",
author: ["Nicholas C. Zaras"],
edition: 3,
year: 3,
releaseYear: new Data(2011, 11, 1)
};
var jsonText = JSON.stringify(book);
var bookCopy = JSON.parse(jsonText, function (key, value) {
if (key == "releaseYear") {
return new Data(value);
} else {
return value;
}
});
alert(bookCopy.releaseYear.getFullYear());
```

