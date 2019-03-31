## Lisp
Lisp 可以说是函数式的起源。Lisp开创了许多先驱概念，包括：树结构、自动存储器管理、动态类型、条件表达式、高端函数、递归、自主（self-hosting）编译器、读取﹣求值﹣输出循环（英语：Read-Eval-Print Loop，REPL）。

来自[维基百科](https://zh.wikipedia.org/wiki/LISP)

## Lisp 基本语法
``` 
> (+ 1 2)
< 3
> (+ 1 2 3 4)
< 10
> (+ (* 3 3) (* 4 4))
< 25
```

1. 命名（也叫定义，不叫赋值）
``` 
< (define size 5)
> 
< (* size 2)
> 10
```
函数定义：
```
< (define (add a b) (+ a b))
< (add 1 2)
> 3
< (define (square x) (* x x))
< (square 4)
> 16
```
2. 递归求值
``` 
(* (+ 2 (* 4 6))
    (+ 3 5 7))
```
3. if

``` 
(define (absolute x)
    (if (< x 0)
        (- x)
        x))
```

4. 递归 ：顾名思义，有递进和回归
``` 
(factorial 6)
(* 6 (factorial 5))
(* 6 (* 5 (factorial 4)))
(* 6 (* 5 (* 4 (factorial 3))))
(* 6 (* 5 (* 4 (* 3 (factorial 2)))))
(* 6 (* 5 (* 4 (* 3 (* 2 (factorial 1))))))
(* 6 (* 5 (* 4 (* 3 (* 2 1)))))
(* 6 (* 5 (* 4 (* 3 2))))
(* 6 (* 5 (* 4 6)))
(* 6 (* 5 24))
(* 6 120)
720)


// 递归
(define (factorial n)
    (if (= n 1)
        1
        (* n (factorial (- n 1)))))
```
5. 迭代：（如尾递归）每次计算出来的值，都会当做参数传给下一次,从一个状态到下一个状态（有多个变量表示状态，每次更新这几个变量）。
``` 
// 计算n的阶乘
(define (factorial n)
    (fact-iter 1 1 n))
(define (fact-iter result n n-max)
    （if (> n max-n)
        result
        (fact-iter (* n result)
                    (+ n 1)
                    max-n)))

```

6. 高阶函数
在数学和计算机科学中，高阶函数是至少满足下列一个条件的函数：
- 接受一个或多个函数作为输入
- 输出一个函数

## 知识点：
1. 代入法求值
2. 递归与迭代的区别
3. 高阶函数