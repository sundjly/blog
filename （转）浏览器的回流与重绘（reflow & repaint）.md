
原文链接：https://juejin.im/post/5a9923e9518825558251c96a
在讨论回流与重绘之前，我们要知道：
1. 浏览器使用流失布局模型（Flow Based Layout）
2. 浏览器会把HTML解析成DOM，把CSS解析成CSSOM， DOM和CSSOM合并就产生了RenderTree
3. 有了RenderTree，我们就知道了所有节点的样式，然后计算他们在页面上的大小和位置，最后把节点绘制在页面上
4. 由于浏览器使用流式布局，对Render Tree的计算通常只需要遍历一次就可以完成，但table及其内部元素除外，他们可能需要多次计算，通常要花3倍与同等元素的时间，这也是为什么避免使用table布局的原因之一

### 回流（Reflow）
当Render Tree中部分或全部元素的**尺寸、结构、或者某些属性发生改变时**，浏览器重新渲染部分或全部文档的过程

导致回流的操作：
1. 页面首次渲染
2. 浏览器窗口大小发生改变
3. 元素尺寸或位置发生改变
4. 元素的内容变化（文字数量或图片大小）
5. 元素的字体大小变化
6. 添加或者删除可见的DOM元素
7. 激活CSS伪类（列如：   :hover）
8. 查询某些属性或者调用某些方法


一些常用的会导致回流的属性和方法
1. clientWidth， clientHeight, clientTop,clientLeft
2. offsetWidth, offsetHeight， offsetTop， offsetleft
3. scrollWidth, scrollHeight, scrollTop, scrollLeft
4. scrollIntoView()， scrollIntoViewNeeded()
5. getComputedStyle()
6. getBoundingClientReact()
7. scrollTo()


### 重绘（Repaint）
当页面中**元素样式的改变不影响**他在文档流中的位置时（如;color, background-color,visibility),浏览器会将新的样式赋予给元素并重新绘制它，这个过程称为重绘

### 性能影响
**回流比重绘的代价更高**
有时即使仅仅回流一个单一的元素，它的父元素以及任何跟它的元素也会产生回流。

现代浏览器会对频繁的回流或重绘操作进行优化：

浏览器会维护一个队列，把所有引起回流和重绘的操作放在队列中，如果队列中任务数量或者时间间隔达到一个阈值时，浏览器就会清空队列，进行一次批处理，这样可以把多次回流和重绘变成一次

当你访问以下属性或方法时，浏览器会立刻清空队列：
1. clientWidth， clientHeight, clientTop, clientLeft
2. offsetWidth，offsetHeight, offsetTop, offsetLeft
3. scrollWidth, scrollHeight,scrollTop, scrollLeft
4. width， height
5. getComputedStyle()
6. getBoundingClientRect()

因为队列中可能会有影响代这些属性或方法返回值的操作，即使你希望获取的信息与队列中操作引发的改变无光，浏览器也会强行清空队列，确保你拿到的值是最精确的

### 如何避免
#### css
1. 避免使用table布局
2. 尽可能在DOM树的最末端改变class
3. 避免设置多层内联样式
4. 将动画应用到position属性为absolute或fixed的元素上
5. 避免使用css表达式（列如calc()）

#### JavaScript
1. 避免频繁操作样式，最好一次重写style属性，或者将样式列表定义为class并一次性更改class属性
2. 避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后把它添加到文档中
3. 可以先为元素设置display：none，操作结束后再把它显示出来，因为display属性为none的元素上进行DOM操作不会引发回流和重绘
4. 避免频繁读取会引发回流，重绘的属性，如果确定需要多次使用，就用一个变量缓存起来
5. 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流