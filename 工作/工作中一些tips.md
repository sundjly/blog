1. 判断数据类型用Object.prototype.toString.call()进行判断

```
Object.prototype.toString.call([])
"[object Array]"
Object.prototype.toString.bind([])
ƒ toString() { [native code] }
const toto = Object.prototype.toString.bind([])
undefined
toto()
"[object Array]"
toto({})
"[object Array]"
```
2. 使用Array.includes来处理多重条件
3. if嵌套很多的话，考虑条件的反转
4. 解构赋值对函数有默认值
5. npm i 报错  https://blog.csdn.net/Jane_96/article/details/81451759


6. https://github.com/luciojs/tree-transfer    tree-transfer运用
7. react打包之后，项目部署完以后，刷新页面报错问题
http://www.cnblogs.com/crazycode2/p/9318050.html

```
main.de80fdc9.chunk.js:1 Uncaught SyntaxError: Unexpected token <
```
打开main.de80fdc9.chunk.js发现为html文件

```
<!doctype html>......
```

[
关于react 在打包后：“找不到资源路径”的问题、部署到服务器二级目录 “打开为空白” 的问题](https://blog.csdn.net/Sophie_U/article/details/80006723)

[React填坑之react-router刷新后报错解决方法](https://blog.csdn.net/weixin_39168678/article/details/79756305)

==发现是打包之后采用了相对路径问题==

8. [关于Chrome谷歌浏览器开发者工具网络Network中返回无数据的问题](https://www.cnblogs.com/shengulong/p/8795493.html)
9. 获取字符串的位数：

```

/*
* getStringBytes() 获取字符串的位数
*
* */

export default class StringUtil {
  static getStringBytes(str) {
    let bytes = 0,
      len = str.length,
      codePoint,
      next;
    for (let i = 0; i < len; i++) {
      codePoint = str.charCodeAt(i);

      // Lone surrogates cannot be passed to encodeURI
      if (codePoint >= 0xd800 && codePoint < 0xe000) {
        if (codePoint < 0xdc00 && i + 1 < len) {
          next = str.charCodeAt(i + 1);

          if (next >= 0xdc00 && next < 0xe000) {
            bytes += 4;
            i++;
            continue;
          }
        }
      }

      bytes += codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : 3;
    }
    return bytes;
  }
}

```
10. [UForm](https://github.com/alibaba/uform)--
[面向复杂场景的高性能表单解决方案](https://zhuanlan.zhihu.com/p/62927004)
它引入 Rxjs 将表单联动集中处理，避免在 JSX 中做各种判断；
使用 JSchema 进行表单描述，再配合 React Hook 可以非常方便的做表单拆分，
再也不用担心写出一个上千行的表单组件！


## 第三方收集
1. [工作中遇到的一些问题和处理](https://juejin.im/post/5cb6bf9251882545e068b264?utm_source=gold_browser_extension#heading-10)

2. 合格前端系列第七弹-移动端开发踩过的一些坑 - qiangdada的文章 - 知乎
   https://zhuanlan.zhihu.com/p/30419351
   
3. [写好JavaScript条件语句的5条守则:](https://juejin.im/post/5bdef288e51d450d810a89c6)
    
    1.多重判断时使用 Array.includes

    2.更少的嵌套，尽早 return
    
    3.使用默认参数和解构
    
    4.倾向于遍历对象而不是 Switch 语句
    
    5.对 所有/部分 判断使用 Array.every & Array.some