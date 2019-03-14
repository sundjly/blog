
在写的js中测试时遇到了Uncaught TypeError: Cannot read property ‘substr’ of undefined的问题，js关键代码为：
<!--more-->


```
let Img = data[i].technician.portrait;//后台接收到的图片src的地址
//alert(typeof Img);
 if (Img!= '' || Img != undefined) {
     Img = SYS + Img.substr(1); //实现image的src的拼接                  
 } else {
     Img = '--';              
 }
```

其中是if在判断时出了问题，因为从后台传输过来数据为 
Img=undefined；（存在technician这个对象不存在portrait属性） 
Img != undefined这样的判断是无效的。因此进入了条件为true的方法： 
Img = SYS + Img.substr(1); Img不是对象，调用substr()方法就会出现问题

查阅一下资料才发现在判断是否为undefined应该用typeof 不能直接判断 
代码改为：


```
var Img = arr[i].technician.portrait;
 if (typeof Img != "undefined") {                   
     Img = SYS + Img.substr(1);
  } else {
     Img = '';                 
  }
```
不过在谷歌测试发现写成if(Img == undefined)也是能编译成功的 
不过为了避免后台没有传值过来，可以进一步优化代码：


```
var Img = arr[i].technician.portrait||'--';//避免传过来Img为undefined或者null导致的编译错误
Img = SYS + Img.substr(1);
```
总结：** 在代码中要对不确定的值进行判断，避免出现错误**