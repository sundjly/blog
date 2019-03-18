1. git commit的时候，提示信息规范是很有好处的，有利于后面的新同事理解，也有利于后续对问题的总结，回顾，主要是摘自：
[你可能会忽略的 Git 提交规范](https://juejin.im/entry/5b429be75188251ac85830ff)以及
[阮一峰老师的Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
2. 具体规则：

```
<type>(<scope>): <subject>
```
- type
    - 用于说明commit的类型，只允许下面7个标识：
    
```
    feat： 新功能（feature）
    fix： 修补Bug
    docs： 文档（documentation）
    style： 格式（不影响代码运行的变动）
    refactor： 重构
    test： 增加测试
    chore： 构建过程或辅助工具的变动
```
- scope
    - 用于说明commit影响范围，比如数据层，控制层，视图层
- subject
    - 是commit的简短描述 
    
```
    1.以动词开头，使用第一人称现在时，比如change，而不是changed或changes
    2.第一个字母小写
    3.结尾不加句号（.）
```

3. [一些常见的需要了解的git操作](https://segmentfault.com/a/1190000015676846?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly)
4. [git reset --hard 操作解决办法 ](https://www.cnblogs.com/hope-markup/p/6683522.html)

5. [git远程仓库错误提交回退--](https://blog.csdn.net/jackyzheng/article/details/76672921)

```
git reset --hard A1  //本地回退到A1版本
git push -f origin dev //强制推送到远程仓库的 dev分支
```
6. 使用`git rebase`避免无谓的合并---https://ihower.tw/blog/archives/3843
