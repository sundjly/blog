1. [【译】8个有用的 CSS 技巧:视差图像，sticky footer 等等](https://juejin.im/post/5cb56ff6e51d456e311649bb?utm_source=gold_browser_extension#heading-2)
- 一直在底部的布局
- hover的时候 zoom  ``
- 视差图像 (Parallax Images)  `background-attachment: fixed;`
- pinteret-style 每个元素的垂直位置都根据其上方元素的高度而变化。

2. 关于一行超出点点
  ```
  width:150px;/*要显示文字的宽度*/
  overflow:hidden; /*超出的部分隐藏起来。*/ 
  white-space:nowrap;/*不显示的地方用省略号...代替*/
  text-overflow:ellipsis;/* 支持 IE */
  ```
  - 多行超出点点：
  ```
    // 3行
    display: -webkit-box;
    -webkit-box-orient:vertical;
    -web-line-clamp:3;
    overflow:hidden;
  ```
  [在框架中一些实际运用注意的地方](https://juejin.im/post/5cb45a06f265da03474df54e)
> -webkit-box-orient: vertical 在使用 webpack 打包的时候这段代码会被删除掉，原因是 optimize-css-assets-webpack-plugin 这个插件的问题
 
 
3. [有哪些好方法能处理 display: inline-block 元素之间出现的空格？](https://www.zhihu.com/question/21468450)

    造成空隙的根本性原因是：空白符（whitespace）。

- 解决方法：设置 font-size:0;或者line-height:0;
    ```
    #demo{
        font-size:0;
        [;font-size:12px;];
        *font-size:0;
        font-family:arial;
        [;letter-spacing:-3px;];
        *letter-spacing:normal;
        *word-spacing:-1px;
    }
    #demo span{
        display:inline-block;
        *display:inline;
        *zoom:1;
        font-size:14px;
        letter-spacing:normal;
        word-spacing:normal;
    }
    ```
4. svg 受外面颜色的控制添加：
```
fill: currentColor;
```

5. box-sizing 的继承问题：伪类需要单独定义
```
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
```


## 参考
1. [【前端词典】提高幸福感的 9 个 CSS 技巧](https://juejin.im/post/5cb45a06f265da03474df54e#heading-14)