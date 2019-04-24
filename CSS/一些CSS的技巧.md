1. [【译】8个有用的 CSS 技巧:视差图像，sticky footer 等等](https://juejin.im/post/5cb56ff6e51d456e311649bb?utm_source=gold_browser_extension#heading-2)
- 一直在底部的布局
- hover的时候 zoom  ``
- 视差图像 (Parallax Images)  `background-attachment: fixed;`
- pinteret-style 每个元素的垂直位置都根据其上方元素的高度而变化。

2. 关于超出点点
  ```
  width:150px;/*要显示文字的宽度*/
  overflow:hidden; /*超出的部分隐藏起来。*/ 
  white-space:nowrap;/*不显示的地方用省略号...代替*/
  text-overflow:ellipsis;/* 支持 IE */
  ```
  