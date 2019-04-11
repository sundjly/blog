
[来自JavaScript高级程序设计读书笔记](https://book.douban.com/subject/10546125/)

<!--more-->

Ajax出现，表单序列化成为一种常见的需求。浏览器把表单数据发送给服务器：

- 对表单的字段的名称和值进行URL编码
- 使用和号（&）分隔    
- 不发送禁用的表单字段   
- 只发送勾选的复选框和单选按钮  
- 不发送type为reset和button的按钮   
- 多选框中的每一项的值单独一个条目


```
function serialize(form) {
    var parts = [],
        field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;
    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];
        switch (field.type) {
            case "select-one":
            case "select-multiple":
                if (field.name.length) {
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[i];
                        if (option.selected) {
                            optValue = "";
                            if (option.hasAttribute) { //判断有没有hasAttribute()的函数。函数用于确认字段有没有value属性
                                optValue = (option.hasAttribute("value") ? option.value : option.text);
                            } else {
                                optValue = (option.attrubute('value').specified ? option.value : option.text);
                            }
                        //    encodeURIComponent() 函数可把字符串作为 URI 组件进行编码
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                        }
 
                    }
                }
                break;
            case undefied: //字段集
            case "file": //文件输入
            case "submit": //提交按钮
            case "reset": //重置按钮
            case "button": //自定义按钮
                break;
            case "radio": //单选框
            case "checkbox":
                if (!field.checked) {
                    break;
                    /* 执行默认操作 */
                }
            default:
                // 不包含没有名字的字段
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
 
        }
 
    }
    return parts.join("&");
}
```
