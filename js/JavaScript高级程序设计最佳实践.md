
[来自JavaScript高级程序设计读书笔记](https://book.douban.com/subject/10546125/)

<!--more-->
### JS最佳实践有以下要求

#### 1.可维护性：

 - 可理解性：理解意图和一般途径
 - 直观性：
 - 可适应性
 - 可拓展性
 - 可调试性

#### 2.代码约定：

1. 可读性：缩进与注释。 以下地方需要进行注释：
　　
    1. 函数和方法：描述目的和用于完成任务使用的算法

    2. 大片段的代码：描述任务的注释
    3.   复杂的算法：
    4.  Hack ：因存在浏览器差异，js代码都会存在一些hack

2. 变量与函数命名
    1. 变量名为名词
    2. 函数名为以动词开始
    3. 变量和函数都应该合乎逻辑，不要担心长度（长度问题通过后处理和压缩）
    
3. 变量类型透明：表示变量数据类型的方式
    1. 初始化：var person=null;//对象 var name="";//字符串
    2. 其他的不常用


#### 3 松散耦合：高耦合，不利于代码修改维护

1. 解耦HTML与JavaScript
2. 解耦css/JavaScript
3. 解耦应用逻辑和事件处理程序

#### 4 编程实践：
1. 尊重对象所有权：
    1. 不要为实例或者原型添加属性
    2. 不要为实例或者原型添加方法
    3. 不要重定义已有的方法
    4. 通过以下方法为对象创建新的功能：
        1. 创建包含对象所需功能的对象
        2. 创建自定义类型。继承需要修改的类型
2. 避免全局变量
3. 避免与null进行比较 ：看到与null的比较尝试替换为一下技术：
    1. 如果值为引用类型，使用instanceof操作符
    2. 如果值为基本类型，用typeof

4. 使用常量：将数据抽象出来变成单独定义的常量的方式


```
var Constants={
INVALID_VLAUE_MSG:"invalid value",
INVALID_VALUE_URL:"/error/invalid.php"
};
function validate(value){
if(!value){
alert(Constants.INVALID_VLAUE_MSG);
location.href=Constants.INVALID_VALUE_URL;
}
}
```

 

关键在于将数据和使用他的逻辑进行分离：
- 重复值：任何在多出用到的值都应该抽取为一个常量
- 用户界面定义字符串——任何用于显示给用户的字符串
- URLs——推荐用一个公共的地方存放url
- 任何可能会更改的值

#### 5 ，性能随着作用域中作用域数量的增加，访问当前作用域以外的变量的时间也在增加。只要减少花费在作用域上时间，就能增加脚本的性能

##### 1. 避免全局查找

```
// 改为
function updateUI(){
/*首先将document对象存放在本地的doc变量中，然后余下的代码替换为原来的document */
var doc=document;
var imgs=doc.getElementsByTagName("img");
for (var index = 0; index < imgs.length; index++) {
imgs[i].title=doc.title+"image"+index;
}
var msg=doc.getElementById("msg");
msg.innerHTML="update complete";
} 
```


##### 2. 避免with语句：with语句可以引入的新的作用域。由于额外的作用域链查找，故而浪费性能

#### 6 ，选择正确的方法：

##### 1. 避免不必要的属性查找： 一旦多次调用对象属性，应该将其存储在局部变量中
##### 2. 优化循环：
    1. 减值迭代：从最大值开始，在循环中不断减值的迭代器更加高效
    2. 简化终止条件：每次循环都会计算终止条件，所以要避免属性查找或者其他O(n)操作
    3. 简化循环体：
    4. 使用后测试循环：最常用的for和while循环都是前测试循环，如do-while是后测试循环，可以避免最终初始条件的计算，因此运行更快
　　　　


```
var i = values.length - 1;
if (i > -1) {
do {
process(value[i]);
} while (--i >= 0);
```

}
##### 3. 展开循环：如果循环迭代次数事先不能确定，考虑使用一种叫duff装置的技术

##### 4. 避免双重解释：js代码想解析js代码的时候存在双重解析惩罚。当时用eval（）函数或者是function构造函数以及setTimeout传入一个字符串参数时都会发生


```
// 避免构造新的函数
var sayName=new Function("alert('hello world');");
```

##### 5. 性能的其他注意事项：
    1. 原生方法较快
    2. switch语句较快
    3. 位运算较快

#### 7.最小化语句数——完成多个操作的单个语句比完成单个操作的多个语句快
1. 多个变量的声明：使用逗号 一个var一起声明
2. 插入迭代符：**var name=value[i];i++;变为var name=value[i++];**
3. 使用数组和对象字变量

#### 8，优化DOM交互
在js各个方面中，DOM是最慢的一部分，DOM操作与交互要消耗大量的时间，因为它需要重新渲染整个页面或者某一个部分。
##### 1. 最小化现场更新（即使页面修改次数 范围 尽量少）：**使用文档片段来构建DOM结构，接着添加到List元素中**


```
/* 最小化现场更新 */
var list = document.getElementById("myList"),
fragment = document.createDocumentFragment(),//创建一个新的空白的文档片段因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流(reflow)(对元素位置和几何上的计算)。
item;
for (var index = 0; index < 10; index++) {
item = document.createElement("li");
fragment.appendChild(item);
item.appendChild(document.createTextNode('item' + index));
}
list.appendChild(fragment);
```


 
##### 2. **使用innerHTML**：对于大的DOM更改，使用innerHTML要比使用标准DOM方法（如createElement（）与appendChild（）等）创建同样的DOM结构快


```
/* 使用innerHTML优化 */
var list = document.getElementById("mylist"),
html = '';
for (var index = 0; index < 10; index++) {
html += "<li>item" + index + "</li>";
}
list.innerHTML = html;
```

 

##### 3. **使用事件代理**：任何可以冒泡的事件，不仅可以在事件目标上进行处理，目标的任何先祖节点上也能处理
##### 4. 注意HTMLCollection
　　HTMLCollection对象对于web性能影响巨大，最小化访问HTMLCollection的次数


```
/* HTMlCollection对象访问次数减少 */
var images=document.getElementsByTagName('img'),
image;
for (var i = 0; i < images.length; i++) {
image = images[i];//把当前的图像赋值给image，在循环内就没有必要访问images的HTMLCollection了
}
```

**发生以下情况时，会返回HTMLCollection对象：**
1. 进行了对getElementsByTagName（）的调用
2. 获取了元素的childNodes属性
3. 获取了元素的attributes属性
4. 访问了特殊的集合：如document.form document.images等

#### 9 压缩：
##### 1. 文件压缩： YUI压缩工具
##### 2. HTTP压缩：大部分的WEB服务器都有HTTP压缩功能