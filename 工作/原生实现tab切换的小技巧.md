
```
<!--sundjly
    2017年7月18日17:31:01
-->
```
## 前言
在印象当中，js实现一个tab的切换，原生实现，一般是遍历tabs，找到对应点击的tab改变的它的css样式，然后把其他css样式重置：

具体实现

```
<!-- HTML-->
<style>
        div {
            width: 100;
            border: 1px solid red;
        }
        
        .正常显示风格 {
            color: blue;
            background: white;
            float: left;
        }
        
        .突出显示风格 {
            color: red;
            background: blue;
            float: left;
        }
        
        .关联显示区风格 {
            clear: both;
            display: none;
        }
    </style>
    
<body>
    <div id=标签id1 class="正常显示风格" onmouseover="ZL_标签(this,'突出显示风格','关联显示区id1')">s1</div>
    <div id=标签id2 class="正常显示风格" onmouseover="ZL_标签(this,'突出显示风格','关联显示区id2')">s2</div>
    <div id=标签id3 class="正常显示风格" onmouseover="ZL_标签(this,'突出显示风格','关联显示区id3')">s3</div>
    <div class="关联显示区风格" id=关联显示区id1>11</div>
    <div class="关联显示区风格" id=关联显示区id2>22</div>
    <div class="关联显示区风格" id=关联显示区id3>33</div>
</body>

```
接下来是js实现：

```
var ZL_标签 = function(obj, className, ContentID) {
    if (this.oldObj != undefined) {
        //非第一次调用时,先恢复上次操作对象样式和隐藏其关联DIV  
        this.oldObj.className = this.oldStyle;
        document.getElementById(this.oldContentID).style.display = 'none';
    }
    //进行本次(包括第一次)操作  
    //先保存本次环境  
    this.oldObj = obj;
    this.oldStyle = obj.className;
    this.oldContentID = ContentID;
    //设置本次显示  
    obj.className = className;
    document.getElementById(ContentID).style.display = 'block';
};
```

其思路就是缓存上一次点击的一些信息，然后不用遍历tabs，就只用在两个DOM进行切换。

这个在很多地方都可以使用的呢！


## 参考
1. http://blog.csdn.net/theforever/article/details/5832244
