事件委托是 js 常见的优化措施，减少了绑定的事件

例子：有一个表格 table，点击其中 td 元素，可以弹出元素里的文本内容。

具体看下面的代码了：
``` 
<table class="table" border="1">
    <tr>
        <td>Hi</td>
        <td>Ha</td>
        <td>
           <span>Ho</span>
        </td>
    </tr>
</table>
```

1. 简单版
``` 
const tableDom = document.querySelector('.table');
tableDom.addEventListener('click', event => {
    if(event.target.tagName.toLowerCase() === 'td'){
        alert(event.target.innerHTML)
    }
})
```
但是这样是有 bug 的，如果 td 里面有一个 span 标签，就没办法触发 事件

2. 进阶版

点击 span 后，递归遍历 span 的祖先元素看其中有没有 td。
``` 
function delegate(element, eventType, selector, fn) {
  element.addEventListener(eventType, event => {
    let el = event.target;
    while (!el.matches(selector)) {
      if (element === el) {
        el = null;
        break;
      }
      el = el.parentNode;
    }

    !!el && fn.call(el, event);
  });

  return element;
}

// 调用

delegate(tableDom, "click", "td", e => {
  alert(e.target.innerHTML);
});
```

在线可以查看[这里](https://codesandbox.io/s/k51n33orv7)