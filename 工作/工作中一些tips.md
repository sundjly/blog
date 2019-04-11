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
