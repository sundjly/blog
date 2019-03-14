
[来自JavaScript高级程序设计读书笔记](https://book.douban.com/subject/10546125/)

<!--more-->

#### 1. 离线检测：
H5定义了navigator.online属性，为true 表示设备能上网 
还定义了两个相关事件：online和offline

#### 2 数据存储

1. cookie——HTTP cookie，**客户端存储会话信息的**。该标准要求服务器对任意的HTTP请求发送Set-Cookie HTTP头作为响应的一部分‘


```
/* 
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value;expire=expiration_time;path=domain_path;secure
Other-header: other-header-value
这个HTTP响应设置以name为名称，以value为值的一个cookie，名称和值在传送时都必须时URL编码
*/
```



2. cookie组成：
    1. 名称
    2. 值
    3. 域
    4. 路径
    5. 失效时间
    6. 安全标志：cookie只有在使用SSL连接时才发送到服务器

　　　所有的值和名字都经过URL编码，必须使用decodeURIComponent（）解析

　　　基本的cookie操作：读取，写入和删除

　　子cookie：为了绕开浏览器的单域名下cookie的限制，使用了子cookie（subcookie）
　　格式：
　　　　name=name1=value1&name2=value2&name3=value3



```
/* 设置子cookie */
var subcookieUtil = {
get: function (name, subName) {
var subcookies = this.getAll(name);
if (subcookies) {
return subcookies[subName];
} else {
return null;
}
},
getAll: function (name) {
var cookieName = encodeURIComponent(name) + "=",
cookieStart = document.cookie.indexOf(cookieName),
cookieValue,
cookieEnd,
subcookies,
i, len,
parts,
result = {};
if (cookieStart) {
cookieEnd = document.cookie.indexOf(";", cookieStart);
if (cookieEnd == -1) {
cookieEnd = document.cookie.length;
}
cookieValue = docuemnt.cookie.substring(cookieStart + cookieName.length, cookieEnd);
if (cookieValue.length > 0) {
subcookies = cookieValue.split("&");
for (i = 0, len = subcookies.length; i < len; i++) {
parts = subcookies[i].split("=");
result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
}
return result;
}
}
return null;
},
set: function (name, subName, value, expires, path, domain, secure) {
var subcookies = this.getAll(name) || {};
suvcookies[subName] = value;
this.setAll(name, subcookies, exprires, path, domain, secure);
},
setAll: function (name, subcookies, exprires, path, domain, secure) {
var cookieText = encodeURIComponent(name) + "=",
subcookieParts = new Array(),
subName;
for (subName in subcookies) {
if (subcookies.hasOwnProperty(subName) && subName.length > 0) {
subcookieParts.push(encodeURIComponent(subName) + "=" + encodeURIComponent(subcookies[subName]));
}
}
if (subcookieParts.length > 0) {
cookieText += subcookieParts.join("&");
if (expires instanceof Date) {
cookieText += ";expires=" + expires.toGMTString();
}
if (path) {
cookieText += ";path=" + path;
}
if (doamin) {
cookieText += ";domain=" + domain;
}
if (secure) {
cookieText += ';secure';
}
}
document.cookie = cookieText;
},
//删除一个子cookie 而不影响其他
unset: function (name, subName, path, domain, secure) {
var subcookies = this.getAll(name);
if (subcookies) {
delete subcookies(subName);
this.setAll(name, subcookies, null, path, domain, secure);
}
},
// 删除整个cookie
unsetAll: function (name, path, domian, secure) {
this.setAll(name, null, new Date(), path, domain, secure);
}
}
```
 

**由于所有的cookie都会由浏览器作为请求头发送，不能存储大量信息，不能存储重要 敏感的数据（他人可以访问到）**


#### 3. Web存储机制
##### web storage——两个目标：

    1. 提供一种cookie以外的存储途径

    2. 提供一种存储大量可以跨会话存在的数据的机制

    Storage对象有方法： getItem（name） setItem(name,value)

##### web storage规范了两个window的属性：

1. sessionStorage：该数据至保持到浏览器关闭，它可以跨越页面刷新而存在——适用于仅针对会话的小段数据的存储（）
    
2. globalStorage：跨越会话存储数据，但要指定哪些域可以访问


```
// 保存只能www.wrox.com域下才能访问的name 类似于Ajax的同源策咯
globalStorage["www.wrox.com"].name="Nichoas";
```


##### 3. **localStorage** 取代了globalStorage：
不能给localStorage 指定任何访问规则。要访问同一个localStorage ，页面必须来自同一个域名（子域名无效），使用同一种协议，在同一个端口上，相当于　globalStorage[location.host] -事先不能确定域名时用

##### 4. storage事件：
任何对storage对象进行修改，都会触发storage事件，这个事件的event有以下属性


```
document.addEventListener("storage",function(event){
alert(event.domain);
},false);
```

    a. domain：域名改变
    b. key 删除、设置键名
    c. newValue 设置值 
    d. oldValue
##### 5. 限制：
localStorage而言，大多数浏览器是5MB限制，Chrome对每个来源的限制是2.5MB；对于sessionStorage 因浏览器而异 一般是2.5MB
##### 6. IndexedDB——indexed database API
是浏览器中保存结构化数据的一种数据库（使用对象保存数据）http://www.zhangxinxu.com/wordpress/2017/07/html5-indexeddb-js-example/



```
var request,database,db;
request=indexedDB.open('admin');
request.onerror=function(event){
alert('something bad happened while trying to open'+event.target.errorCode);
};
request.onsuccess=function(event){
database=event.target.result; db=database;
};
```


###### a. 设计操作是异步的，大多数操作以请求的方式进行有onerror和onsuccess事件处理程序

###### b. 一开始为indexedDB指定版本号——setVersion（）方法

###### c. 对象存储空间：（需要把对象里面的一个唯一属性作为键）

```
//创建一个键为username的名字是users的存储空间 add（）/ push（）添加 /更新数据

var store=db.createObjectStore("users",{keyPath:"username"});
```
 
###### d. 查询数据：var transaction=db.transaction();

###### e. 游标查询：游标是指向结果集的指针。在存储空间上调用openCursor（） 

    1. 键的范围4中方法：only（） lowerBound（） upBound（） bound（）
    2. 设定游标的方向（可选的第二个参数）
    
###### f. 索引：一个对象存储空间指定多个键，将ID作为主键。创建主键：


```
var store=db.transaction("users").objectStore("users");
var index=store.createIndex("username","username",{unique:false});//设置索引值
var index=store.index("username");//获取索引值
```

###### g. 并发问题：indexedDB虽然是异步的
但还是有并发操作问题，（浏览器两个不同的标签页打开了同一个页面）就要指定版本号setVersion（），指定onversionchange事件处理程序，立即关闭




```
// 并发处理
var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
var request=indexedDB.open("admin");
request.onsuccess=function(event){
var database=event.target.result;
database.onversionchange=function(){
database.close();
};
};
```

###### h，限制：
indexedDB只能由同源（相同的协议，域和端口）占用磁盘空间有限制，chrome限制5M